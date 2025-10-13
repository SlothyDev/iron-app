import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSettings } from '../components/settings/SettingsContext';

export default function SettingsScreen( {navigation} ) {
  const { units, setUnits } = useSettings();



  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Units</Text>

      <TouchableOpacity
        style={[styles.option, units === 'imperial' && styles.selected]}
        onPress={() => setUnits('imperial')}
      >
        <Text style={styles.optionText}>Imperial (lbs, inches)</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.option, units === 'metric' && styles.selected]}
        onPress={() => setUnits('metric')}
      >
        <Text style={styles.optionText}>Metric (kg, cm)</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("MainTabs")}>
                    <Text>Main menu</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: 'white' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  option: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 15,
    borderRadius: 8,
  },
  selected: {
    backgroundColor: '#007AFF',
  },
  optionText: {
    fontSize: 18,
    color: 'black',
  },
});