import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useColorScheme } from 'react-native';

import WorkoutCalendarScreen from '../screens/logWorkout/WorkoutCalanderScreen';
import WorkoutSessionScreen from '../screens/logWorkout/WorkoutSessionScreen';
import SelectExerciseScreen from '../screens/logWorkout/SelectExerciseScreen';
import ExerciseDetails from '../screens/logWorkout/ExerciseDetailsScreen';
import ConfirmWorkoutScreen from '../screens/logWorkout/ConfirmWorkoutScreen';
import EditExerciseScreen from '../screens/logWorkout/EditExercise';
const Stack = createNativeStackNavigator();

// Create a custom navigator for our workout stack

export default function LogWorkoutStackNavigator() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const backgroundColor = isDark ? '#000' : '#fff';
  const tintColor = isDark ? '#fff' : '#000';


  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor,
          height: 50,
          shadowColor: 'transparent',
          elevation: 0,
        },
        headerTintColor: tintColor,
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 20,
          letterSpacing: 0.5,
          fontFamily: 'System', 
        },
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen name="WorkoutCalander" component={WorkoutCalendarScreen} options={{ headerShown: false }} />
      <Stack.Screen name="WorkoutSession" component={WorkoutSessionScreen} options={{ headerShown: false }} />
      <Stack.Screen name="SelectExercise" component={SelectExerciseScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ExerciseDetails" component={ExerciseDetails} options={{ title: 'Exercise Details' }} />
      <Stack.Screen name="EditExercise" component={EditExerciseScreen} options={{ title: 'Edit' }} />
      <Stack.Screen name="ConfirmWorkout" component={ConfirmWorkoutScreen} options={{ title: 'Confirm Workout' }} />
    </Stack.Navigator>
  );
}