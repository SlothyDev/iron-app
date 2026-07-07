import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";

export async function getLikedPosts() {
  const user = auth.currentUser;
  if (!user) return {};

  const snapshot = await getDocs(
    collection(db, "users", user.uid, "likedPosts")
  );

  const liked = {};

  snapshot.forEach(doc => {
    liked[doc.id] = true;
  });

  return liked;
}