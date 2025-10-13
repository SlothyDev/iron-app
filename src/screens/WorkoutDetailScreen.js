import React, { useState, useEffect } from 'react';
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
        console.error('Error fetching workout:', error);
        Alert.alert('Error loading workout');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkout();
  }, [workoutId]);

  const handleDelete = () => {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      Alert.alert('No user found');
      return;
    }
    Alert.alert(
      'Delete Workout',
      'Are you sure you want to delete this workout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'users', userId, 'workouts', workoutId));
              Alert.alert('Success', 'Workout deleted successfully.', [
                { text: 'OK', onPress: () => navigation.goBack() },
              ]);
            } catch (error) {
              console.error('Error deleting workout:', error);
              Alert.alert('Error', 'Failed to delete workout. Please try again.');
            }
          },
        },
      ]
    );
  };

  if (loading || !workout) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: isDark ? '#000' : '#f5f5f5' },
        ]}
      >
        <Text style={{ color: isDark ? '#fff' : '#333' }}>Loading workout...</Text>
      </View>
    );
  }

  const workoutDate = workout.date?.toDate ? workout.date.toDate() : new Date(workout.date);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: isDark ? '#000' : '#f5f5f5' }]}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {/* Workout Title */}
      <Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>
        {workout.title || 'Workout'}
      </Text>
      {/* Workout Comments */}
      <Text style={[styles.comments, { color: isDark ? '#fff' : '#000' }]}>
        {'"' + workout.comments + '"' || 'No user comments'}
      </Text>
      <Text style={[styles.date, { color: isDark ? '#aaa' : '#666' }]}>
        {format(workoutDate, "PPP 'at' hh:mm a")}
      </Text>

      {/* Exercises */}
      <Text style={[styles.sectionTitle, { color: isDark ? '#fff' : '#000' }]}>
        Exercises
      </Text>
      {workout.exercises && workout.exercises.length > 0 ? (
        workout.exercises.map((ex, index) => (
          <View
            key={index}
            style={[
              styles.exerciseCard,
              { backgroundColor: isDark ? '#1f1f1f' : '#fff' },
            ]}
          >
            <Text style={[styles.exerciseName, { color: isDark ? '#fff' : '#000' }]}>
              {ex.name}
            </Text>
            {ex.sets && ex.sets.length > 0 ? (
              ex.sets.map((set, idx) => (
                <Text
                  key={idx}
                  style={[styles.setText, { color: isDark ? '#ccc' : '#555' }]}
                >
                  Set {idx + 1}: {set.reps} reps @ {set.weight} lbs
                </Text>
              ))
            ) : (
              <Text style={[styles.setText, { color: isDark ? '#888' : '#777' }]}>
                No sets recorded
              </Text>
            )}
          </View>
        ))
      ) : (
        <Text style={{ color: isDark ? '#888' : '#777' }}>No exercises recorded.</Text>
      )}

      {/* Buttons */}
      <View style={{ marginTop: 20 }}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#007AFF' }]}
          onPress={() => navigation.navigate('EditWorkout', { workout })}
        >
          <Text style={styles.buttonText}>Edit Workout</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#d9534f', marginTop: 12 }]}
          onPress={handleDelete}
        >
          <Text style={styles.buttonText}>Delete Workout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 80 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 6, textAlign: 'center' },
  comments: { fontSize: 16, marginBottom: 20, textAlign: 'center' },
  date: { fontSize: 14, marginBottom: 16, textAlign: 'center' },
  sectionTitle: { fontSize: 20, fontWeight: '600', marginBottom: 12 },
  exerciseCard: {
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
  },
  exerciseName: { fontSize: 16, fontWeight: '600', marginBottom: 6 },
  setText: { fontSize: 14, marginLeft: 4 },
  button: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: { fontSize: 16, fontWeight: '600', color: '#fff' },
});