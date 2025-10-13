import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import dayjs from 'dayjs';
import { useNavigation, useRoute } from '@react-navigation/native';
import { doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebase/firebase';

import { useTheme } from './ThemeProvider';
import DateTimePicker from '@react-native-community/datetimepicker';

const EditWorkoutScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { workout } = route.params;

  // ✅ single source of truth for editing
  const [editableWorkout, setEditableWorkout] = useState(workout);
  const [showPicker, setShowPicker] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const styles = getStyles(isDark);

  const handleSave = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert('Error', 'User not logged in');
        return;
      }

      const workoutRef = doc(db, 'users', user.uid, 'workouts', workout.id);

      await updateDoc(workoutRef, {
        ...editableWorkout,
        updatedAt: new Date(),
      });

      navigation.goBack();
    } catch (err) {
      console.error('Error updating workout:', err);
      Alert.alert('Error', 'Failed to update workout');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.inner}>
      <Text style={styles.label}>Title</Text>
      <TextInput
        value={editableWorkout.title}
        onChangeText={(text) => setEditableWorkout({ ...editableWorkout, title: text })}
        style={styles.input}
        placeholder="Workout title"
      />

      <Text style={styles.label}>Notes</Text>
      <TextInput
        value={editableWorkout.notes}
        onChangeText={(text) => setEditableWorkout({ ...editableWorkout, notes: text })}
        style={[styles.input, { height: 100 }]}
        placeholder="Add workout notes..."
        multiline
      />

      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setShowPicker(true)}
      >
        <Text style={styles.label}>Date</Text>
        <Text style={styles.dateText}>{dayjs(editableWorkout.date?.toDate ? editableWorkout.date.toDate() : editableWorkout.date).format('MMM D, YYYY h:mm A')}</Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={editableWorkout.date?.toDate ? editableWorkout.date.toDate() : new Date(editableWorkout.date)}
          mode="datetime"
          display="default"
          onChange={(event, selectedDate) => {
            setShowPicker(false);
            if (selectedDate) {
              setEditableWorkout({ ...editableWorkout, date: selectedDate });
            }
          }}
        />
      )}

      <Text style={styles.label}>Exercises</Text>
      {editableWorkout.exercises && editableWorkout.exercises.length > 0 ? (
        editableWorkout.exercises.map((exercise, exIndex) => (
          <View key={exercise.id || exIndex} style={styles.exerciseBox}>
            {/* Exercise name editable */}
            <TextInput
              style={styles.exerciseNameInput}
              value={exercise.name}
              onChangeText={(text) => {
                const updatedExercises = [...editableWorkout.exercises];
                updatedExercises[exIndex].name = text;
                setEditableWorkout({ ...editableWorkout, exercises: updatedExercises });
              }}
            />

            {exercise.sets?.map((set, setIndex) => (
              <View key={setIndex} style={styles.setRow}>
                <Text style={styles.setLabel}>Set {setIndex + 1}:</Text>
                <TextInput
                  style={styles.setInput}
                  keyboardType="numeric"
                  value={String(set.weight)}
                  onChangeText={(text) => {
                    const updatedExercises = [...editableWorkout.exercises];
                    updatedExercises[exIndex].sets[setIndex].weight = Number(text);
                    setEditableWorkout({ ...editableWorkout, exercises: updatedExercises });
                  }}
                  placeholder="Weight"
                />
                <Text style={{ marginHorizontal: 4 }}>×</Text>
                <TextInput
                  style={styles.setInput}
                  keyboardType="numeric"
                  value={String(set.reps)}
                  onChangeText={(text) => {
                    const updatedExercises = [...editableWorkout.exercises];
                    updatedExercises[exIndex].sets[setIndex].reps = Number(text);
                    setEditableWorkout({ ...editableWorkout, exercises: updatedExercises });
                  }}
                  placeholder="Reps"
                />
              </View>
            ))}
          </View>
        ))
      ) : (
        <Text style={{ color: '#666' }}>No exercises added yet.</Text>
      )}

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveText}>Save Changes</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cancelBtn}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const getStyles = (isDark) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: isDark ? '#000' : '#fff' },
    inner: { padding: 20 },
    label: { fontWeight: '600', marginBottom: 6, paddingTop: 30, fontSize: 24, color: isDark ? '#fff' : '#000', textAlign: 'center' },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      color: isDark ? '#fff' : '#000',
      borderRadius: 8,
      padding: 10,
      marginBottom: 10,
      fontSize: 16,
    },
    dateText: { fontSize: 16, marginBottom: 14, color: isDark ? '#fff' : '#000', textAlign: 'center' },
    saveBtn: {
      backgroundColor: '#007bff',
      padding: 14,
      borderRadius: 8,
      alignItems: 'center',
      marginBottom: 10,
    },
    saveText: { color: '#fff', fontSize: 16, fontWeight: '600' },
    cancelBtn: {
      backgroundColor: isDark ? '#000' : '#fff',
      padding: 14,
      borderRadius: 8,
      alignItems: 'center',
    },
    cancelText: { color: '#333', fontSize: 16, fontWeight: '600' },
    exerciseBox: {
      backgroundColor: isDark ? '#1c1c1e' : '#f4f4f4',
      padding: 12,
      borderRadius: 8,
      marginBottom: 80,
    },
    exerciseNameInput: {
      fontWeight: '700',
      fontSize: 16,
      marginBottom: 6,
      borderBottomWidth: 1,
      borderColor: '#ddd',
      color: isDark ? '#fff' : '#000',
      paddingVertical: 4,
    },
    setRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    setLabel: {
      fontSize: 14,
      width: 50,
      color: isDark ? '#fff' : '#000',
    },
    setInput: {
      borderWidth: 1,
      borderColor: '#ccc',
      color: isDark ? '#fff' : '#000',
      borderRadius: 6,
      padding: 6,
      width: 60,
      textAlign: 'center',
    },
  });

export default EditWorkoutScreen;