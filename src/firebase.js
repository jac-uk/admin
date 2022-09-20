import firebase from 'firebase/app';
import 'firebase/app-check';
import 'firebase/functions';
import 'firebase/firestore';
import 'firebase/auth';

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
  functions.useEmulator('localhost', '5000');
}

// Initialise Firestore
const firestore = firebase.firestore();

// App check
let appCheck;
if (process.env.VUE_APP_RECAPTCHA_TOKEN) {
  appCheck = firebase.appCheck().activate(process.env.VUE_APP_RECAPTCHA_TOKEN);
}

// Other firebase exports
const auth = firebase.auth;

export { firestore, auth, functions, appCheck };
export default firebase;
