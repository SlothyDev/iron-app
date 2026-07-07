import { db } from '../firebase/firebase'; // make sure your firebase.js exports initialized db
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
  Timestamp,
  writeBatch,
} from 'firebase/firestore';


import { calculateWorkoutStats } from './WorkoutHelper';

async function deleteSubcollection(collectionPath) {
  const snapshot = await getDocs(collectionPath);

  const batch = writeBatch(db);

  snapshot.forEach((document) => {
    batch.delete(document.ref);
  });

  await batch.commit();
}

export async function saveUserWorkout(userId, workout) {
  const workoutId =
    workout.id || doc(collection(db, 'users', userId, 'workouts')).id;

  const now = serverTimestamp();

  const baseData = {
    id: workoutId,
    userId,

    title: workout.title || "Untitled Workout",
    comments: workout.comments || "",
    isPublic: !!workout.isPublic,
    elapsed: workout.elapsed ?? 0,
    workoutDate: workout.workoutDate || Timestamp.now(),

    likeCount: workout.likeCount ?? 0,
    commentCount: workout.commentCount ?? 0,

    exercises: workout.exercises || [],

    createdAt: workout.createdAt ?? now,
    updatedAt: now,
  };

  await setDoc(
    doc(db, 'users', userId, 'workouts', workoutId),
    baseData,
    { merge: true }
  );

  return baseData;
}

export async function publishWorkoutPost(userId, workout) {
  if (!workout.isPublic) return;

  const userSnap = await getDoc(doc(db, 'users', userId));
  const user = userSnap.data();

  const stats = calculateWorkoutStats(workout);

  const post = {
    ...workout,

    userId,

    username: user?.username || "Unknown",
    photoURL: user?.profilePicUrl || null,

    totalVolume: stats.totalVolume * 1000,

    createdAt: workout.createdAt || serverTimestamp(),
  };

  await setDoc(doc(db, 'posts', workout.id), post, { merge: true });
}

export async function saveWorkout(userId, workout) {
  const baseData = await saveUserWorkout(userId, workout);
  await publishWorkoutPost(userId, baseData);
  return baseData;
}

/*export async function saveWorkout(userId, workout) {
  try {
    const workoutId =
      workout.id || doc(collection(db, 'users', userId, 'workouts')).id;

    const now = serverTimestamp();

    const baseData = {
      id: workoutId,
      userId,

      title: workout.title || "Untitled Workout",
      comments: workout.comments || "",

      isPublic: !!workout.isPublic,

      workoutDate: workout.workoutDate || Timestamp.now(),

      likeCount: workout.likeCount ?? 0,
      commentCount: workout.commentCount ?? 0,

      exercises: workout.exercises || [],

      createdAt: workout.createdAt ?? now,
      updatedAt: now,
    };

    // USER COPY
    await setDoc(
      doc(db, 'users', userId, 'workouts', workoutId),
      baseData,
      { merge: true }
    );

    // PUBLIC POST COPY
    if (baseData.isPublic) {
      await setDoc(
        doc(db, 'posts', workoutId),
        baseData,
        { merge: true }
      );
    }

    return baseData;
  } catch (error) {
    console.error('Error saving workout:', error);
    throw error;
  }
*/

export async function getWorkouts(userId) {
  try {
    const workoutsRef = collection(db, 'users', userId, 'workouts');

    const q = query(
      workoutsRef,
      orderBy('workoutDate', 'desc')
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error fetching workouts:', error);
    throw error;
  }
}


export async function deleteWorkout(userId, workoutId) {
  try {
    // Delete private workout
    const workoutRef = doc(db, 'users', userId, 'workouts', workoutId);
    await deleteDoc(workoutRef);


    // Check if shared post exists
    const postRef = doc(db, 'posts', workoutId);
    const postSnap = await getDoc(postRef);

    if (postSnap.exists()) {

      // Delete comments
      await deleteSubcollection(
        collection(db, 'posts', workoutId, 'comments')
      );

      // Delete likes
      await deleteSubcollection(
        collection(db, 'posts', workoutId, 'likes')
      );


      // Delete post itself
      await deleteDoc(postRef);

      console.log("✅ post + comments + likes deleted");

    } else {
      console.log("ℹ️ no post to delete (private workout)");
    }

  } catch (error) {
    console.error('Error deleting workout:', error);
    throw error;
  }
}