import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from './firebase'; // Assuming you're exporting `auth` from your `firebase.js`

const signUp = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

const signIn = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

const logOut = () => {
  return signOut(auth);
};

const getCurrentUser = () => {
  return auth.currentUser;
};

export { signUp, signIn, logOut, getCurrentUser };
