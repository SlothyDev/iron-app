import { collection, query, where, getDocs, orderBy, Timestamp } from 'firebase/firestore';
import { db, auth } from '../firebase/firebase';

export async function getWorkoutsByDateRange(startDate, endDate) {
  const user = auth.currentUser;
  if (!user) return [];

  // Convert JS Dates to Firestore Timestamps
  const startTS = Timestamp.fromDate(startDate);
  const endTS = Timestamp.fromDate(endDate);

  // Point to the user's workouts subcollection
  const workoutsRef = collection(db, `users/${user.uid}/workouts`);

  const q = query(
    workoutsRef,
    where('workoutDate', '>=', startTS),
    where('workoutDate', '<=', endTS),
    orderBy('workoutDate', 'desc')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}