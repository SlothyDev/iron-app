import React, { useState, useEffect, useLayoutEffect, } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  RefreshControl
} from 'react-native';

import { getFirestore, doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, app } from '../../firebase/firebase';
import { useIsFocused,   useFocusEffect } from '@react-navigation/native';

import { useTheme } from '.././ThemeProvider';
import { MaterialIcons } from '@expo/vector-icons';
import { IconButton } from "react-native-paper";

import { useSettings } from '../../components/settings/SettingsContext';
import { lbsToKg, inchesToCm } from '../../components/settings/conversions';

import MuscleMap from '../logWorkout/SVGCreator';
import MuscleBackMap from '../logWorkout/SVGCreatorBack';

import RadarChart from '../../components/RadarChart';

import { WeeklyWorkouts } from '../../components/WeeklyWorkouts';

const db = getFirestore(app);
const storage = getStorage(app);



export default function ProfileScreen({ navigation, settings }) {

  const { units } = useSettings();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const styles = getStyles(isDark);
  const isFocused = useIsFocused();
  const [refreshing, setRefreshing] = useState(false);

  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);




  const loadUserProfile = async () => {
      try {
        const userId = auth.currentUser.uid;
        const userDocSnap = await getDoc(doc(db, 'users', userId));

        if (userDocSnap.exists()) {
          const data = userDocSnap.data();

          // Dynamically generate image path
          const imageRef = ref(storage, `profile_pics/${userId}.jpg`);
          try {
            const photoUrl = await getDownloadURL(imageRef);
            data.photoUrl = photoUrl;
          } catch (e) {
            console.warn('No profile picture found:', e.message);
            data.photoUrl = null;
          }

          setUserProfile(data);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        Alert.alert('Error', 'Failed to load user profile data.');
      } finally {
        setLoading(false);
      }
    };


  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate('EditProfile')}
          style={{ marginRight: 16 }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <IconButton
            icon="pencil"
            size={24}
            onPress={() => navigation.navigate("EditProfile")}
          />
        </TouchableOpacity>
      ),
    });
    }, []);

    useEffect(() => {
    if (isFocused) {
      loadUserProfile();
    }
    }, [isFocused]);

  useEffect(() => {
    const unsubscribe = navigation.getParent()?.addListener('tabPress', e => {
      if (isFocused) {
        loadUserProfile();
      }
    });
    return unsubscribe;
  }, [navigation, isFocused]);

  useFocusEffect(
    React.useCallback(() => {
      loadUserProfile();
    }, [])
  );

  const formatHeight = (inches) => {
    const feet = Math.floor(inches / 12);
    const remainingInches = inches % 12;
    return `${feet}' ${remainingInches}"`;
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    
    <KeyboardAvoidingView 
    
      style={{ flex: 1, backgroundColor: isDark ? '#000' : '#fff' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled"
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={async () => {
            setRefreshing(true);
            await loadUserProfile();
            setRefreshing(false);
          }}
        />
      }>
        
        {userProfile?.photoUrl ? (
          <Image source={{ uri: userProfile.photoUrl }} style={styles.profileImage} />
        ) : (
          <View style={styles.placeholder}>
            <MaterialIcons name="person" size={60} color={isDark ? '#888' : '#666'} />
          </View>
        )}

        {/* User Info */}
        <Text style={styles.name}>{userProfile?.name || 'User'}</Text>
        <Text style={styles.username}>{'@' + userProfile?.username || 'Username'}</Text>

        {/* Age, Height, Weight Section */}
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Stats</Text>
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{userProfile?.age ?? '-'}</Text>
              <Text style={styles.statLabel}>Age</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>
                {units == 'metric' && (
                <Text style={styles.statValue}>
                {userProfile?.height ? `${inchesToCm(userProfile.height).toFixed(0)} cm` : '-'}
                </Text>
                )}
                {units == 'imperial' && (
                    <Text style={styles.statValue}>
                    {userProfile?.height ? formatHeight(userProfile.height) : '-'}
                    </Text>
                )}
              </Text>
              <Text style={styles.statLabel}>Height</Text>
            </View>
            <View style={styles.statBox}>
              {units == 'metric' && (
                <Text style={styles.statValue}>
                {userProfile?.weight ? `${lbsToKg(userProfile.weight).toFixed(1)} kg` : '-'}
                </Text>
              )}
              {units == 'imperial' && (
                <Text style={styles.statValue}>
                {userProfile?.weight ? `${Number(userProfile.weight).toFixed(1)} lbs` : '-'}
                </Text>
              )}
              
              <Text style={styles.statLabel}>Weight</Text>
            </View>
          </View>
        </View>



        {/* PR Section */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Personal Records</Text>
          <View style={styles.prRow}>
            <Text style={styles.prLabel}>Bench:</Text>
            {units == 'metric' && (
                <Text style={styles.prValue}>
                {userProfile?.prs.benchPress ? `${lbsToKg(userProfile.prs.benchPress).toFixed(0)} kg` : '-'}
                </Text>
              )}
            {units == 'imperial' && (
                <Text style={styles.prValue}>
                {userProfile?.prs.benchPress ? `${Number(userProfile.prs.benchPress).toFixed(0)} lbs` : '-'}
                </Text>
            )}
          </View>
          <View style={styles.prRow}>
            <Text style={styles.prLabel}>Squat:</Text>
            {units == 'metric' && (
                <Text style={styles.prValue}>
                {userProfile?.prs.squat ? `${lbsToKg(userProfile.prs.squat).toFixed(0)} kg` : '-'}
                </Text>
              )}
            {units == 'imperial' && (
                <Text style={styles.prValue}>
                {userProfile?.prs.squat ? `${Number(userProfile.prs.squat).toFixed(0)} lbs` : '-'}
                </Text>
            )}
          </View>
          <View style={styles.prRow}>
            <Text style={styles.prLabel}>Deadlift:</Text>
            {units == 'metric' && (
                <Text style={styles.prValue}>
                {userProfile?.prs.deadlift ? `${lbsToKg(userProfile.prs.deadlift).toFixed(0)} kg` : '-'}
                </Text>
              )}
            {units == 'imperial' && (
                <Text style={styles.prValue}>
                {userProfile?.prs.deadlift ? `${Number(userProfile.prs.deadlift).toFixed(0)} lbs` : '-'}
                </Text>
            )}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>This week</Text>
          <WeeklyWorkouts navigation={navigation}/>
        </View>


        <TouchableOpacity
          style={styles.logoutButton}
          onPress={async () => {
            try {
              await auth.signOut();
              Alert.alert('Succesfuly logged out');
              navigation.navigate('Login')
            } catch (error) {
              Alert.alert('Logout Failed', error.message);
            }
          }}
        >
        <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>
        
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const getStyles = (isDark) =>
  StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: isDark ? '#000' : '#fff',
    flexGrow: 1,
    },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: isDark ? '#fff' : '#000',
    marginBottom: 20,
    alignSelf: 'center',
    },
  imagePicker: {
    alignSelf: 'center',
    marginBottom: 20,
    },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    marginTop: 50,
    borderColor: isDark ? '#fff' : '#000',
    alignSelf: 'center',
    justifyContent: 'center',
    },
  placeholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginTop: 50,
    backgroundColor: isDark ? '#222' : '#ddd',
    justifyContent: 'center',
    alignSelf: 'center',
    borderWidth: 2,
    borderColor: isDark ? '#555' : '#aaa',
    },
  input: {
    borderWidth: 1,
    borderColor: isDark ? '#555' : '#ccc',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    color: isDark ? '#fff' : '#000',
    marginBottom: 15,
    fontSize: 16,
    },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: isDark ? '#ccc' : '#555',
    marginBottom: 8,
    },
  experienceOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    },
  expOption: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: isDark ? '#555' : '#ccc',
    borderRadius: 10,
    alignItems: 'center',
    },
  expOptionSelected: {
    backgroundColor: isDark ? '#1e90ff' : '#007aff',
    borderColor: isDark ? '#1e90ff' : '#007aff',
    },
  expOptionText: {
    color: isDark ? '#ccc' : '#555',
    fontWeight: '500',
    },
  expSelectedText: {
    color: '#fff',
    fontWeight: '700',
    },
  button: {
    backgroundColor: isDark ? '#1e90ff' : '#007aff',
    paddingVertical: 15,
    borderRadius: 15,
    marginTop: 20,
    alignItems: 'center',
    },
  buttonDisabled: {
    opacity: 0.6,
    },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    },
    name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: isDark ? '#fff' : '#000',
    textAlign: 'center',
    marginTop: 15,
  },
  username: {
    fontSize: 14,
    color: isDark ? '#aaa' : '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    backgroundColor: isDark ? '#111' : '#f9f9f9',
    borderRadius: 15,
    padding: 20,
    shadowColor: isDark ? '#000' : '#ccc',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: isDark ? '#fff' : '#000',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: isDark ? '#444' : '#ccc',
    paddingBottom: 5,
  },
  prRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 6,
  },
  prLabel: {
    fontSize: 16,
    color: isDark ? '#ccc' : '#333',
  },
  prValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: isDark ? '#fff' : '#000',
  },
  
  infoCard: {
    backgroundColor: isDark ? '#111' : '#f9f9f9',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: isDark ? '#000' : '#ccc',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },

  statBox: {
    alignItems: 'center',
    flex: 1,
  },

  statValue: {
    fontSize: 22,
    fontWeight: '700',
    color: isDark ? '#fff' : '#000',
  },

  statLabel: {
    fontSize: 14,
    color: isDark ? '#aaa' : '#666',
    marginTop: 4,
    fontWeight: '600',
  },
  logoutButton: {
        backgroundColor: 'red',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
      },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
});
