import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import Constants from 'expo-constants';

import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA_WcSuuterCfIMTWRp-zv8bGeYGH90tCk",
  authDomain: "iron-app-87b7b.firebaseapp.com",
  projectId: "iron-app-87b7b",
  storageBucket: "iron-app-87b7b.firebasestorage.app",
  messagingSenderId: "43392954526",
  appId: "1:43392954526:web:b42368b0a8d62f22c4cb8f"
};

console.log("🔥 FIREBASE CONFIG:", firebaseConfig);


// Initialize Firebase 
const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

const db = getFirestore(app);


export { app, auth, db};
