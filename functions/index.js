const { onCall, HttpsError } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");

admin.initializeApp();

const db = admin.firestore();


exports.deleteWorkoutPost = onCall(async (request) => {

  const uid = request.auth?.uid;

  if (!uid) {
    throw new HttpsError(
      "unauthenticated",
      "You must be logged in."
    );
  }


  const { postId } = request.data;

  if (!postId) {
    throw new HttpsError(
      "invalid-argument",
      "Missing postId."
    );
  }


  const postRef = db
    .collection("posts")
    .doc(postId);


  const postSnap = await postRef.get();


  if (!postSnap.exists) {
    return {
      success: true,
      message: "Post already deleted"
    };
  }


  const postData = postSnap.data();


  // Security check: only post owner can delete
  if (postData.userId !== uid) {
    throw new HttpsError(
      "permission-denied",
      "You do not own this post."
    );
  }


  const batch = db.batch();


  /*
    DELETE LIKES
  */

  const likesSnap = await postRef
    .collection("likes")
    .get();


  likesSnap.forEach((likeDoc) => {

    // Delete posts/{postId}/likes/{uid}
    batch.delete(likeDoc.ref);


    // Delete users/{uid}/likedPosts/{postId}
    batch.delete(
      db
        .collection("users")
        .doc(likeDoc.id)
        .collection("likedPosts")
        .doc(postId)
    );

  });



  /*
    DELETE COMMENTS
  */

  const commentsSnap = await postRef
    .collection("comments")
    .get();


  commentsSnap.forEach((commentDoc) => {
    batch.delete(commentDoc.ref);
  });



  /*
    DELETE POST
  */

  batch.delete(postRef);


  await batch.commit();


  return {
    success: true
  };

});