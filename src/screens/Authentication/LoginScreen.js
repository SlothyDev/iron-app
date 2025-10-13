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

import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/firebase';

import LoadingOverlay from '../../components/LoadingOverlay';


export default function LoginScreen({ navigation }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [error, setError] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const [loading, setLoading] = useState(false);


  const handleLogin = async () => {
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (user.emailVerified) {
      alert('Login successful!');
      navigation.replace('AuthLoading');
    } else {
      alert('Please verify your email before logging in.');
      await auth.signOut();
      return;
    } }
    catch (err) {
      if (err.code === 'auth/user-not-found') {
        setError('No user found with this email.');
      } else if (err.code === 'auth/wrong-password') {
        setError('Incorrect password.');
      } else if (err.code === 'auth/invalid-email') {
        setError('The email address is not valid.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many requests. Wait a few moments before retrying.');
      } else {
        console.log(err)
        setError('Login failed. Please try again.');
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
      <ScrollView contentContainerStyle={{ paddingTop: 40, flexGrow: 1, justifyContent: 'center' }}
  keyboardShouldPersistTaps="handled">
        <View style={styles.contentContainer}>
            {!keyboardVisible && (
            <>
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
            </>
            )}

            <View style={styles.form}>
            <Text style={styles.title}>Log In</Text>

            <TextInput
                placeholder="Email"
                placeholderTextColor="#aaa"
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
                placeholderTextColor="#aaa"
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                textContentType="password"
                autoComplete="password"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Text style={styles.toggleText}>{showPassword ? 'Hide' : 'Show'} Password</Text>
            </TouchableOpacity>

            {error !== '' && <Text style={styles.errorText}>{error}</Text>}

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Log In</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                <Text style={styles.link}>Don't have an account? Sign Up</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('ResetPassword')}>
                <Text style={styles.link}>Forgot Password?</Text>
            </TouchableOpacity>
            </View>
        </View>
      </ScrollView>
      {loading && <LoadingOverlay />}
    </KeyboardAvoidingView>
  );
}

const getStyles = (isDark, keyboardVisible) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 12,
      backgroundColor: isDark ? '#000' : '#fff',
    },
    contentContainer: {
      flex: 1,
      justifyContent: keyboardVisible ? 'flex-start' : 'center',
      paddingTop: keyboardVisible ? 120 : 0,
      paddingBottom: 50,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 2,
      paddingHorizontal: 20,
      borderRadius: 12,
      backgroundColor: isDark ? '#000' : '#FFF',
      marginBottom: 10,
    },
    headerText: {
      flex: 1,
      fontSize: 80,
      fontWeight: 'bold',
      textAlign: 'center',
      color: isDark ? '#fff' : '#000',
    },
    subheader: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 2,
      paddingHorizontal: 20,
      borderRadius: 12,
      backgroundColor: isDark ? '#000' : '#FFF',
      marginBottom: 30,
    },
    subheaderText: {
      flex: 1,
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 0,
      color: isDark ? '#ccc' : '#111',
    },
    logo: {
      width: 80,
      height: 80,
    },
    form: {
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
    toggleText: {
        color: isDark ? '#fff' : '#000',
        textAlign: 'center',
        marginBottom: 20
    },
    button: {
      backgroundColor: isDark ? '#fff' : '#111',
      borderRadius: 10,
      paddingVertical: 14,
      alignItems: 'center',
      marginBottom: 20,
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
      marginBottom: 55,
    },
    errorText: {
      color: '#ff4d4f',
      fontSize: 14,
      marginBottom: 10,
      textAlign: 'center',
    },
  });