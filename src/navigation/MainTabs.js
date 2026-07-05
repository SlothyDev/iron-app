import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from '../screens/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';

import MainScreen from '../screens/Main Menu/MainScreen';
import ProfileStackNavigator from './ProfileStackNavigator';
import LogWorkoutStackNavigator from './LogWorkoutStackNavigator';

const Tab = createBottomTabNavigator();

// Bottom tab navigation for main tabs.

export default function MainTabs() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <Tab.Navigator lazy={false}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: isDark ? '#000' : '#fff',
          borderTopColor: isDark ? '#222' : '#ccc',
        },
        tabBarActiveTintColor: isDark ? '#fff' : '#000',
        tabBarInactiveTintColor: isDark ? '#666' : '#888',
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Main') {
            iconName = 'home';
          } else if (route.name === 'Profile') {
            iconName = 'person';
          } else if (route.name === 'LogWorkout'){ 
            iconName = 'barbell';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Main" component={MainScreen} />
      <Tab.Screen name="Profile" component={ProfileStackNavigator} />
      <Tab.Screen name="LogWorkout" component={LogWorkoutStackNavigator} />

    </Tab.Navigator>
  );
}