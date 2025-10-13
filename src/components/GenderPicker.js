import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function GenderPicker({ gender, setGender, isDark }) {
  const options = ['Male', 'Female', 'Other'];

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <Text style={[styles.label, isDark && styles.labelDark]}>Gender</Text>
      <View style={styles.optionsRow}>
        {options.map((option) => {
          const selected = gender === option;
          return (
            <TouchableOpacity
              key={option}
              onPress={() => setGender(option)}
              style={[
                styles.optionButton,
                selected && (isDark ? styles.optionSelectedDark : styles.optionSelectedLight),
              ]}
            >
              <Text
                style={[
                  styles.optionText,
                  selected ? (isDark ? styles.optionTextSelectedDark : styles.optionTextSelectedLight) : (isDark ? styles.optionTextDark : styles.optionTextLight),
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  containerDark: {
    // optionally add dark background or border here if needed
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#222',
  },
  labelDark: {
    color: '#ccc',
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  optionButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 6,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#888',
    alignItems: 'center',
    backgroundColor: '#eee',
    // for iOS-like toggle switch feel
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  optionSelectedLight: {
    backgroundColor: '#007aff',
    borderColor: '#007aff',
  },
  optionSelectedDark: {
    backgroundColor: '#0a84ff',
    borderColor: '#0a84ff',
  },
  optionText: {
    fontWeight: '600',
  },
  optionTextLight: {
    color: '#333',
  },
  optionTextDark: {
    color: '#333',
  },
  optionTextSelectedLight: {
    color: '#fff',
  },
  optionTextSelectedDark: {
    color: '#fff',
  },
});