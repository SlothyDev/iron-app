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

  const [isPublic, setIsPublic] = useState(true);
  useEffect(() => {
    const dateFromRoute = route.params?.date;
    if (dateFromRoute) {
      const now = new Date();
      const [year, month, day] = dateFromRoute.split('-').map(Number);
      setWorkoutDate(new Date(year, month - 1, day, now.getHours(), now.getMinutes(), now.getSeconds()));
    }
  }, [route.params?.date]);



  useEffect(() => {
  const state = useWorkoutStore.getState();

  const { exercises, elapsed } = state;

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
        userId: user.uid,

        title: title.trim() || "Untitled Workout",
        comments: comments.trim() || "",
        isPublic,

        workoutDate: Timestamp.fromDate(workoutDate),

        likeCount: workout.likeCount ?? 0,
        commentCount: workout.commentCount ?? 0,
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


  const WorkoutSummaryCard = ({ stats, groupTotals, highlightedMuscles, workout }) => {
      return (
        <View style={styles.card}>
          
          <Text style={styles.cardTitle}>Workout Summary</Text>

          {/* Stats row */}
          <View style={styles.statsRow}>
            <Text style={styles.stat}>🔥 {stats.totalVolume*1000} {units === 'metric' ? 'kgs' : 'lbs'}</Text>
            <Text style={styles.stat}>⏱ {stats.totalTime} </Text>
            <Text style={styles.stat}>🏋️ {stats.totalSets} sets</Text>
          </View>

          {/* Muscle maps */}
          <View style={styles.diagramRow}>
          <View style={styles.mapWrapper}>
            <MuscleMap
              primary={highlightedMuscles.primary}
              secondary={highlightedMuscles.secondary}
            />
          </View>

          <View style={styles.mapWrapper}>
            <MuscleBackMap
              primary={highlightedMuscles.primary}
              secondary={highlightedMuscles.secondary}
            />
          </View>
        </View>

          {/* Radar */}
          <RadarChart
            size={180}
            levels={5}
            labels={['Chest', 'Back', 'Legs', 'Arms', 'Shoulders']}
            data={[
              groupTotals['chest'],
              groupTotals['back'],
              groupTotals['legs'],
              groupTotals['arms'],
              groupTotals['shoulders']
            ]}
            maxValue={1}
          />

          {/* Exercise preview */}
          <View style={styles.exercisePreview}>
            {workout.exercises.slice(0, 3).map((ex, i) => (
              <Text key={i} style={styles.exerciseText}>
                • {ex.name} ({ex.sets.length} sets)
              </Text>
            ))}

            {workout.exercises.length > 3 && (
              <Text style={styles.moreText}>
                +{workout.exercises.length - 3} more
              </Text>
            )}
          </View>

        </View>
      );
    };

  return (
    <ScrollView style={{ backgroundColor: isDark ? '#000' : '#fff' }} contentContainerStyle={[styles.container, ]}>
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

      {/*<View style={styles.containerDiagram}>
        <MuscleMap primary={highlightedMuscles.primary} secondary={highlightedMuscles.secondary} />
        <MuscleBackMap primary={highlightedMuscles.primary} secondary={highlightedMuscles.secondary} />
      </View>*/}
      
      
      <WorkoutSummaryCard
        stats={stats}
        groupTotals={groupTotals}
        highlightedMuscles={highlightedMuscles}
        workout={workout}
      />

      <View style={styles.segmentContainer}>
        <TouchableOpacity
          style={[
            styles.segmentButton,
            isPublic && styles.segmentActive
          ]}
          onPress={() => setIsPublic(true)}
        >
          <Text style={[
            styles.segmentText,
            isPublic && styles.segmentTextActive
          ]}>
            Public 🌍
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.segmentButton,
            !isPublic && styles.segmentActive
          ]}
          onPress={() => setIsPublic(false)}
        >
          <Text style={[
            styles.segmentText,
            !isPublic && styles.segmentTextActive
          ]}>
            Private 🔒
          </Text>
        </TouchableOpacity>
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
    segmentContainer: {
      flexDirection: 'row',
      width: '80%',
      borderRadius: 12,
      overflow: 'hidden',
      marginTop: 10,
      borderWidth: 1,
      borderColor: '#333',
    },
    segmentButton: {
      flex: 1,
      paddingVertical: 10,
      alignItems: 'center',
      backgroundColor: isDark ? '#000000ff' : '#fefefeff',
    },

    segmentActive: {
      backgroundColor: '#006eff',
    },

    segmentText: {
      color: isDark ?  '#fefefeff' : '#000000ff',
      fontWeight: '600',
    },

    segmentTextActive: {
      color: '#fefefeff',
    },
    finishButton: {
      backgroundColor: '#54bb00',
      paddingVertical: 14,
      borderRadius: 10,
      alignItems: 'center',
      width: '80%',
      marginBottom: 10, 
    },

    finishButtonText: {
      color: '#fefefeff',
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
    card: {
      width: '100%',
      backgroundColor: isDark ?  '#111' : '#ffffff',
      borderRadius: 16,
      padding: 16,
      marginVertical: 12,
      borderWidth: 1,
      borderColor: '#222',
    },

    cardTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: isDark ?  '#fff' : '#000',
      marginBottom: 12,
    },

    statsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 12,
    },

    stat: {
      color: isDark ?  '#aaa' : '#000',
      fontSize: 12,
    },

    diagramRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
    },
    mapWrapper: {
      flex: 1,
      alignItems: 'center',
    },

    exercisePreview: {
      marginTop: 10,
    },

    exerciseText: {
      color: '#ddd',
      fontSize: 13,
      marginBottom: 4,
    },

    moreText: {
      color: '#888',
      fontSize: 12,
      marginTop: 4,
    }
  });