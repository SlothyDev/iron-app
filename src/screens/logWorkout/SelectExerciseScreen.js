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
  Chest: ['pectoralis major', 'pectoralis minor', 'sternocostal part', 'clavicular part'],
  Back: ['latissimus dorsi', 'trapezius', 'rhomboids', 'erector spinae'],
  Legs: ['vastus lateralis', 'rectus femoris', 'vastus intermedius', 'gastrocnemius', 'soleus'],
  Shoulders: ['anterior deltoid', 'lateral deltoid', 'posterior deltoid'],
  Arms: ['biceps brachii long head', 'biceps brachii short head', 'triceps brachii long head', 'triceps brachii lateral head', 'triceps brachii medial head', 'brachialis'],
  Core: ['rectus abdominis', 'obliques', 'transverse abdominis', 'erector spinae'],
};

const normalize = (t) =>
  (t ?? '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();

function isExerciseInBroadGroup(exercise, group) {
  if (!group) return true;
  const set = new Set(broadMuscleGroups[group]?.map(m => m.toLowerCase()) || []);
  return (exercise.primaryMuscles || []).some(m => set.has(m.toLowerCase()));
}

function groupByPrimaryMuscle(exercises) {
  const map = new Map();

  for (const ex of exercises) {
    const key = ex.primaryMuscles?.[0] || 'Other';
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(ex);
  }

  return Array.from(map.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([title, data]) => ({ title, data }));
}

function highlightMatch(text, query) {
  if (!query) return [{ text, match: false }];
  const parts = text.split(new RegExp(`(${query})`, 'ig'));
  return parts.map(p => ({
    text: p,
    match: p.toLowerCase() === query.toLowerCase(),
  }));
}

export default function SelectExerciseScreen({ navigation }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(null);

  const listRef = useRef(null);

  const query = useMemo(() => normalize(searchQuery), [searchQuery]);

  const styles = getStyles(isDark);

  const filtered = useMemo(() => {
    const q = query;

    if (!q && !selectedGroup) return dummyExercises;

    return dummyExercises.filter(ex => {
      const name = normalize(ex.name);

      const matchText = name.includes(q);
      const matchGroup = isExerciseInBroadGroup(ex, selectedGroup);

      return matchText && matchGroup;
    });
  }, [query, selectedGroup]);

  const sections = useMemo(() => {
    if (!filtered.length) return [];
    return groupByPrimaryMuscle(filtered);
  }, [filtered]);

  // SAFE SCROLL (prevents "item length 0" crash)
  useEffect(() => {
    if (!sections.length) return;

    requestAnimationFrame(() => {
      listRef.current?.scrollToLocation({
        sectionIndex: 0,
        itemIndex: 0,
        animated: false,
      });
    });
  }, [sections.length]);

  function AnimatedChip({ label, selected, onPress }) {
    const style = useAnimatedStyle(() => ({
      transform: [{ scale: withSpring(selected ? 1.08 : 1) }],
    }));

    return (
      <TouchableOpacity onPress={onPress}>
        <Animated.View style={[styles.chip, selected && styles.chipSelected, style]}>
          <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
            {label}
          </Text>
        </Animated.View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Exercise</Text>

      <View style={styles.searchWrapper}>
        <Ionicons name="search" size={18} color={isDark ? '#aaa' : '#666'} />
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search..."
          placeholderTextColor={isDark ? '#888' : '#aaa'}
          autoCorrect={false}
          autoCapitalize="none"
        />
      </View>

      <FlatList
        data={Object.keys(broadMuscleGroups)}
        horizontal
        keyExtractor={(i) => i}
        renderItem={({ item }) => (
          <AnimatedChip
            label={item}
            selected={selectedGroup === item}
            onPress={() =>
              setSelectedGroup(selectedGroup === item ? null : item)
            }
          />
        )}
      />

      <SectionList
        ref={listRef}
        sections={sections}
        keyExtractor={(item, index) => item.id ?? index.toString()}
        renderItem={({ item }) => {
          const parts = highlightMatch(item.name, query);

          return (
            <TouchableOpacity
              style={styles.exerciseCard}
              onPress={() =>
                navigation.push('ExerciseDetails', {
                  exercise: item,
                })
              }
            >
              <Text style={styles.exerciseText}>
                {parts.map((p, i) => (
                  <Text
                    key={i}
                    style={p.match ? { color: '#007aff', fontWeight: '800' } : null}
                  >
                    {p.text}
                  </Text>
                ))}
              </Text>

              <Text style={styles.exerciseSub}>{item.type}</Text>
            </TouchableOpacity>
          );
        }}
        contentContainerStyle={{ paddingBottom: 120 }}
        keyboardShouldPersistTaps="handled"
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
