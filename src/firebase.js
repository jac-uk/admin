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
const functions = firebase.initializeApp(config).functions('europe-west2');

if (process.env.VUE_APP_USE_FUNCTIONS_EMULATOR === 'true') {
  functions.useFunctionsEmulator('http://localhost:5001');
}

// Initialise Firestore
const firestore = firebase.firestore();

// Other firebase exports
const auth = firebase.auth;

// Initialise QT Firestore
const qtApp = firebase.initializeApp({
  appId: process.env.VUE_APP_FIREBASE_APP_ID,     // NOT the QT admin app
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,   // NOT the QT admin app
  authDomain: process.env.VUE_APP_QT_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.VUE_APP_QT_FIREBASE_DATABASE_URL,
  projectId: process.env.VUE_APP_QT_FIREBASE_PROJECT_ID,
  // storageBucket: process.env.VUE_APP_QT_FIREBASE_STORAGE_BUCKET,
  // messagingSenderId: process.env.VUE_APP_QT_FIREBASE_MESSAGING_SENDER_ID,
  // clientID: '331668555200-k1v4oguqklfo0pdvrpdvb47mh1fgvcki.apps.googleusercontent.com',
}, 'qtAdmin');
const qtFirestore = qtApp.firestore();

// Get the authentication service for the QT firestore
const qtAuth = firebase.auth(qtApp);

export { firestore, auth, functions, qtFirestore, qtAuth };
export default firebase;
