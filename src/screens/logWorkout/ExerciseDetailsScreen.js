import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { useTheme } from '../ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import useWorkoutStore from '../../store/useWorkoutStore';
import { useSettings } from '../../components/settings/SettingsContext';
import MuscleMap from './SVGCreator';
import MuscleBackMap from './SVGCreatorBack'
import Feather from '@expo/vector-icons/Feather';



export default function ExerciseDetailsScreen({ route, navigation }) {

  const { exercise } = route.params;
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const { units } = useSettings();


  const [sets, setSets] = useState([{ reps: '', weight: '' }]);

  const styles = getStyles(isDark);

  const handleSetChange = (index, field, value) => {
    const updatedSets = [...sets];
    updatedSets[index][field] = value;
    setSets(updatedSets);
  };

  const addSet = (reps = '', weight = '') => setSets([...sets, { reps, weight }]);
  const removeSet = (index) => {
    if (sets.length > 1) {
      setSets(sets.filter((_, i) => i !== index));
    }
  };

  const addExercise = useWorkoutStore((state) => state.addExercise);

  const handleFinish = () => {
    const cleanedSets = sets
        .map((set) => ({
          reps: parseInt(set.reps, 10),
          weight: exercise.movementType === 'reps' ? (!isNaN(parseFloat(set.weight)) ? parseFloat(set.weight) : 0) : null,
        }))
        .filter((set) => !isNaN(set.reps));
    if (cleanedSets.length !== 0){
      

      addExercise({
        id: exercise.id,
        name: exercise.name,
        type: exercise.movementType,
        sets: cleanedSets,
        primary: exercise.primaryMuscles,
        secondary: exercise.secondaryMuscles
      });

      navigation.navigate('WorkoutSession');
    }
    else{
      Alert.alert('Sets cannot be empty!');
    }
  };


  return (
    <ScrollView style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}>
      <Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>
        {exercise.name}
      </Text>

      {/* Muscles used (replace with graphic later) */}
      {/*<View style={styles.muscleGroupContainer}>
        <Text style={[styles.label, { color: isDark ? '#aaa' : '#444' }]}>Primary Muscles:</Text>
        {exercise.primaryMuscles?.map((m, i) => (
          <Text key={i} style={[styles.muscle, { color: isDark ? '#fff' : '#000' }]}>
            - {m}
          </Text>
        ))}
        {exercise.secondaryMuscles?.length > 0 && (
          <>
            <Text style={[styles.label, { color: isDark ? '#aaa' : '#444', marginTop: 6 }]}>
              Secondary Muscles:
            </Text>
            {exercise.secondaryMuscles.map((m, i) => (
              <Text key={i} style={[styles.muscle, { color: isDark ? '#ccc' : '#111' }]}>
                - {m}
              </Text>
            ))}
          </>
        )}
      </View>*/}
      
      
      {/*<View style={styles.instructionsContainer}>*/}
        {/*<Text style={styles.instructionText}>*/}
          {/*exercise.instructions*/}
        {/*</Text>*/}
      {/*</View>*/}
      {/* Dynamic set inputs */}
    <View style={styles.containerDiagram}>
      <MuscleMap primary={exercise.primaryMuscles} secondary={exercise.secondaryMuscles} style={styles.diagram}/>
      <MuscleBackMap primary={exercise.primaryMuscles} secondary={exercise.secondaryMuscles} style={styles.diagram}/>
    </View>
      

      <View style={styles.setsContainer}>
        <Text style={[styles.label, { color: isDark ? '#aaa' : '#444' }]}>Sets:</Text>
        {sets.map((set, index) => (
          <View key={index} style={styles.setRow}>
            <TouchableOpacity style={styles.iconContainer} onPress={() => addSet(set.reps, set.weight)}>
              <Feather name="repeat" size={20} color="#00ff2aff" />
            </TouchableOpacity>
            <Text style={[styles.setLabel, { color: isDark ? '#eee' : '#000' }]}>Set {index + 1}</Text>


            {exercise.movementType === "reps" && (<TextInput
              placeholder="Reps"
              placeholderTextColor={isDark ? '#888' : '#aaa'}
              keyboardType="numeric"
              value={set.reps}
              onChangeText={(val) => handleSetChange(index, 'reps', val)}
              style={[styles.input, { backgroundColor: isDark ? '#222' : '#eee', color: isDark ? '#fff' : '#000' }]}
            />)}
            {exercise.movementType === "timed" && (<TextInput
              placeholder="Time"
              placeholderTextColor={isDark ? '#888' : '#aaa'}
              keyboardType="numeric"
              value={set.reps}
              onChangeText={(val) => handleSetChange(index, 'reps', val)}
              style={[styles.input, { backgroundColor: isDark ? '#222' : '#eee', color: isDark ? '#fff' : '#000' }]}
            />)}
            {exercise.movementType === "reps" && (<TextInput
              placeholder={units == "metric" ? 'kgs' : 'lbs'}
              placeholderTextColor={isDark ? '#888' : '#aaa'}
              keyboardType="numeric"
              value={set.weight}
              onChangeText={(val) => handleSetChange(index, 'weight', val)}
              style={[styles.input, { backgroundColor: isDark ? '#222' : '#eee', color: isDark ? '#fff' : '#000' }]}
            />)}
            <TouchableOpacity style={styles.iconContainer} onPress={() => removeSet(index)}>
              <Feather name="trash" size={20} color="#ff0000ff" />
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity onPress={addSet} style={styles.addSetButton}>
          <Ionicons name="add-circle-outline" size={24} color="#007aff" />
          <Text style={styles.addSetText}>Add Set</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.finishButton} onPress={handleFinish}>
        <Text style={styles.finishButtonText}>Finish</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const getStyles = (isDark) =>
  StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  containerDiagram: {
    flexDirection: 'row',      
    justifyContent: 'center',  
    alignItems: 'center',
    width: '100%',
  },
  diagram: {
    flex: 1,                   
    aspectRatio: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  instructionsContainer: {
    backgroundColor: isDark ? '#1e1e1e' : '#f9f9f9',
    borderRadius: 16,
    padding: 16,
    marginVertical: 12,
    shadowColor: isDark ? '#000' : '#ccc',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  instructionText: {
    fontSize: 12,
    lineHeight: 18,
    color: isDark ? '#e0e0e0' : '#1a1a1a',
    fontWeight: '400',
  },
  muscleGroupContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  muscle: {
    fontSize: 14,
    marginLeft: 10,
  },
  setsContainer: {
    marginBottom: 30,
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  setLabel: {
    width: 50,
    fontWeight: '600',
  },
  input: {
    flex: 1,
    marginHorizontal: 6,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    fontSize: 16,
  },
  addSetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  addSetText: {
    marginLeft: 6,
    fontSize: 16,
    color: '#007aff',
    fontWeight: '600',
  },
  finishButton: {
    backgroundColor: '#007aff',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  finishButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  iconContainer: {
    marginHorizontal: 6
  }
});