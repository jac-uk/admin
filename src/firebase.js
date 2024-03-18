import { initializeApp } from 'firebase/app';
import { connectFirestoreEmulator, getFirestore, Timestamp } from 'firebase/firestore';
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import { connectStorageEmulator, getStorage } from 'firebase/storage';
import { connectDatabaseEmulator, getDatabase } from 'firebase/database';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

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

/**
 * Module API
 * @see https://firebase.google.com/docs/reference/js
 */
const app = initializeApp(config);
const functions = getFunctions(app, 'europe-west2');
const firestore = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
const database = getDatabase(app);

// Deprecated Namespace API
// const functions = firebase.initializeApp(config).functions('europe-west2');
// const firestore = firebase.firestore();
// const auth = firebase.auth();
// const storage = firebase.storage();
// const database = firebase.database();
// const Timestamp = firebase.firestore.Timestamp;

// Local emulator
if (location.hostname === 'localhost' && import.meta.env.VITE_FIREBASE_USE_EMULATORS == 'true') {
  /**
   * Module API
   * @see https://firebase.google.com/docs/emulator-suite/connect_firestore#web-modular-api
   */
  connectFirestoreEmulator(firestore, 'localhost', 8080);
  connectFunctionsEmulator(functions ,'localhost', 5001);
  connectAuthEmulator(auth, 'http://localhost:9099');
  connectStorageEmulator(storage ,'localhost', 9199);
  connectDatabaseEmulator(database ,'localhost', 9000);

  // Deprecated Namespace API
  // firestore.useEmulator('localhost', 8080);
  // functions.useEmulator('localhost', 5001);
  // auth.useEmulator('http://localhost:9099');
  // storage.useEmulator('localhost', 9199);
  // database.useEmulator('localhost', 9000);
} else {
  // App check
  if (import.meta.env.VITE_RECAPTCHA_TOKEN) {
    /**
     * @see https://firebase.google.com/docs/app-check/web/recaptcha-provider#initialize
     */
    initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(import.meta.env.VITE_RECAPTCHA_TOKEN),
    });

    // Deprecated Namespace API
    // firebase.appCheck().activate(import.meta.env.VITE_RECAPTCHA_TOKEN);
  }

}

export { app, firestore, auth, functions, storage, database, Timestamp };
export default app;
