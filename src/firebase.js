import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/functions';

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
firebase.initializeApp(config);

// Initialise Firestore
const firestore = firebase.firestore();

// Other firebase exports
const auth = firebase.auth;
const functions = firebase.functions;
const Timestamp = firebase.firestore.Timestamp;

export {firestore, auth, functions, Timestamp};
export default firebase;
