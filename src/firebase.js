import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/functions';
import 'firebase/storage';
import 'firebase/database';
import 'firebase/app-check';

// Configure and initialise Firebase
// Config variables are pulled from the environment at build time
const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};
const functions = firebase.initializeApp(config).functions('europe-west2');
const firestore = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
const database = firebase.database();
const Timestamp = firebase.firestore.Timestamp;

console.log('FIREBASE USE EMULATORS ', import.meta.env.VITE_FIREBASE_USE_EMULATORS);

// Local emulator
if (location.hostname === 'localhost' && import.meta.env.VITE_FIREBASE_USE_EMULATORS == 'true') {
  firestore.useEmulator('localhost', 8080);
  functions.useEmulator('localhost', 5001);
  auth.useEmulator('http://localhost:9099');
  storage.useEmulator('localhost', 9199);
  database.useEmulator('localhost', 9000);
} else {
  // App check
  if (import.meta.env.VITE_RECAPTCHA_TOKEN) {
    firebase.appCheck().activate(import.meta.env.VITE_RECAPTCHA_TOKEN);
  }
}

export { firestore, auth, functions, storage, database, Timestamp };
export default firebase;
