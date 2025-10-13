import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, TextInput } from 'react-native';
import { useTheme } from '../ThemeProvider';
import MuscleMap from './SVGCreator';
import MuscleBackMap from './SVGCreatorBack';
import { calculateWorkoutStats, calculateMuscleHighlights, calculateRadarData } from '../../components/WorkoutHelper';
import useWorkoutStore from '../../store/useWorkoutStore';
import { useSettings } from '../../components/settings/SettingsContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import dayjs from 'dayjs';
import { getAuth } from 'firebase/auth';

import { Timestamp, serverTimestamp } from 'firebase/firestore';

import { saveWorkout } from '../../components/WorkoutService';

import RadarChart from '../../components/RadarChart';

import DateTimePicker from '@react-native-community/datetimepicker';


export default function ConfirmWorkoutScreen({navigation}) {
  const { theme, isDark } = useTheme();
  const styles = getStyles(isDark);

  const { units } = useSettings();
  const route = useRoute();

  const [workout, setWorkout] = useState(null);
  const [title, setTitle] = useState('');
  const [comments, setComments] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  
  const [workoutDate, setWorkoutDate] = useState(new Date()); // temporary default
  const date = route.params?.date ;
  useEffect(() => {
    const dateFromRoute = route.params?.date;
    if (dateFromRoute) {
      const now = new Date();
      const [year, month, day] = dateFromRoute.split('-').map(Number);
      setWorkoutDate(new Date(year, month - 1, day, now.getHours(), now.getMinutes(), now.getSeconds()));
    }
  }, [route.params?.date]);



  useEffect(() => {
    
    const { exercises, elapsed } = useWorkoutStore.getState();
    setWorkout({ exercises, elapsed });
  }, []);

  
  const stats = useMemo(() => (workout ? calculateWorkoutStats(workout) : {}), [workout]);
  const highlightedMuscles = useMemo(
    () => (workout ? calculateMuscleHighlights(workout) : { primary: [], secondary: [] }),
    [workout]
  );
  const radarData = useMemo(() => (workout ? calculateRadarData(workout) : []), [workout]);
  const groupTotals = radarData.reduce((acc, item) => {
    acc[item.group] = item.value;
    return acc;
  }, {});
  if (!workout) {
    return (
      <View style={[styles.container, {backgroundColor: isDark ? '#000' : '#fff', justifyContent: 'center' }]}>
        <Text style={{ color: theme.text }}>Loading workout...</Text>
      </View>
    );
  }


  



  const handleSave = async () => {
    try {
      const user = getAuth().currentUser;

      if (!user) {
        Alert.alert('Error', 'User not logged in');
        return;
      }


      const workoutToSave = {
        ...workout,
        title: title.trim(),
        comments: comments.trim(),
        date: workoutDate, 
      };

      await saveWorkout(user.uid, workoutToSave);
      Alert.alert('Success', 'Workout saved successfully');
      useWorkoutStore.getState().endSession();
      navigation.navigate("WorkoutCalander"); 
    } catch (error) {
      Alert.alert('Error', 'Failed to save workout');
      console.error(error);
    }
  };




  const handleCancel = () => {
    Alert.alert(
      'Discard Workout',
      'Are you sure you want to cancel? This will remove the workout data.',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: () => {
            useWorkoutStore.getState().endSession();
            navigation.popToTop(); 
          },
        },
      ]
    );
  };


  return (
    <ScrollView contentContainerStyle={[styles.container, ]}>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Workout Title"
        placeholderTextColor={isDark ? '#aaa' : '#666'}
      />

      <TextInput
        style={[styles.input, styles.commentsInput]}
        value={comments}
        onChangeText={setComments}
        placeholder="Add notes or comments (optional)"
        placeholderTextColor={isDark ? '#aaa' : '#666'}
        multiline
      />
      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setShowPicker(true)}
      >
        <Text style={{ color: isDark ? '#fff' : '#000' }}>
          {workoutDate.toLocaleString()}
        </Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={workoutDate}
          mode="datetime"
          display="default"
          onChange={(event, selectedDate) => {
            setShowPicker(false);
            if (selectedDate) setWorkoutDate(selectedDate);
          }}
        />
      )}


      <View style={styles.containerDiagram}>
        <MuscleMap primary={highlightedMuscles.primary} secondary={highlightedMuscles.secondary} />
        <MuscleBackMap primary={highlightedMuscles.primary} secondary={highlightedMuscles.secondary} />
      </View>

      <View style={styles.instructionsContainer}>
        <Text style={[styles.label]}>Summary</Text>
        <Text style={[styles.instructionText]}>Total Volume: {stats.totalVolume >= 1 ? stats.totalVolume : stats.totalVolume*1000}{stats.totalVolume >= 1 ? 'K ' : ''}{units === 'metric' ? 'kgs' : 'lbs'}</Text>
        <Text style={[styles.instructionText]}>Total Time: {stats.totalTime} mins</Text>
        <Text style={[styles.instructionText]}>Exercises: {stats.exerciseCount}</Text>
        <Text style={[styles.instructionText]}>Sets: {stats.totalSets}</Text>
      </View>
      <RadarChart
        size={200}
        levels={5}
        labels={['Chest', 'Back', 'Legs', 'Arms', 'Shoulders']}
        data={[groupTotals['chest'], groupTotals['back'], groupTotals['legs'], groupTotals['arms'], groupTotals['shoulders']]} 
        maxValue={1}
      />
      <View style={styles.muscleGroupContainer}>
        <Text style={[styles.label]}>Exercises</Text>
        {workout.exercises.map((ex, i) => (
          <View key={i} style={styles.setRow}>
            <Text style={styles.header}>{ex.name}</Text>
            <Text style={styles.subtext}>
              {ex.sets.length} sets — {ex.sets.reduce((a, s) => a + (s.reps || s.time || 0), 0)} total reps/time
            </Text>
          </View>
        ))}
      </View>


      <View style={styles.buttonColumn}>
        <TouchableOpacity style={styles.finishButton} onPress={handleSave}>
          <Text style={styles.finishButtonText}>Finish</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        
      </View>
    </ScrollView>
  );
}

const getStyles = (isDark) =>
  StyleSheet.create({
    container: {
      flexGrow: 1,
      padding: 16,
      alignItems: 'center',
      backgroundColor: isDark ? '#000' : '#fff' 
    },
    input: {
      backgroundColor: isDark ? '#222' : '#fff',
      borderRadius: 10,
      padding: 10,
      width: '100%',
      marginBottom: 10,
      color: isDark ? '#fff' : '#000',
      fontSize: 16,
    },
    commentsInput: {
      minHeight: 80,
      textAlignVertical: 'top',
    },
    containerDiagram: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      marginBottom: 20,
    },
    instructionsContainer: {
      backgroundColor: isDark ? '#000000ff': '#f2f2f2ff',
      borderRadius: 16,
      padding: 16,
      marginVertical: 12,
      shadowColor: isDark ? '#000' : '#ccc',
      shadowOpacity: 0.1,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
      elevation: 3,
      width: '100%',
      alignItems: 'center',
    },
    instructionText: {
      fontSize: 14,
      lineHeight: 20,
      color: isDark ? '#fefefeff' : '#000000ff',
      fontWeight: '400',
    },
    muscleGroupContainer: {
      backgroundColor: isDark ? '#000000ff': '#f2f2f2ff',
      borderRadius: 16,
      padding: 16,
      marginVertical: 12,
      shadowColor: isDark ? '#000' : '#ccc',
      shadowOpacity: 0.1,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
      elevation: 3,
      width: '100%',
      alignItems: 'center',
    },
    label: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 8,
      color: isDark ? '#fefefeff' : '#000000ff'
    },
    header: {
      fontSize: 14,
      color: isDark ? '#fefefeff' : '#000000ff',
      marginBottom: 4,
    },
    subtext: {
      fontSize: 12,
      color: isDark ? '#fefefeff' : '#000000ff',
      marginBottom: 4,
    },
    setRow: {
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    buttonColumn: {
      width: '100%',
      marginTop: 20,
      alignItems: 'center',
    },

    finishButton: {
      backgroundColor: '#26ff00',
      paddingVertical: 14,
      borderRadius: 10,
      alignItems: 'center',
      width: '80%',
      marginBottom: 10, 
    },

    finishButtonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: '700',
    },

    cancelButton: {
      backgroundColor: '#ff3333',
      paddingVertical: 10, 
      borderRadius: 10,
      alignItems: 'center',
      width: '60%', 
    },

    cancelButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '700',
    },
  });