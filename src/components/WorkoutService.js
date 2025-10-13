import { db } from '../firebase/firebase'; // make sure your firebase.js exports initialized db
import {
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  query,
  orderBy
} from 'firebase/firestore';


export async function saveWorkout(userId, workout) {
  try {
    const workoutsCollection = collection(db, 'users', userId, 'workouts');

    let workoutRef;
    if (workout.id) {
      workoutRef = doc(workoutsCollection, workout.id);
    } else {
      workoutRef = doc(workoutsCollection); 
      workout.id = workoutRef.id; 
    }

    const workoutData = {
      ...workout,
      date: workout.date || new Date().toISOString(),
    };

    await setDoc(workoutRef, workoutData);
    return workoutData;
  } catch (error) {
    console.error('Error saving workout:', error);
    throw error;
  }
}


export async function getWorkouts(userId) {
  try {
    const workoutsRef = collection(db, 'users', userId, 'workouts');
    const q = query(workoutsRef, orderBy('date', 'desc'));
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => doc.data());
  } catch (error) {
    console.error('Error fetching workouts:', error);
    throw error;
  }
}

export async function deleteWorkout(userId, workoutId) {
  try {
    const workoutRef = doc(db, 'users', userId, 'workouts', workoutId);
    await deleteDoc(workoutRef);
  } catch (error) {
    console.error('Error deleting workout:', error);
    throw error;
  }
}