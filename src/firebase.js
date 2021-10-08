import firebase from 'firebase';
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

// Initialise Firestore
const firestore = firebase.firestore();

// Other firebase exports
const auth = firebase.auth;
const appCheck = firebase.appCheck();
if (process.env.VUE_APP_RECAPTCHA_TOKEN) {
  appCheck.activate(process.env.VUE_APP_RECAPTCHA_TOKEN);
}

export { firestore, auth, functions, appCheck };
export default firebase;
