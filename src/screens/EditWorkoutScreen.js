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
import dayjs from 'dayjs';
import { useNavigation, useRoute } from '@react-navigation/native';
import { doc, updateDoc, Timestamp } from 'firebase/firestore';
import { db, auth } from '../firebase/firebase';
import { useTheme } from './ThemeProvider';
import DateTimePicker from '@react-native-community/datetimepicker';

/**
 * SAFE DATE CONVERTER
 * Handles:
 * - Firestore Timestamp
 * - JS Date
 * - ISO string
 * - undefined/null
 */
const toDate = (value) => {
  if (!value) return new Date();
  if (value?.toDate) return value.toDate();
  const d = new Date(value);
  return isNaN(d.getTime()) ? new Date() : d;
};

const EditWorkoutScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { workout } = route.params;

  const [showPicker, setShowPicker] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const styles = getStyles(isDark);

  // normalize once
  const [editableWorkout, setEditableWorkout] = useState({
    ...workout,
    workoutDate: workout.workoutDate || workout.date || new Date(),
  });

  const handleSave = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert('Error', 'User not logged in');
        return;
      }

      const workoutRef = doc(
        db,
        'users',
        user.uid,
        'workouts',
        workout.id
      );

      await updateDoc(workoutRef, {
        ...editableWorkout,
        updatedAt: Timestamp.now(),
      });

      navigation.goBack();
    } catch (err) {
      console.error('Error updating workout:', err);
      Alert.alert('Error', 'Failed to update workout');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.inner}>

      {/* TITLE */}
      <Text style={styles.title}>Title</Text>
      <TextInput
        value={editableWorkout.title}
        onChangeText={(text) =>
          setEditableWorkout({ ...editableWorkout, title: text })
        }
        style={styles.input}
        placeholder="Workout title"
      />

      {/* NOTES */}
      <Text style={styles.label}>Notes</Text>
      <TextInput
        value={editableWorkout.comments}
        onChangeText={(text) =>
          setEditableWorkout({ ...editableWorkout, comments: text })
        }
        style={[styles.input, { height: 100 }]}
        placeholder="Add workout notes..."
        multiline
      />

      {/* DATE */}
      <TouchableOpacity onPress={() => setShowPicker(true)}>
        <Text style={styles.label}>Date</Text>
        <Text style={styles.dateText}>
          {dayjs(toDate(editableWorkout.workoutDate)).format(
            'MMM D, YYYY h:mm A'
          )}
        </Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={toDate(editableWorkout.workoutDate)}
          mode="datetime"
          onChange={(event, selectedDate) => {
            setShowPicker(false);
            if (selectedDate) {
              setEditableWorkout({
                ...editableWorkout,
                workoutDate: selectedDate,
              });
            }
          }}
        />
      )}

      {/* EXERCISES (FULL EDIT SUPPORT) */}
      <Text style={styles.label}>Exercises</Text>

      {editableWorkout.exercises?.length > 0 ? (
        editableWorkout.exercises.map((exercise, exIndex) => (
          <View key={exIndex} style={styles.exerciseBox}>

            {/* exercise name */}
            <TextInput
              style={styles.exerciseNameInput}
              value={exercise.name}
              onChangeText={(text) => {
                const updated = [...editableWorkout.exercises];
                updated[exIndex].name = text;
                setEditableWorkout({
                  ...editableWorkout,
                  exercises: updated,
                });
              }}
            />

            {/* sets */}
            {exercise.sets?.map((set, setIndex) => (
              <View key={setIndex} style={styles.setRow}>
                <Text style={styles.setLabel}>Set {setIndex + 1}</Text>

                <TextInput
                  style={styles.setInput}
                  keyboardType="numeric"
                  value={String(set.weight ?? '')}
                  onChangeText={(text) => {
                    const updated = [...editableWorkout.exercises];
                    updated[exIndex].sets[setIndex].weight =
                      Number(text) || 0;
                    setEditableWorkout({
                      ...editableWorkout,
                      exercises: updated,
                    });
                  }}
                />

                <Text style={{ marginHorizontal: 5 }}>×</Text>

                <TextInput
                  style={styles.setInput}
                  keyboardType="numeric"
                  value={String(set.reps ?? '')}
                  onChangeText={(text) => {
                    const updated = [...editableWorkout.exercises];
                    updated[exIndex].sets[setIndex].reps =
                      Number(text) || 0;
                    setEditableWorkout({
                      ...editableWorkout,
                      exercises: updated,
                    });
                  }}
                />
              </View>
            ))}
          </View>
        ))
      ) : (
        <Text style={{ color: '#888' }}>No exercises</Text>
      )}

      {/* SAVE */}
      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveText}>Save Changes</Text>
      </TouchableOpacity>

      {/* CANCEL */}
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
    title: {
      fontSize: 30,
      fontWeight: '600',
      marginTop: '80',
      textAlign: 'center',
      marginVertical: 10,
      color: isDark ? '#fff' : '#000',
    },
    label: {
      fontSize: 22,
      fontWeight: '600',
      textAlign: 'center',
      marginVertical: 10,
      color: isDark ? '#fff' : '#000',
    },

    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 10,
      borderRadius: 8,
      marginBottom: 10,
      color: isDark ? '#fff' : '#000',
    },

    dateText: {
      textAlign: 'center',
      marginBottom: 10,
      color: isDark ? '#fff' : '#000',
    },

    exerciseBox: {
      backgroundColor: isDark ? '#1c1c1e' : '#f4f4f4',
      padding: 12,
      borderRadius: 10,
      marginBottom: 20,
    },

    exerciseNameInput: {
      fontSize: 16,
      fontWeight: '600',
      borderBottomWidth: 1,
      borderColor: '#ccc',
      marginBottom: 10,
      color: isDark ? '#fff' : '#000',
    },

    setRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },

    setLabel: {
      width: 60,
      color: isDark ? '#fff' : '#000',
    },

    setInput: {
      borderWidth: 1,
      borderColor: '#ccc',
      width: 60,
      padding: 6,
      textAlign: 'center',
      borderRadius: 6,
      color: isDark ? '#fff' : '#000',
    },

    saveBtn: {
      backgroundColor: '#007bff',
      padding: 14,
      borderRadius: 10,
      alignItems: 'center',
      marginTop: 10,
    },

    saveText: { color: '#fff', fontWeight: '600' },

    cancelBtn: {
      padding: 14,
      alignItems: 'center',
      marginTop: 10,
    },

    cancelText: { color: '#888' },
  });

export default EditWorkoutScreen;