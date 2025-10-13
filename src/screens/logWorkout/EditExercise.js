import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useTheme } from '../ThemeProvider';
import { useNavigation, useRoute } from '@react-navigation/native';
import useWorkoutStore from '../../store/useWorkoutStore';
import { Ionicons } from '@expo/vector-icons';

export default function EditExerciseScreen() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const styles = getStyles(isDark);

  const navigation = useNavigation();
  const route = useRoute();

  const exercise = route.params?.exercise;

  const updateExercise = useWorkoutStore((state) => state.updateExercise);

  const [name, setName] = useState(exercise.name);
  const [sets, setSets] = useState(exercise.sets || []);
  const movementType = exercise.movementType; 


  const handleSetChange = (index, field, value) => {
    const updatedSets = [...sets];
    updatedSets[index] = { ...updatedSets[index], [field]: value };
    setSets(updatedSets);
  };

  const addSet = () => {
    setSets([...sets, movementType === 'timed' ? { reps: '', weight: '' } : { reps: '', weight: '' }]);
  };

  const removeSet = (index) => {
    const updatedSets = sets.filter((_, i) => i !== index);
    setSets(updatedSets);
  };

  const handleSave = () => {
    if(sets.length !== 0){
      if (!name.trim()) {
        Alert.alert('Validation', 'Exercise name cannot be empty.');
        return;
      }
      // Validate sets
      for (let i = 0; i < sets.length; i++) {
        if (!sets[i].reps) {
          Alert.alert('Validation', `Please fill reps/time for set ${i + 1}.`);
          return;
        }
      }

      const sanitizedSets = sets.map((set) => {
      const parsedWeight = parseFloat(set.weight);
        return {
          ...set,
          weight: !isNaN(parsedWeight) ? parsedWeight : 0, // default to 0
        };
      });

      const updatedExercise = { ...exercise, name, sets: sanitizedSets };
      updateExercise(updatedExercise);
      navigation.goBack();
    }
    else{
      Alert.alert('Sets cannot be empty!');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Exercise Name</Text>
      <TextInput
        style={[styles.input, { backgroundColor: isDark ? '#222' : '#eee', color: isDark ? '#fff' : '#000' }]}
        value={name}
        onChangeText={setName}
        placeholder="Exercise Name"
        placeholderTextColor={isDark ? '#888' : '#aaa'}
      />

      <Text style={styles.label}>Sets</Text>
      {sets.map((set, index) => (
        <View key={index} style={styles.setRow}>
          <Text style={[styles.setLabel, { color: isDark ? '#eee' : '#000' }]}>Set {index + 1}</Text>

          <TextInput
            placeholder={movementType === 'timed' ? 'Time (sec)' : 'Reps'}
            placeholderTextColor={isDark ? '#888' : '#aaa'}
            keyboardType="numeric"
            value={sets[index].reps?.toString()}
            onChangeText={(val) => handleSetChange(index, 'reps', val)}
            style={[styles.input, { flex: 1, marginRight: 8, backgroundColor: isDark ? '#222' : '#eee', color: isDark ? '#fff' : '#000' }]}
          />

          <TextInput
            placeholder={movementType === 'timed' ? 'Weight (optional)' : 'Weight'}
            placeholderTextColor={isDark ? '#888' : '#aaa'}
            keyboardType="numeric"
            value={sets[index].weight?.toString()}
            onChangeText={(val) => handleSetChange(index, 'weight', val)}
            style={[styles.input, { flex: 1, marginRight: 8, backgroundColor: isDark ? '#222' : '#eee', color: isDark ? '#fff' : '#000' }]}
          />

          <TouchableOpacity onPress={() => removeSet(index)} style={styles.removeSetBtn}>
            <Ionicons name="trash" size={24} color={isDark ? '#fff' : '#000'} />
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity onPress={addSet} style={styles.addSetBtn}>
        <Ionicons name="add-circle-outline" size={28} color="#007aff" />
        <Text style={styles.addSetText}>Add Set</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
        <Text style={styles.saveText}>Save Exercise</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const getStyles = (isDark) =>
  StyleSheet.create({
    container: {
      padding: 20,
      backgroundColor: isDark ? '#000' : '#fff',
      flexGrow: 1,
    },
    label: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 8,
      color: isDark ? '#fff' : '#000',
    },
    input: {
      borderRadius: 10,
      padding: 12,
      fontSize: 16,
      marginBottom: 12,
    },
    setRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    setLabel: {
      width: 60,
      fontSize: 16,
      fontWeight: '600',
    },
    removeSetBtn: {
      padding: 8,
    },
    addSetBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 10,
      marginBottom: 30,
    },
    addSetText: {
      fontSize: 16,
      color: '#007aff',
      marginLeft: 6,
    },
    saveBtn: {
      backgroundColor: '#007aff',
      borderRadius: 10,
      paddingVertical: 14,
      alignItems: 'center',
    },
    saveText: {
      color: '#fff',
      fontWeight: '600',
      fontSize: 18,
    },
  });