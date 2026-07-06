import React from 'react';
import { ThemeProvider } from './src/screens/ThemeProvider';
import { SettingsProvider } from './src/components/settings/SettingsContext'
import AppNavigator from './src/navigation/AppNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  console.log("App Launched")
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <SettingsProvider>
          <AppNavigator />
        </SettingsProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}