import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import EditProfileScreen from '../screens/Profile/EditProfileScreen';
import { useColorScheme } from 'react-native';

const Stack = createNativeStackNavigator();

// Stack navigator for profile screen

export default function ProfileStackNavigator() {
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
      <Stack.Screen
        name="ProfileMain"
        component={ProfileScreen}
        options={{ title: 'Profile' }}  
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{
          title: 'Edit Profile',
          headerStyle: { backgroundColor, height: 50 },
          headerTintColor: tintColor,
          headerTitleStyle: {
            fontWeight: '600',
            fontSize: 20,
          },
        }}
      />
    </Stack.Navigator>
  );
}