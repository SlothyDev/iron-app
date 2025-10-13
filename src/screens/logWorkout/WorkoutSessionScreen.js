import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useTheme } from '../ThemeProvider';
import { useNavigation, useRoute } from '@react-navigation/native';
import dayjs from 'dayjs';

import useWorkoutStore from '../../store/useWorkoutStore';
import { useSettings } from '../../components/settings/SettingsContext';
import { SwipeListView } from 'react-native-swipe-list-view';


export default function WorkoutSessionScreen() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const styles = getStyles(isDark);
  const navigation = useNavigation();
  const route = useRoute();

  const workoutDate = route.params?.date || dayjs().format('YYYY-MM-DD');
  const { exercises, deleteExercise} = useWorkoutStore();
  const clearSession = useWorkoutStore((s) => s.endSession);
  const { units } = useSettings();
  const { isRunning, elapsed, startSession, endSession } = useWorkoutStore();


  useEffect(() => {
    if (!isRunning) startSession();
    return () => endSession(); 
  }, []);

  

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };
  const handleAddExercise = () => {
    navigation.navigate('SelectExercise', {
      onComplete: (newExercise) => {
        setExercises((prev) => [...prev, newExercise]);
      },
    });
  };



  const handleEndWorkout = () => {
    navigation.navigate('ConfirmWorkout', { date: workoutDate });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Workout - {workoutDate}</Text>
      <Text style={styles.timer}>{formatTime(elapsed)}</Text>

      <SwipeListView
        data={exercises}
        keyExtractor={(item, index) => item.id || index.toString()}
        contentContainerStyle={{ flexGrow: 1 }}
        ListEmptyComponent={
          <Text style={styles.empty}>No exercises added yet</Text>
        }
        renderItem={({ item }) => (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.navigate('EditExercise', { exercise: item })}
        >
        <View style={styles.rowFront}>
          <View style={styles.exerciseItem}>
            <Text style={styles.exerciseName}>{item.name}</Text>
            {item.sets?.length > 0 && (
              <View style={styles.setsContainer}>
                {item.sets.map((set, idx) => (
                  <Text key={idx} style={styles.setText}>
                    Set {idx + 1}:{' '}
                    {item.type === 'timed'
                      ? `Time: ${set.reps} sec`
                      : `${set.reps} reps @ ${set.weight} ${units === 'metric' ? 'kg' : 'lbs'}`}
                  </Text>
                ))}
              </View>
            )}
          </View>
        </View>
        </TouchableOpacity>
      )}
        renderHiddenItem={({ item }) => (
          <View style={styles.rowBack}>
            <TouchableOpacity
              onPress={() => deleteExercise(item.id)}
              style={styles.deleteBtn}
            >
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
        rightOpenValue={-75}
        disableRightSwipe
      />

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.addButton} onPress={handleAddExercise}>
          <Text style={styles.buttonText}>+ Add Exercise</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.endButton} onPress={handleEndWorkout}>
          <Text style={styles.buttonText}>End Workout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const getStyles = (isDark) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: isDark ? '#000' : '#fff',
    },
    rowFront: {
      backgroundColor: 'transparent',
      borderRadius: 10,
      marginBottom: 10,
    },
   
    rowBack: {
      alignItems: 'center',
      backgroundColor: 'transparent',
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'flex-end',
      borderRadius: 10,
      marginBottom: 10,
    },

    deleteBtn: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'red',
      padding: 12,
      borderRadius: 10,
      marginBottom: 10,
      marginHorizontal: 10, 
    },

    deleteText: {
      
      textAlign: 'center',
      color: '#fff',
      fontWeight: 'bold',
    },


    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: isDark ? '#fff' : '#000',
      textAlign: 'center',
      marginTop: 60,
      marginBottom: 6,
    },
    timer: {
      fontSize: 20,
      color: isDark ? '#ccc' : '#555',
      textAlign: 'center',
      marginBottom: 16,
    },
    exerciseItem: {
      backgroundColor: isDark ? '#1c1c1e' : '#f4f4f4',
      padding: 12,
      borderRadius: 10,
      marginBottom: 10,
      marginHorizontal: 10, 
    },
    exerciseName: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#fff' : '#000',
    },
    exerciseType: {
      fontSize: 12,
      color: isDark ? '#aaa' : '#666',
    },
    setsContainer: {
      marginTop: 8,
    },
    setText: {
      fontSize: 14,
      color: isDark ? '#ccc' : '#444',
    },
    empty: {
      textAlign: 'center',
      color: isDark ? '#888' : '#999',
      marginTop: 30,
      fontStyle: 'italic',
    },
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 10,
      marginTop: 20,
    },
    addButton: {
      flex: 1,
      backgroundColor: '#007aff',
      padding: 14,
      borderRadius: 10,
      alignItems: 'center',
    },
    endButton: {
      flex: 1,
      backgroundColor: '#ff3b30',
      padding: 14,
      borderRadius: 10,
      alignItems: 'center',
    },
    buttonText: {
      color: '#fff',
      fontWeight: '600',
    },
  });