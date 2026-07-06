import React, { useEffect, useState, useRef } from 'react';
import { View, FlatList, Text, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FeedCard from './FeedCard';
import { useTheme } from '../ThemeProvider';
import { toggleLike, isPostLiked } from '../../components/PostInteractions';
import ResumeWorkoutModal from '../../components/ResumeWorkoutModal';
import useWorkoutStore from '../../store/useWorkoutStore';

import { auth, db } from '../../firebase/firebase';

import { onAuthStateChanged } from 'firebase/auth';

import {
  collection,
  query,
  orderBy,
  onSnapshot,

} from 'firebase/firestore';

export default function HomeScreen({ navigation }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const likeCache = useRef({});

  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState({});
  const [initializing, setInitializing] = useState(true);
  const [userReady, setUserReady] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) setUserReady(true);
    });

    return unsub;
  }, []);

  const isRunning = useWorkoutStore((s)=>s.isRunning);
  const elapsed = useWorkoutStore((s)=>s.elapsed);
  const exercises = useWorkoutStore((s)=>s.exercises);
  const endSession = useWorkoutStore((s)=>s.endSession);

  const hydrated = useWorkoutStore.persist.hasHydrated();

  const [ready, setReady] = useState(hydrated);

  useEffect(() => {
    const unsub = useWorkoutStore.persist.onFinishHydration(() => {
      setReady(true);
    });

    return unsub;
  }, []);

  const [showResume, setShowResume] = useState(false);

  useEffect(() => {
    if (ready && isRunning) {
      setShowResume(true);
    }
  }, [ready, isRunning]);

  

  const loadLikes = async (data) => {
    const results = await Promise.all(
      data.map(async (post) => {
        try {
          const liked = await isPostLiked(post.id);
          return [post.id, liked];
        } catch {
          return [post.id, false];
        }
      })
    );

    const likeMap = Object.fromEntries(results);
    setLikedPosts(likeMap);
  };

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));

    const unsub = onSnapshot(q, async (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setPosts(data);
      setInitializing(false);

      loadLikes(data); // always try, safe inside helper
    });

    return unsub;
  }, []);

  const handleLike = async (postId) => {
    const current = likedPosts[postId];

    // optimistic UI
    setLikedPosts(prev => ({
      ...prev,
      [postId]: !current,
    }));

    setPosts(prev =>
      prev.map(p =>
        p.id === postId
          ? {
              ...p,
              likeCount: (p.likeCount || 0) + (current ? -1 : 1),
            }
          : p
      )
    );

    try {
      await toggleLike(postId);
    } catch (e) {
      // rollback
      setLikedPosts(prev => ({
        ...prev,
        [postId]: current,
      }));
    }
  };

  if (initializing) {
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: isDark ? '#000' : '#fff'
      }}>
        <Text style={{ color: isDark ? '#fff' : '#000' }}>
          Loading IRON...
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{
      flex: 1,
      backgroundColor: isDark ? '#000' : '#f5f5f5'
    }}>

      {/* RESUME WORKOUT POPUP */}

      <ResumeWorkoutModal
        visible={showResume}

        elapsed={elapsed}

        exerciseCount={exercises.length}

        onResume={() => {
          setShowResume(false);

          navigation.navigate('LogWorkout', {
            screen: 'WorkoutSession',
          });
        }}

        onDiscard={()=>{
          endSession();
          setShowResume(false);
        }}
      />
      
      {/* HEADER */}
      <View style={{
        paddingHorizontal: 16,
        paddingTop: 10,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: isDark ? '#1a1a1a' : '#e6e6e6',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <View>
          <Text style={{
            fontSize: 28,
            fontWeight: '800',
            color: isDark ? '#fff' : '#000',
            letterSpacing: 2,
          }}>
            IRON
          </Text>

          <Text style={{
            fontSize: 12,
            marginTop: 2,
            color: isDark ? '#888' : '#666',
          }}>
            Global Training Feed
          </Text>
        </View>

        <Image
          source={
            isDark
              ? require('../../../assets/logo-dark.png')
              : require('../../../assets/logo-light.png')
          }
          resizeMode="contain"
          style={{ width: 40, height: 40 }}
        />
      </View>

      {/* FEED */}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingHorizontal: 12,
          paddingTop: 10,
          paddingBottom: 100,
        }}
        ItemSeparatorComponent={() => (
          <View style={{ height: 12 }} />
        )}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <FeedCard
            post={item}
            isDark={isDark}
            liked={!!likedPosts[item.id]}
            onLike={() => handleLike(item.id)}
            onComment={() =>
              navigation.navigate('Comments', {
                postId: item.id,
              })
            }
            onPress={() =>
              navigation.navigate('PostViewer', {
                postId: item.id,
              })
            }
          />
        )}
      />
    </SafeAreaView>
  );
}