import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

export default function ResumeWorkoutModal({
  visible,
  onResume,
  onDiscard,
  elapsed,
  exerciseCount,
}) {
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');

    const s = (seconds % 60)
      .toString()
      .padStart(2, '0');

    return `${m}:${s}`;
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>
            Resume Workout?
          </Text>

          <Text style={styles.text}>
            You have an unfinished workout
          </Text>

          <Text style={styles.stats}>
            Duration: {formatTime(elapsed)}
          </Text>

          <Text style={styles.stats}>
            Exercises: {exerciseCount}
          </Text>


          <View style={styles.buttons}>

            <TouchableOpacity
              style={styles.resume}
              onPress={onResume}
            >
              <Text style={styles.buttonText}>
                Resume
              </Text>
            </TouchableOpacity>


            <TouchableOpacity
              style={styles.discard}
              onPress={onDiscard}
            >
              <Text style={styles.buttonText}>
                Discard
              </Text>
            </TouchableOpacity>

          </View>
        </View>
      </View>
    </Modal>
  );
}


const styles = StyleSheet.create({
  overlay:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'rgba(0,0,0,0.5)',
  },

  card:{
    width:'85%',
    padding:25,
    borderRadius:20,
    backgroundColor:'#1c1c1e',
  },

  title:{
    color:'#fff',
    fontSize:24,
    fontWeight:'700',
    marginBottom:10,
  },

  text:{
    color:'#ccc',
    marginBottom:15,
  },

  stats:{
    color:'#fff',
    fontSize:16,
    marginBottom:5,
  },

  buttons:{
    flexDirection:'row',
    marginTop:20,
    gap:10,
  },

  resume:{
    flex:1,
    backgroundColor:'#007aff',
    padding:14,
    borderRadius:10,
    alignItems:'center',
  },

  discard:{
    flex:1,
    backgroundColor:'#ff3b30',
    padding:14,
    borderRadius:10,
    alignItems:'center',
  },

  buttonText:{
    color:'#fff',
    fontWeight:'600',
  }
});