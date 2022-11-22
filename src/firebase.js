import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/functions';
import 'firebase/database';
import 'firebase/app-check';

// Configure and initialise Firebase
// Config variables are pulled from the environment at build time
const config = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.VUE_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_FIREBASE_APP_ID,
};
const functions = firebase.initializeApp(config).functions('europe-west2');
const firestore = firebase.firestore();
const auth = firebase.auth();
const database = firebase.database();
const Timestamp = firebase.firestore.Timestamp;

// Local emulator
if (location.hostname === 'localhost' && process.env.VUE_APP_FIREBASE_USE_EMULATORS == 'true') {
  firestore.useEmulator('localhost', 8080);
  functions.useEmulator('localhost', 5001);
  auth.useEmulator('http://localhost:9099');
  database.useEmulator('localhost', 9000);
}
// App check
if (process.env.VUE_APP_RECAPTCHA_TOKEN) {
  firebase.appCheck().activate(process.env.VUE_APP_RECAPTCHA_TOKEN);
}

export { firestore, auth, functions, database, Timestamp };
export default firebase;
