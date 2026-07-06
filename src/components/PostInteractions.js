import { db, auth } from '../firebase/firebase';
import {
  doc,
  setDoc,
  deleteDoc,
  getDoc,
  updateDoc,
  increment,
  collection,
  serverTimestamp,
} from 'firebase/firestore';

export async function toggleLike(postId) {
  const user = auth.currentUser;
  if (!user) return;

  const likeRef = doc(db, 'posts', postId, 'likes', user.uid);
  const postRef = doc(db, 'posts', postId);

  const snap = await getDoc(likeRef);

  if (snap.exists()) {
    await deleteDoc(likeRef);
    await updateDoc(postRef, {
      likeCount: increment(-1),
    });
    return false;
  } else {
    await setDoc(likeRef, {
      createdAt: new Date(),
    });
    await updateDoc(postRef, {
      likeCount: increment(1),
    });
    return true;
  }
}

export async function isPostLiked(postId) {
  const user = auth.currentUser;
  if (!user) return false;

  const likeRef = doc(db, 'posts', postId, 'likes', user.uid);
  const snap = await getDoc(likeRef);

  return snap.exists();
}

export async function addComment(postId, text) {
  const user = auth.currentUser;
  if (!user || !text.trim()) return;

  const userSnap = await getDoc(doc(db, 'users', user.uid));

  const userData = userSnap.exists() ? userSnap.data() : {};
  console.log(userData)
  const commentRef = doc(collection(db, 'posts', postId, 'comments'));
  const postRef = doc(db, 'posts', postId);

  await setDoc(commentRef, {
    userId: user.uid,
    username: userData.username || 'Unknown',
    photoURL: userData.profilePicUrl || '',
    text: text.trim(),
    createdAt: serverTimestamp(),
  });

  await updateDoc(postRef, {
    commentCount: increment(1),
  });
}

import { getDocs, query, orderBy } from 'firebase/firestore';

export async function getComments(postId) {
  const q = query(
    collection(db, 'posts', postId, 'comments'),
    orderBy('createdAt', 'desc')
  );

  const snap = await getDocs(q);

  return snap.docs.map(d => ({
    id: d.id,
    ...d.data(),
  }));
}