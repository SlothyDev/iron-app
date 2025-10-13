import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity,  ActivityIndicator } from 'react-native';
import { startOfWeek, endOfWeek, addWeeks, format } from 'date-fns';
import { getWorkoutsByDateRange } from './GetWorkouts';
import { useTheme } from '../screens/ThemeProvider';
import { useIsFocused, useFocusEffect } from '@react-navigation/native';

export function WeeklyWorkouts( { navigation } ) {
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const fetchWorkouts = async () => {
    setLoading(true);
    const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
    const results = await getWorkoutsByDateRange(weekStart, weekEnd);
    console.log(results)

    setWorkouts(results);
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchWorkouts();
    }, [weekStart]) 
  );

  
  return (
    <View style={{ flex: 1, padding: 16 }}>
      {/* Week Navigation */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
        <TouchableOpacity onPress={() => setWeekStart(addWeeks(weekStart, -1))}>
          <Text style={{color: isDark ? '#fff' : '#000'}}>{'<'} Prev</Text>
        </TouchableOpacity>
        <Text style={{ fontWeight: 'bold', fontSize: 16, color: isDark ? '#fff' : '#000'}}>
          {format(weekStart, 'MMM d')} – {format(endOfWeek(weekStart, { weekStartsOn: 1 }), 'MMM d')}
        </Text>
        <TouchableOpacity onPress={() => setWeekStart(addWeeks(weekStart, 1))}>
          <Text style={{color: isDark ? '#fff' : '#000'}}>Next {'>'}</Text>
        </TouchableOpacity>
      </View>

      {/* Workout List */}
      {loading ? (
        <ActivityIndicator size="large" color="#0096FF" />
      ) : workouts.length === 0 ? (
        <Text style={{ textAlign: 'center', marginTop: 20, color: '#888' }}>No workouts logged this week.</Text>
      ) : (
        <View>
  {workouts.map(workout => (
    <View
        key={workout.id}
        style={{ paddingVertical: 8, borderBottomWidth: 1, borderColor: isDark ? '#fff' : '#000' }}
    >
        <TouchableOpacity onPress={() => navigation.navigate('WorkoutDetail', { workoutId: workout.id })}>
        <Text style={{ fontWeight: 'bold', fontSize: 16, color: isDark ? '#fff' : '#000' }}>
            {format(workout.date?.toDate ? workout.date.toDate() : new Date(workout.date), 'EEE, MMM d')}
        </Text>
        <Text style={{ color: isDark ? '#fff' : '#000' }}>{workout.name || 'Workout'}</Text>
        {workout.exercises && (
            <Text style={{ color: isDark ? '#fff' : '#000', fontSize: 12 }}>
            {workout.exercises.length} exercises
            </Text>
        )}
        </TouchableOpacity>
    </View>
    ))}
    </View>
      )}
    </View>
  );
}