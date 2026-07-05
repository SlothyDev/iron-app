import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  LayoutAnimation,
  Alert,
  ScrollView
} from 'react-native';

import { useTheme } from '.././ThemeProvider';

import LoadingOverlay from '../../components/LoadingOverlay';


import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
} from 'firebase/auth';

import { auth, db, } from '../../firebase/firebase';
import { doc, setDoc, getDoc, getDocs, collection, query, where  } from 'firebase/firestore';


export default function SignUpScreen({ navigation }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [loading, setLoading] = useState(false);


  const isUsernameAvailable = async (username) => {
    try {
      const usernameRef = doc(db, 'usernames', username.trim().toLowerCase());
      const usernameSnap = await getDoc(usernameRef);

      return !usernameSnap.exists();
    } catch (error) {
      console.error("Error checking username availability:", error);
      Alert.alert("Error!", error.message);
      throw error;
    }
  };

  const handleSignUp = async () => {

    setError('');
    if (!username || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    const isPasswordValid = (password) => {
      const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
      return regex.test(password);
    };
    if (!isPasswordValid(password)) {
      setError('Password must be at least 8 characters and include uppercase, lowercase, and a number.');
      return;
    }
    const available = await isUsernameAvailable(username);
    console.log("Here");
    if (!available) {
      setError('Username already taken.');
      return;
    }
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await updateProfile(user, { displayName: username });
      await sendEmailVerification(user).then(() => {
        console.log("Verification email sent");
      }).catch(e => console.error("Verification failed", e));      console.log(username, email)

      await setDoc(doc(db, "usernames", username.trim().toLowerCase()), {
        uid: user.uid,
      });
      
      await setDoc(doc(db, 'users', user.uid), {
        name: '',
        username: username.trim().toLowerCase(),
        email: email,
        bio: '',
        profilePic: '',
        experienceLevel: '',
        prs: {},
        profileComplete: false 
      });

      console.log("User signed up and doc ref made.");
      Alert.alert('Welcome!', `Hi ${username}, a verification email has been sent to ${email}. Please verify to continue.`);
      await auth.signOut()
      navigation.navigate('Login')
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError('That email is already in use.');
      } else if (err.code === 'auth/invalid-email') {
        setError('The email address is not valid.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password should be at least 8 characters, and include an upper case, lower case, and at least one number.');
      } else {
        setError('Signup failed. Please try again.');
        console.log(err);
      }
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', () => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setKeyboardVisible(true);
    });
    const hideSub = Keyboard.addListener('keyboardDidHide', () => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setKeyboardVisible(false);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const styles = getStyles(isDark, keyboardVisible);


  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={styles.contentContainer}>

          {!keyboardVisible && (
            <View style={styles.centeredHeaderContainer}>
              <View style={styles.header}>
                <Text style={styles.headerText}>IRON</Text>
                <Image
                  source={isDark ? require('../../../assets/logo-dark.png') : require('../../../assets/logo-light.png')}
                  style={styles.logo}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.subheader}>
                <Text style={styles.subheaderText}>As Iron Sharpens Iron: Grow Together</Text>
              </View>
            </View>
          )}

          <View style={styles.form}>
            <Text style={styles.title}>Create Account</Text>

            <TextInput
              placeholder="Username"
              placeholderTextColor={isDark ? '#888' : '#aaa'}
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              
            />

            <TextInput
              placeholder="Email"
              placeholderTextColor={isDark ? '#888' : '#aaa'}
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              textContentType="emailAddress"  
              autoComplete="email" 
            />

            <TextInput
              placeholder="Password"
              placeholderTextColor={isDark ? '#888' : '#aaa'}
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              textContentType="password"
              autoComplete="password"
            />
            <TextInput
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showPassword}
            style={styles.input}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Text style={styles.toggleText}>{showPassword ? 'Hide' : 'Show'} Password</Text>
            </TouchableOpacity>

            {error !== '' && <Text style={styles.errorText}>{error}</Text>}

            <TouchableOpacity style={styles.button} onPress={handleSignUp}>
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.link}>Already have an account? Log in</Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
      {loading && <LoadingOverlay />}
    </KeyboardAvoidingView>
    
  );
}

const getStyles = (isDark, keyboardVisible) => StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: isDark ? '#000' : '#fff',
  },
  contentContainer: {
    flex: 1,
    justifyContent: keyboardVisible ? 'flex-start' : 'center',
    paddingTop: keyboardVisible ? 50 : 0,
    paddingBottom: 50,
  },
  centeredHeaderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 80,
  },
  header: {
    backgroundColor: isDark ? '#000' : '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  headerText: {
    color: isDark ? '#fff' : '#000',
    fontSize: 80,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  subheader: {
    backgroundColor: isDark ? '#000' : '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 30,
  },
  subheaderText: {
    color: isDark ? '#ccc' : '#111',
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  logo: {
    width: 80,
    height: 80,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 32,
    textAlign: 'center',
    color: isDark ? '#fff' : '#222',
  },
  input: {
    backgroundColor: isDark ? '#1a1a1a' : '#f0f0f0',
    color: isDark ? '#fff' : '#000',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: isDark ? '#fff' : '#111',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 10,
  },
  toggleText: {
    color: isDark ? '#fff' : '#000',
    textAlign: 'center',
    marginBottom: 10
  },
  buttonText: {
    color: isDark ? '#000' : '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  link: {
    color: isDark ? '#aaa' : '#444',
    textAlign: 'center',
    fontSize: 14,
    marginBottom: 110,
  },
  errorText: {
    color: '#ff4d4f',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
});