import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  LayoutAnimation,
  Alert,
  ScrollView
} from 'react-native';

import { useTheme } from '.././ThemeProvider';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../firebase/firebase';

export default function ResetPasswordScreen({ navigation }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const handleResetPassword = async () => {
    setError('');

    if (!email) {
      setError('Please enter your email.');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert(
        'Password Reset',
        `A password reset email has been sent to ${email}.`,
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
    } catch (err) {
      if (err.code === 'auth/user-not-found') {
        setError('No account found with this email.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email address.');
      } else {
        setError('Failed to send reset email. Please try again.');
      }
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
      <ScrollView>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>Reset Password</Text>

          <TextInput
            placeholder="Enter your email"
            placeholderTextColor={isDark ? '#888' : '#aaa'}
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            textContentType="emailAddress"
            autoComplete="email"
          />

          {error !== '' && <Text style={styles.errorText}>{error}</Text>}

          <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
            <Text style={styles.buttonText}>Send Reset Email</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.link}>Back to Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    paddingTop: keyboardVisible ? 50 : 100,
    paddingBottom: 50,
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
  buttonText: {
    color: isDark ? '#000' : '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  link: {
    color: isDark ? '#aaa' : '#444',
    textAlign: 'center',
    fontSize: 14,
    marginTop: 20,
  },
  errorText: {
    color: '#ff4d4f',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
});