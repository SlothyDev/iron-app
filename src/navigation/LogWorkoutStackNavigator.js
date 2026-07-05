import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../screens/ThemeProvider';

import WorkoutCalendarScreen from '../screens/logWorkout/WorkoutCalanderScreen';
import WorkoutSessionScreen from '../screens/logWorkout/WorkoutSessionScreen';
import SelectExerciseScreen from '../screens/logWorkout/SelectExerciseScreen';
import ExerciseDetails from '../screens/logWorkout/ExerciseDetailsScreen';
import ConfirmWorkoutScreen from '../screens/logWorkout/ConfirmWorkoutScreen';
import EditExerciseScreen from '../screens/logWorkout/EditExercise';

const Stack = createNativeStackNavigator();

export default function LogWorkoutStackNavigator() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const backgroundColor = isDark ? '#000' : '#fff';
  const tintColor = isDark ? '#fff' : '#000';

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor,
          shadowColor: 'transparent',
          elevation: 0,
        },
        headerTintColor: tintColor,
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 20,
        },
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen
        name="WorkoutCalander"
        component={WorkoutCalendarScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="WorkoutSession"
        component={WorkoutSessionScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="SelectExercise"
        component={SelectExerciseScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="ExerciseDetails"
        component={ExerciseDetails}
        options={{ title: 'Exercise Details' }}
      />

      <Stack.Screen
        name="EditExercise"
        component={EditExerciseScreen}
        options={{ title: 'Edit' }}
      />

      <Stack.Screen
        name="ConfirmWorkout"
        component={ConfirmWorkoutScreen}
        options={{ title: 'Confirm Workout' }}
      />
    </Stack.Navigator>
  );
}