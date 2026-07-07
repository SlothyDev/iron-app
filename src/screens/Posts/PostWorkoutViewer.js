import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase'
import { format } from 'date-fns';

import { useTheme } from '../ThemeProvider';
import { calculateMuscleHighlights, calculateRadarData } from '../../components/WorkoutHelper';

import MuscleMap from '../../screens/logWorkout/SVGCreator';
import MuscleBackMap from '../../screens/logWorkout/SVGCreatorBack';
import RadarChart from '../../components/RadarChart';

const normalizeDate = (value) => {
  if (!value) return new Date();
  if (value?.toDate) return value.toDate();
  const d = new Date(value);
  return isNaN(d.getTime()) ? new Date() : d;
};

export default function PostWorkoutViewer() {
  const route = useRoute();
  const { postId } = route.params;

  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPost = async () => {
      try {
        const ref = doc(db, 'posts', postId);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setPost({ id: snap.id, ...snap.data() });
        }
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [postId]);

  const highlightedMuscles = useMemo(
    () =>
      post ? calculateMuscleHighlights(post) : { primary: [], secondary: [] },
    [post]
  );

  const radarData = useMemo(
    () => (post ? calculateRadarData(post) : []),
    [post]
  );

  const groupTotals = radarData.reduce((acc, item) => {
    acc[item.group] = item.value;
    return acc;
  }, {});

  if (loading || !post) {
    return (
      <View style={[styles.loading, { backgroundColor: isDark ? '#000' : '#fff' }]}>
        <Text style={{ color: isDark ? '#fff' : '#000' }}>
          Loading post...
        </Text>
      </View>
    );
  }

  const workoutDate = normalizeDate(post.workoutDate ?? post.date);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: isDark ? '#000' : '#f5f5f5' }]}
    >
      <Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>
        {post.title || 'Untitled Workout'}
      </Text>

      <Text style={[styles.comments, { color: isDark ? '#aaa' : '#666' }]}>
        {post.comments || 'No comments'}
      </Text>

      <Text style={[styles.date, { color: isDark ? '#aaa' : '#666' }]}>
        {format(workoutDate, "PPP 'at' hh:mm a")}
      </Text>

      {/* EXERCISES */}
      <Text style={[styles.sectionTitle, { color: isDark ? '#fff' : '#000' }]}>
        Exercises
      </Text>

      {post.exercises?.length > 0 ? (
        post.exercises.map((ex, index) => (
          <View
            key={index}
            style={[
              styles.exerciseCard,
              { backgroundColor: isDark ? '#1f1f1f' : '#fff' },
            ]}
          >
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
        <Text style={{ color: isDark ? '#888' : '#777' }}>
          No exercises
        </Text>
      )}

      {/* RADAR */}
      <RadarChart
        size={180}
        levels={5}
        labels={['Chest', 'Back', 'Legs', 'Arms', 'Shoulders']}
        data={[
          groupTotals['chest'],
          groupTotals['back'],
          groupTotals['legs'],
          groupTotals['arms'],
          groupTotals['shoulders'],
        ]}
        maxValue={1}
      />

      {/* MUSCLE MAP */}
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  title: { fontSize: 26, fontWeight: 'bold', textAlign: 'center' },
  comments: { fontSize: 14, textAlign: 'center', marginBottom: 10 },
  date: { fontSize: 14, textAlign: 'center', marginBottom: 16 },

  sectionTitle: { fontSize: 18, fontWeight: '600', marginVertical: 10 },

  exerciseCard: {
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },

  diagramRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 10,
  },
});