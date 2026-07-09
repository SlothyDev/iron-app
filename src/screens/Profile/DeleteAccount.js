import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Alert,
  StyleSheet,
} from 'react-native';
import { auth } from '../../firebase/firebase';
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  deleteUser,
} from 'firebase/auth';
import { doc, deleteDoc, collection, query, getDoc, getDocs, collectionGroup, where } from 'firebase/firestore';
import { ref, deleteObject, getStorage } from 'firebase/storage';
import { db, app} from '../../firebase/firebase';
const storage = getStorage(app);

export function DeleteAccountButton({ navigation }) {
  const [reauthModalVisible, setReauthModalVisible] = useState(false);
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const promiseRef = useRef(null);

  // Open modal and return Promise that resolves when user successfully reauthenticates
  const reauthenticateUser = () => {
    setPassword('');
    setErrorMessage('');
    setReauthModalVisible(true);

    return new Promise((resolve, reject) => {
      promiseRef.current = { resolve, reject };
    });
  };

  const handleConfirmReauth = async () => {
    if (!password.trim()) {
      setErrorMessage('Password is required.');
      return;
    }

    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user || !user.email) {
        setErrorMessage('No logged-in user.');
        setLoading(false);
        return;
      }
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);

      setReauthModalVisible(false);
      promiseRef.current?.resolve();
    } catch (error) {
      if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        setErrorMessage('Invalid password, please try again.');
      } else if (error.code === 'auth/too-many-requests') {
        setErrorMessage('Too many requests, try again later.');
      } else {
        setErrorMessage(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancelReauth = () => {
    setReauthModalVisible(false);
    promiseRef.current?.reject(new Error('Reauthentication cancelled.'));
  };


  async function deleteCollection(collectionRef) {
    const snapshot = await getDocs(collectionRef);

    for (const docSnap of snapshot.docs) {
      await deleteDoc(docSnap.ref);
    }
  }

  const handleDeleteAccount = async () => {
    try {
      await reauthenticateUser();

      const user = auth.currentUser;

      if (!user) {
        Alert.alert('Error', 'No logged-in user.');
        return;
      }

      setLoading(true);

      const uid = user.uid;


      /*
        1. Delete user's workouts
      */
      const workoutsRef = collection(db, 'users', uid, 'workouts');
      const workoutsSnap = await getDocs(workoutsRef);

      for (const workout of workoutsSnap.docs) {

        // Delete public post if it exists
        const postRef = doc(db, 'posts', workout.id);
        const postSnap = await getDoc(postRef);

        if (postSnap.exists()) {

          // delete likes
          await deleteCollection(
            collection(db, 'posts', workout.id, 'likes')
          );

          // delete comments
          await deleteCollection(
            collection(db, 'posts', workout.id, 'comments')
          );

          await deleteDoc(postRef);
        }


        // delete workout
        await deleteDoc(workout.ref);
      }



      /*
        2. Delete likedPosts
      */
      await deleteCollection(
        collection(db, 'users', uid, 'likedPosts')
      );



      /*
        3. Delete username reservation
      */
      const userSnap = await getDoc(doc(db, 'users', uid));

      if (userSnap.exists()) {
        const username = userSnap.data().username;

        if (username) {
          await deleteDoc(
            doc(db, 'usernames', username)
          );
        }
      }


      const commentsQuery = query(
        collectionGroup(db, 'comments'),
        where('userId', '==', uid)
      );

      const commentsSnap = await getDocs(commentsQuery);

      for (const comment of commentsSnap.docs) {
        await deleteDoc(comment.ref);
      }


      // Delete likes made by this user
      const likesQuery = query(
        collectionGroup(db, 'likes')
      );

      const likesSnap = await getDocs(likesQuery);

      for (const like of likesSnap.docs) {
        if (like.id === uid) {
          await deleteDoc(like.ref);
        }
      }


      /*
        4. Delete user document
      */
      await deleteDoc(
        doc(db, 'users', uid)
      );



      /*
        5. Delete profile picture
      */
      const profilePicRef = ref(
        storage,
        `profile_pics/${uid}.jpg`
      );

      await deleteObject(profilePicRef)
        .catch(() => {
          console.log("No profile picture found");
        });



      /*
        6. Delete Firebase Auth account
      */
      await deleteUser(user);


      Alert.alert(
        'Account Deleted',
        'Your account and all data have been removed.'
      );

      navigation.replace('Login');


    } catch(error) {

      console.error(error);

      if (error.message !== 'Reauthentication cancelled.') {
        Alert.alert(
          'Error',
          error.message
        );
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ marginTop: 20 }}>
      <TouchableOpacity
        style={{
          backgroundColor: 'red',
          padding: 12,
          borderRadius: 8,
          alignItems: 'center',
        }}
        onPress={handleDeleteAccount}
        disabled={loading}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>
          {loading ? 'Processing...' : 'Delete Account'}
        </Text>
      </TouchableOpacity>

      {/* Reauth Modal */}
      <Modal visible={reauthModalVisible} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Re-enter Password</Text>

            <TextInput
              placeholder="Password"
              secureTextEntry
              autoFocus
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errorMessage) setErrorMessage('');
              }}
              style={[
                styles.input,
                errorMessage ? { borderColor: 'red' } : { borderColor: '#ccc' },
              ]}
              editable={!loading}
            />
            {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

            {loading ? (
              <ActivityIndicator size="small" />
            ) : (
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: '#888' }]}
                  onPress={handleCancelReauth}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: 'red' }]}
                  onPress={handleConfirmReauth}
                >
                  <Text style={styles.buttonText}>Confirm</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: '#00000088',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 5,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});