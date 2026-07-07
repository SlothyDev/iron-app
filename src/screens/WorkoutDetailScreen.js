import React, { useState, useEffect, useMemo} from 'react';
import {
  View,
  Text,
  Alert,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../firebase/firebase';
import { format } from 'date-fns';
import { useTheme } from '../screens/ThemeProvider';
import { calculateWorkoutStats, calculateMuscleHighlights, calculateRadarData } from '../components/WorkoutHelper';
import { deleteWorkout } from '../components/WorkoutService';
import MuscleMap from '../screens/logWorkout/SVGCreator';
import MuscleBackMap from '../screens/logWorkout/SVGCreatorBack';
import RadarChart from '../components/RadarChart';

const normalizeDate = (value) => {
  if (!value) return new Date();

  if (value?.toDate) return value.toDate();

  const d = new Date(value);
  return isNaN(d.getTime()) ? new Date() : d;
};



export default function WorkoutDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { workoutId } = route.params;
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        const userId = auth.currentUser?.uid;
        if (!userId) {
          Alert.alert('No user found');
          navigation.goBack();
          return;
        }

        const docRef = doc(db, 'users', userId, 'workouts', workoutId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setWorkout({ id: docSnap.id, ...docSnap.data() });
        } else {
          Alert.alert('Workout not found');
          navigation.goBack();
        }
      } catch (error) {
        console.error(error);
        Alert.alert('Error loading workout');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkout();
  }, [workoutId]);

  

  const handleDelete = async () => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    try {
      await deleteWorkout(userId, workoutId);
      navigation.goBack();
    } catch (error) {
      console.log(error);
      Alert.alert("Failed to delete workout");
    }
  };

  const highlightedMuscles = useMemo(
    () =>
      workout
        ? calculateMuscleHighlights(workout)
        : { primary: [], secondary: [] },
    [workout]
  );
  const radarData = useMemo(() => (workout ? calculateRadarData(workout) : []), [workout]);
  const groupTotals = radarData.reduce((acc, item) => {
    acc[item.group] = item.value;
    return acc;
  }, {});

  if (loading || !workout) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: isDark ? '#000' : '#f5f5f5' }]}>
        <Text style={{ color: isDark ? '#fff' : '#333' }}>Loading workout...</Text>
      </View>
    );
  }



  const workoutDate = normalizeDate(workout.workoutDate ?? workout.date);

  return (
    <ScrollView style={[styles.container, { backgroundColor: isDark ? '#000' : '#f5f5f5' }]}>
      <Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>
        {workout.title || 'Untitled Workout'}
      </Text>

      <Text style={[styles.comments, { color: isDark ? '#aaa' : '#666' }]}>
        {workout.comments || 'No comments'}
      </Text>

      <Text style={[styles.date, { color: isDark ? '#aaa' : '#666' }]}>
        {format(workoutDate, "PPP 'at' hh:mm a")}
      </Text>

      <Text style={[styles.sectionTitle, { color: isDark ? '#fff' : '#000' }]}>
        Exercises
      </Text>

      {workout.exercises?.length > 0 ? (
        workout.exercises.map((ex, index) => (
          <View key={index} style={[styles.exerciseCard, { backgroundColor: isDark ? '#1f1f1f' : '#fff' }]}>
            <Text style={{ color: isDark ? '#fff' : '#000', fontWeight: '600' }}>
              {ex.name}
            </Text>

            {ex.sets?.map((set, idx) => (
              <Text key={idx} style={{ color: isDark ? '#ccc' : '#555' }}>
                Set {idx + 1}: {set.reps} reps @ {set.weight}
              </Text>
            ))}
          </View>
        ))
      ) : (
        <Text style={{ color: isDark ? '#888' : '#777' }}>No exercises</Text>
      )}
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
      <View style={styles.diagramRow}>
        <MuscleMap
          primary={highlightedMuscles.primary}
          secondary={highlightedMuscles.secondary}
        />

        <MuscleBackMap
          primary={highlightedMuscles.primary}
          secondary={highlightedMuscles.secondary}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('EditWorkout', { workout })}>
        <Text style={styles.buttonText}>Edit Workout</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, {backgroundColor: "#ff0b0b"}]} onPress={handleDelete}>
        <Text style={styles.buttonText}>Delete Workout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16},
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 26, fontWeight: 'bold', textAlign: 'center' },
  comments: { fontSize: 14, textAlign: 'center', marginBottom: 10 },
  date: { fontSize: 14, textAlign: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginVertical: 10 },
  exerciseCard: { padding: 12, borderRadius: 10, marginBottom: 10 },
  diagramRow: {flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginVertical: 10,},
  button: {
    backgroundColor: '#007aff',
    paddingVertical: 15,
    borderRadius: 15,
    marginTop: 20,
    alignItems: 'center',
    },
  buttonDisabled: {
    opacity: 0.6,
    },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    },
});