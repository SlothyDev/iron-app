import React, { useEffect, useState , useCallback} from 'react';
import { View, FlatList, Text, SafeAreaView } from 'react-native';
import { getGlobalFeed } from './FeedService';
import FeedCard from './FeedCard';
import { useTheme } from '../ThemeProvider';
import { useFocusEffect } from '@react-navigation/native';

export default function HomeScreen({ navigation }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        setLoading(true);
        const data = await getGlobalFeed();
        setPosts(data);
        setLoading(false);
      };

      load();
    }, [])
  );

  if (loading) {
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
      
      {/* 🔥 HEADER */}
      <View style={{
        paddingHorizontal: 16,
        paddingTop: 10,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: isDark ? '#1a1a1a' : '#e6e6e6',
      }}>
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
          color: isDark ? '#888' : '#666'
        }}>
          Global Training Feed
        </Text>
      </View>

      {/* 🔥 FEED */}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          padding: 12,
          paddingBottom: 100,
        }}
        showsVerticalScrollIndicator={false}
        style={{
          backgroundColor: isDark ? '#000' : '#f5f5f5'
        }}
        renderItem={({ item }) => (
          <FeedCard
            post={item}
            isDark={isDark}
            onPress={() =>
              navigation.navigate('PostViewer', {
                postId: item.id,
              })
            }
          />
        )}
        ItemSeparatorComponent={() => (
          <View style={{ height: 12 }} />
        )}
      />
    </SafeAreaView>
  );
}