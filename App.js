import React from 'react';
import { ThemeProvider } from './src/screens/ThemeProvider';
import { SettingsProvider } from './src/components/settings/SettingsContext'
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  console.log("App Launched")
  return (
    <ThemeProvider>
      <SettingsProvider>
        <AppNavigator />
      </SettingsProvider>
    </ThemeProvider>
  );
}