import React, { useState, useCallback,  } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useTheme } from '../ThemeProvider';
import { useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';

import useWorkoutStore from '../../store/useWorkoutStore';
import { useFocusEffect } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';


export default function WorkoutCalendarScreen() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const styles = getStyles(isDark);
  const navigation = useNavigation();

  const today = dayjs().format('YYYY-MM-DD');
  const [selectedDate, setSelectedDate] = useState(today);

  const handleStartWorkout = () => {
    navigation.navigate('WorkoutSession', { date: selectedDate });
  };

  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose a Day</Text>

      <Calendar
        key={isDark ? 'dark' : 'light'}
        current={today}
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={{
          [selectedDate]: {
            selected: true,
            selectedColor: '#007AFF',
          },
        }}
        theme={{
          
          backgroundColor: isDark ? '#000' : '#fff',
          calendarBackground: isDark ? '#000' : '#fff',
          dayTextColor: isDark ? '#fff' : '#000',
          textDisabledColor: '#737373',
          monthTextColor: isDark ? '#fff' : '#000',
          arrowColor: isDark ? '#fff' : '#000',
        }}
      />

      <TouchableOpacity style={styles.button} onPress={handleStartWorkout}>
        <Text style={styles.buttonText}>Start Workout</Text>
      </TouchableOpacity>
    </View>
  );
}

const getStyles = (isDark) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#000' : '#fff',
      padding: 16,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: isDark ? '#fff' : '#000',
      textAlign: 'center',
      marginVertical: 60,
    },
    button: {
      backgroundColor: '#007AFF',
      padding: 16,
      borderRadius: 12,
      marginTop: 20,
      alignItems: 'center',
    },
    buttonText: {
      color: '#fff',
      fontWeight: '600',
      fontSize: 16,
    },
  });