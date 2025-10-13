import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator,  } from '@react-navigation/native-stack';

import AuthLoadingScreen from '../screens/Authentication/AuthLoadingScreen';
import SignUpScreen from '../screens/Authentication/SignUpScreen';
import LoginScreen  from '../screens/Authentication/LoginScreen';
import ResetPasswordScreen from '../screens/Authentication/ResetPassowrdScreen';
import MainTabs from './MainTabs';  
import ProfileSetupScreen from '../screens/Profile/ProfileSetupScreen';
import SettingsScreen from '../screens/SettingScreen';
import WorkoutDetailScreen from '../screens/WorkoutDetailScreen';
import EditWorkoutScreen from '../screens/EditWorkoutScreen';

const Stack = createNativeStackNavigator();

// Create a default app navigator


export default function AppNavigator() {
  return (
    <NavigationContainer>
      
      <Stack.Navigator initialRouteName="AuthLoading" screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        animationEnabled: false,
      }} >
        <Stack.Screen name="AuthLoading" component={AuthLoadingScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
        <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
        <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false}} />
        <Stack.Screen name="WorkoutDetail" component={WorkoutDetailScreen} />
        <Stack.Screen name="EditWorkout" component={EditWorkoutScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}