import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SectionList,
  FlatList,

} from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useTheme } from '../ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
const dummyExercises = require('../../../data/exercises_detailed.json');

const broadMuscleGroups = {
  Chest: ['pectoralis major', 'Pectoralis minor', 'sternocostal part', 'clavicular part'],
  Back: ['latissimus dorsi', 'trapezius', 'rhomboids', 'erector spinae'],
  Legs: ['Vastus lateralis', 'Rectus femoris', 'Vastus intermedius', 'Gastrocnemius', 'Soleus'],
  Shoulders: ['Anterior deltoid', 'Lateral deltoid', 'Posterior deltoid'],
  Arms: ['Biceps brachii long head', 'Biceps brachii short head', 'Triceps brachii long head', 'Triceps brachii lateral head', 'Triceps brachii medial head', 'brachialis',],
  Core: ['rectus abdominis', 'obliques', 'transverse abdominis', 'erector spinae'],
};

function isExerciseInBroadGroup(exercise, broadGroup) {
  if (!broadGroup) return true;
  const musclesInGroup = broadMuscleGroups[broadGroup].map((m) => m.toLowerCase());
  return Array.isArray(exercise.primaryMuscles) && exercise.primaryMuscles.some((m) =>
    musclesInGroup.includes(m.toLowerCase())
  );
}


function groupByPrimaryMuscle(exercises) {
  const groups = {};

  exercises.forEach((ex) => {
    const group = Array.isArray(ex.primaryMuscles) && ex.primaryMuscles.length > 0
      ? ex.primaryMuscles[0]
      : 'Other';
    if (!groups[group]) groups[group] = [];
    groups[group].push(ex);
  });

  return Object.keys(groups)
    .sort()
    .map((group) => ({
      title: group,
      data: groups[group],
    }));
}

const uniqueTypes = [...new Set(dummyExercises.map((ex) => ex.type || 'Other'))].sort();

export default function SelectExerciseScreen({ navigation }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBroadMuscleGroup, setSelectedBroadMuscleGroup] = useState(null);

  const listRef = useRef(null);

  useEffect(() => {
    listRef.current?.scrollToLocation({
      sectionIndex: 0,
      itemIndex: 0,
      animated: false,
    });
  }, [searchQuery, selectedBroadMuscleGroup]);

  const styles = getStyles(isDark);

  const filteredExercises = useMemo(() => {
  const query = searchQuery.toLowerCase();
  const broadGroupFilter = selectedBroadMuscleGroup;
  

  


  return dummyExercises.filter((ex) => {
        const nameMatch = ex.name.toLowerCase().includes(query);
        const muscleMatch = isExerciseInBroadGroup(ex, broadGroupFilter);

        return nameMatch && muscleMatch;
      }).sort((a, b) => a.name.localeCompare(b.name));
    }, [searchQuery, selectedBroadMuscleGroup]);

  const sections = useMemo(() => groupByPrimaryMuscle(filteredExercises), [filteredExercises]);



  function AnimatedChip({ label, selected, onPress }) {
    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: withSpring(selected ? 1.1 : 1) }],
    }));

    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <Animated.View style={[styles.chip, selected && styles.chipSelected, animatedStyle]}>
          <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
        </Animated.View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select an Exercise</Text>

      <View style={styles.searchWrapper}>
        <Ionicons name="search" size={18} color={isDark ? '#aaa' : '#666'} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search exercise..."
          placeholderTextColor={isDark ? '#888' : '#aaa'}
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
          autoCorrect={false}
          autoCapitalize="none"
        />
      </View>

      <View style={styles.filterHeader}>
        <Text style={styles.filterLabel}>Muscle Group</Text>
        {(selectedBroadMuscleGroup) && (
          <TouchableOpacity
            onPress={() => {
              setSelectedBroadMuscleGroup(null);
            }}
          >
            <Text style={styles.clearFilters}>Clear Filters</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={Object.keys(broadMuscleGroups)}
        keyExtractor={(item) => item}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipScroll}
        renderItem={({ item }) => (
          <AnimatedChip
            label={item}
            selected={selectedBroadMuscleGroup === item}
            onPress={() =>
              setSelectedBroadMuscleGroup(selectedBroadMuscleGroup === item ? null : item)
            }
          />
        )}
      />

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        stickySectionHeadersEnabled={false}
        ref={listRef}

        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.exerciseCard}
            onPress={() =>
              navigation.navigate('ExerciseDetails', {
                exercise: item,
                onComplete: navigation.getState().routes.find(r => r.name === 'WorkoutSession')?.params?.onComplete,
              })
            }
          >
            <Text style={styles.exerciseText}>{item.name}</Text>
            <Text style={styles.exerciseSub}>{item.type}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
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
      fontSize: 28,
      fontWeight: 'bold',
      color: isDark ? '#fff' : '#000',
      marginTop: 50,
      marginBottom: 12,
      textAlign: 'center',
    },
    searchWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDark ? '#222' : '#eee',
      borderRadius: 10,
      paddingHorizontal: 10,
      marginBottom: 12,
    },
    searchInput: {
      flex: 1,
      color: isDark ? '#fff' : '#000',
      paddingVertical: 8,
      paddingHorizontal: 6,
      fontSize: 16,
    },
    chipScroll: {
      paddingLeft: 2,
    },
    chip: {
      backgroundColor: isDark ? '#333' : '#ccc',
      borderRadius: 20,
      paddingHorizontal: 16,
      paddingVertical: 10, 
      marginRight: 10,
      marginBottom: 10,
      alignSelf: 'flex-start',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: 36, 
    },

    chipText: {
      color: isDark ? '#eee' : '#333',
      fontSize: 14,
      fontWeight: '600',
      textAlign: 'center',
      includeFontPadding: false, 
      paddingBottom: 1, 
      lineHeight: 18,  
    },
    chipSelected: {
      backgroundColor: '#007aff',
      shadowOpacity: 0.35,
      elevation: 5,
    },
    chipTextSelected: {
      color: '#fff',
    },
    exerciseCard: {
      backgroundColor: isDark ? '#1c1c1e' : '#f9f9f9',
      padding: 16,
      borderRadius: 12,
      marginTop: 8,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 2,
    },
    exerciseText: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#fff' : '#000',
    },
    exerciseSub: {
      fontSize: 12,
      color: isDark ? '#aaa' : '#666',
      marginTop: 4,
    },
    filterHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 10,
    },
    filterLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#eee' : '#111',
      marginTop: 10,
    },
    clearFilters: {
      fontSize: 14,
      fontWeight: '600',
      color: '#ff3b30',
    },
  });
