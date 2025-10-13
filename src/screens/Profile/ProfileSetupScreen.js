import React, { useState } from 'react';
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
  Platform
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getFirestore, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, app } from '../../firebase/firebase';

import { useTheme } from '.././ThemeProvider';
import { MaterialIcons } from '@expo/vector-icons';

const db = getFirestore(app);
const storage = getStorage(app);

const defaultUrl = 'https://firebasestorage.googleapis.com/v0/b/iron-app-87b7b.firebasestorage.app/o/profile_pics%2Fdefaultpfp.png?alt=media&token=85480eae-f512-4b23-be58-9bc093e1564d'


import GenderPicker from '../../components/GenderPicker';

export default function ProfileSetupScreen({ navigation }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [name, setName] = useState('');
  const [bio, setBio] = useState('');

  const [gender, setGender] = useState('');

  const [age, setAge] = useState('');

  const [heightCm, setHeightCm] = useState('');
  const [heightFeet, setHeightFeet] = useState('');
  const [heightInches, setHeightInches] = useState('');

  const [weight, setWeight] = useState('');

  const [goals, setGoals] = useState('');

  const [gymExperience, setGymExperience] = useState('Beginner');

  const [benchPress, setBenchPress] = useState('');
  const [squat, setSquat] = useState('');
  const [deadlift, setDeadlift] = useState('');

  const [imageUri, setImageUri] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [unitSystem, setUnitSystem] = useState('imperial');

  const user = auth.currentUser;
  const styles = getStyles(isDark);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'Permission to access media library is required!');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) setImageUri(result.assets[0].uri);
  };

  const uploadImageAsync = async (uri) => {
    setUploading(true);
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const storageRef = ref(storage, `profile_pics/${user.uid}.jpg`);
      await uploadBytes(storageRef, blob);
      return await getDownloadURL(storageRef);
    } catch (e) {
      Alert.alert('Upload failed', e.message);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!name.trim()) return Alert.alert('Missing Name', 'Please enter your name.');
    if (!gender) return Alert.alert('Missing Gender', 'Please select your gender.');
    if (!age || isNaN(age) || Number(age) < 13 || Number(age) > 100)
      return Alert.alert('Invalid Age', 'Please enter a valid age between 13 and 100.');

    let heightValid = false;
    if (unitSystem === 'metric') {
      heightValid = heightCm && !isNaN(heightCm) && Number(heightCm) >= 100 && Number(heightCm) <= 250;
    } else {
      const ft = Number(heightFeet);
      const inch = Number(heightInches);
      heightValid = !isNaN(ft) && ft >= 3 && ft <= 8 && !isNaN(inch) && inch >= 0 && inch < 12;
    }

    if (!heightValid) {
      Alert.alert(
        'Invalid Height',
        unitSystem === 'metric'
          ? 'Please enter a height between 100 and 250 cm.'
          : 'Please enter a valid height in feet and inches.'
      );
      return;
    }

    setUploading(true);
    let profilePicUrl;

    try {
      if (imageUri) {
        // User picked an image
        profilePicUrl = await uploadImageAsync(imageUri);
      } else {
        // No image picked → copy default to user's own filename
        const defaultResponse = await fetch(defaultUrl);
        const defaultBlob = await defaultResponse.blob();
        const storageRef = ref(storage, `profile_pics/${user.uid}.jpg`);
        await uploadBytes(storageRef, defaultBlob);
        profilePicUrl = await getDownloadURL(storageRef);
      }

      const convertToLbs = (val) => {
        const num = Number(val);
        if (isNaN(num) || num <= 0) return 0;
        return unitSystem === 'metric' ? num * 2.20462 : num;
      };

      let heightInInches;
      if (unitSystem === 'metric') {
        heightInInches = parseFloat(heightCm) / 2.54;
      } else {
        const ft = parseFloat(heightFeet) || 0;
        const inch = parseFloat(heightInches) || 0;
        heightInInches = ft * 12 + inch;
      }

      const userProfile = {
        uid: user.uid,
        name: name.trim(),
        bio: bio.trim() || 'No bio yet',
        gender,
        age: Math.round(Number(age)),
        height: Math.round(Number(heightInInches)),
        weight,
        goals: goals.trim() || 'No goals set',
        profilePicUrl,
        gymExperience,
        prs: {
          benchPress: Math.round(convertToLbs(benchPress)),
          squat: Math.round(convertToLbs(squat)),
          deadlift: Math.round(convertToLbs(deadlift)),
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        profileComplete: true,
      };

      await updateDoc(doc(db, 'users', user.uid), userProfile);
      Alert.alert('Success', 'Profile saved!');
      navigation.replace('MainTabs');

    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: isDark ? '#000' : '#fff' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Set Up Your Profile</Text>

        <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.profileImage} />
          ) : (
            <View style={styles.placeholder}>
                <MaterialIcons name="edit" size={40} color="#888" />
            </View>
          )}
        </TouchableOpacity>

        <TextInput
          placeholder="Display Name"
          placeholderTextColor={isDark ? '#888' : '#aaa'}
          value={name}
          onChangeText={setName}
          style={styles.input}
        />

        <TextInput
          placeholder="Bio (optional)"
          placeholderTextColor={isDark ? '#888' : '#aaa'}
          value={bio}
          onChangeText={setBio}
          style={[styles.input, { height: 80 }]}
          multiline
        />

        <GenderPicker gender={gender} setGender={setGender} isDark={isDark} />

        <TextInput
          placeholder="Age"
          placeholderTextColor={isDark ? '#888' : '#aaa'}
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
          style={styles.input}
        />

        <View style={styles.unitToggle}>
          <TouchableOpacity
            style={[styles.unitButton, unitSystem === 'imperial' && styles.unitSelected]}
            onPress={() => setUnitSystem('imperial')}
          >
          <Text style={unitSystem === 'imperial' ? styles.unitSelectedText : styles.unitText}>Imperial (lbs/in)</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.unitButton, unitSystem === 'metric' && styles.unitSelected]}
            onPress={() => setUnitSystem('metric')}
          >
            <Text style={unitSystem === 'metric' ? styles.unitSelectedText : styles.unitText}>Metric (kg/cm)</Text>
          </TouchableOpacity>
        </View>

        {unitSystem === 'metric' ? (
        <TextInput
          placeholder="Height (cm)"
          placeholderTextColor={isDark ? '#888' : '#aaa'}
          value={heightCm}
          onChangeText={setHeightCm}
          keyboardType="numeric"
          style={styles.input}
        />
      ) : (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <TextInput
            placeholder="Feet"
            placeholderTextColor={isDark ? '#888' : '#aaa'}
            value={heightFeet}
            onChangeText={setHeightFeet}
            keyboardType="numeric"
            style={[styles.input, { flex: 1, marginRight: 5 }]}
          />
          <TextInput
            placeholder="Inches"
            placeholderTextColor={isDark ? '#888' : '#aaa'}
            value={heightInches}
            onChangeText={setHeightInches}
            keyboardType="numeric"
            style={[styles.input, { flex: 1, marginLeft: 5 }]}
          />
        </View>
        )}

        <View>
          <TextInput
              placeholder="Weight"
              placeholderTextColor={isDark ? '#888' : '#aaa'}
              value={weight}
              onChangeText={setWeight}
              keyboardType="numeric"
              style={[styles.input, { flex: 1 }]}
          />
        </View>
        <TextInput
          placeholder="Your fitness goals (e.g. Lose fat, build muscle...) (optional)"
          placeholderTextColor={isDark ? '#888' : '#aaa'}
          value={goals}
          onChangeText={setGoals}
          style={[styles.input, { height: 80 }]}
          multiline
        />

        <Text style={styles.label}>Gym Experience</Text>
        <View style={styles.experienceOptions}>
          {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
            <TouchableOpacity
              key={level}
              style={[
                styles.expOption,
                gymExperience === level && styles.expOptionSelected,
              ]}
              onPress={() => setGymExperience(level)}
            >
              <Text
                style={[
                  styles.expOptionText,
                  gymExperience === level && styles.expSelectedText,
                ]}
              >
                {level}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Personal Records (PRs)</Text>
        <View style={styles.liftInputRow}>
          <TextInput
            placeholder="Bench Press"
            placeholderTextColor={isDark ? '#888' : '#aaa'}
            value={benchPress}
            onChangeText={setBenchPress}
            keyboardType="numeric"
            style={[styles.input, { flex: 1 }]}
          />
          <Text style={styles.unitLabel}>{unitSystem === 'metric' ? 'kg' : 'lbs'}</Text>
        </View>

        <View style={styles.liftInputRow}>
          <TextInput
            placeholder="Squat"
            placeholderTextColor={isDark ? '#888' : '#aaa'}
            value={squat}
            onChangeText={setSquat}
            keyboardType="numeric"
            style={[styles.input, { flex: 1 }]}
          />
          <Text style={styles.unitLabel}>{unitSystem === 'metric' ? 'kg' : 'lbs'}</Text>
        </View>

        <View style={styles.liftInputRow}>
          <TextInput
            placeholder="Deadlift"
            placeholderTextColor={isDark ? '#888' : '#aaa'}
            value={deadlift}
            onChangeText={setDeadlift}
            keyboardType="numeric"
            style={[styles.input, { flex: 1 }]}
          />
          <Text style={styles.unitLabel}>{unitSystem === 'metric' ? 'kg' : 'lbs'}</Text>
        </View>

        <TouchableOpacity
          style={[styles.button, uploading && styles.buttonDisabled]}
          onPress={handleSaveProfile}
          disabled={uploading}
        >
          {uploading ? (
            <ActivityIndicator color={isDark ? '#000' : '#fff'} />
          ) : (
            <Text style={styles.buttonText}>Save Profile</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const getStyles = (isDark) =>
  StyleSheet.create({
    container: {
      flexGrow: 1,
      padding: 12,
      backgroundColor: isDark ? '#000' : '#fff',
      justifyContent: 'center',
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      marginTop: 50,
      marginBottom: 32,
      textAlign: 'center',
      color: isDark ? '#fff' : '#222',
    },
    imagePicker: {
      alignSelf: 'center',
      marginBottom: 24,
      borderRadius: 100,
      overflow: 'hidden',
      borderWidth: 2,
      borderColor: isDark ? '#fff' : '#111',
      width: 120,
      height: 120,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: isDark ? '#1a1a1a' : '#f0f0f0',
    },
    profileImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    placeholder: {
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
    },
    placeholderText: {
      color: isDark ? '#888' : '#555',
      fontSize: 14,
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
    label: {
      color: isDark ? '#ccc' : '#222',
      fontWeight: 'bold',
      fontSize: 16,
      marginBottom: 8,
      marginTop: 12,
    },
    experienceOptions: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: 20,
    },
    expOption: {
      borderWidth: 1,
      borderColor: isDark ? '#555' : '#ccc',
      borderRadius: 20,
      paddingVertical: 8,
      paddingHorizontal: 20,
    },
    expOptionSelected: {
      backgroundColor: isDark ? '#fff' : '#111',
      borderColor: isDark ? '#fff' : '#111',
    },
    expOptionText: {
      color: isDark ? '#aaa' : '#444',
      fontWeight: '600',
    },
    expSelectedText: {
      color: isDark ? '#000' : '#fff',
    },
    button: {
      backgroundColor: isDark ? '#fff' : '#111',
      borderRadius: 10,
      paddingVertical: 16,
      marginTop: 10,
      alignItems: 'center',
    },
    buttonDisabled: {
       opacity: 0.6,
    },
    buttonText: {
      color: isDark ? '#000' : '#fff',
      fontWeight: 'bold',
      fontSize: 18,
    },
    pickerContainer: {
      backgroundColor: isDark ? '#1a1a1a' : '#f0f0f0',
      borderRadius: 10,
      marginBottom: 20,
    },
    picker: {
      color: isDark ? '#fff' : '#000',
      height: 50,
      width: '100%',
    },
    unitToggle: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginVertical: 10,
    },
    unitButton: {
      flex: 1,
      padding: 12,
      marginHorizontal: 5,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: '#888',
      backgroundColor: '#eee',
      alignItems: 'center',
    },
    unitSelected: {
      backgroundColor: '#007aff',
      borderColor: '#007aff',
    },
    unitText: {
      color: '#333',
    },
    unitSelectedText: {
      color: '#fff',
      fontWeight: 'bold',
    },
    liftInputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 15,
    },

    unitLabel: {
      marginLeft: 10,
      fontSize: 16,
      color: isDark ? '#ccc' : '#555',
      width: 30,
    },
});