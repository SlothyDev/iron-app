import React from 'react';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator,  } from '@react-navigation/native-stack';
import AuthLoadingScreen from '../screens/Authentication/AuthLoadingScreen';
import SignUpScreen from '../screens/Authentication/SignUpScreen';
import LoginScreen  from '../screens/Authentication/LoginScreen';
import ResetPasswordScreen from '../screens/Authentication/ResetPassowrdScreen';
import MainTabs from './MainTabs';  
import ProfileSetupScreen from '../screens/Profile/ProfileSetupScreen';
import SettingsScreen from '../screens/SettingScreen';
import WorkoutDetailScreen from '../screens/WorkoutDetailScreen';
import PostWorkoutViewer from '../screens/Posts/PostWorkoutViewer'
import EditWorkoutScreen from '../screens/EditWorkoutScreen';

import { useTheme } from '../screens/ThemeProvider';

const Stack = createNativeStackNavigator();


// Create a default app navigator


export default function AppNavigator() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const navTheme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
      background: isDark ? '#000' : '#f5f5f5',
      card: isDark ? '#121212' : '#fff',
      text: isDark ? '#fff' : '#000',
      border: 'transparent',
    },
  };

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        initialRouteName="AuthLoading"
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          animationEnabled: false,
        }}
      >
        <Stack.Screen name="AuthLoading" component={AuthLoadingScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="WorkoutDetail" component={WorkoutDetailScreen} />
        <Stack.Screen name="EditWorkout" component={EditWorkoutScreen} />
        <Stack.Screen name="PostViewer" component={PostWorkoutViewer} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}