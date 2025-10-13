import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth } from '../../firebase/firebase';
import { db } from '../../firebase/firebase'; 

// Check if user is logged in and whether or not profile is complete

export default function AuthLoadingScreen({ navigation }) {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
          const data = userDoc.data();
            console.log(data.profileComplete)
          if (data.profileComplete) {

            navigation.replace('MainTabs');
          } else {

              navigation.replace('ProfileSetup');
          }
        }
        else {
          console.log("No Firestore user doc, signing out...");
          await auth.signOut();
          navigation.replace('Login');
        }
        
        } catch (error) {
          console.error('Error checking user profile:', error);
          navigation.replace('Login');
        }
      } else {
        navigation.replace('Login');
      }
    });

    return unsubscribe;
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
}