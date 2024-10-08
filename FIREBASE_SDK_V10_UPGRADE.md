# FIREBASE_SDK_V10_UPGRADE

## Dependencies Requirements
- @jac-uk/jac-kit 4.x: Helper functions and vue components with firebase modular APIs.

## Firebase SDK v10 Modular APIs reference
- https://firebase.google.com/docs/reference/js

## Initialization of firebase and related services changes (src/firebase.js)
- Old APIs (firebase sdk v8)
```
// Deprecated Namespace API
const functions = firebase.initializeApp(config).functions('europe-west2');
const firestore = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
const database = firebase.database();
const Timestamp = firebase.firestore.Timestamp;
...
```
- Latest modular APIs (firebase sdk v10)
```
const app = initializeApp(config);
const functions = getFunctions(app, 'europe-west2');
const firestore = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
const database = getDatabase(app);
...
```
## Firestore operation APIs changes
### Add, Update, Delete Document
- Old APIs (firebase sdk v8)
```
import { firestore } from '@/firebase';

const collection = firestore.collection('candidates');
const ref = collection.doc(id);

await collection.add(data);
await ref.update(data);
await ref.delete();
```
- Latest modular APIs (firebase sdk v10)
```
import { collection, doc, addDoc, updateDoc, deleteDoc } from '@firebase/firestore';
import { firestore } from '@/firebase';

const collectionRef = collection(firestore, 'candidates');
const ref = doc(collectionRef, id);

await addDoc(collectionRef, data);
await updateDoc(ref, data);
await deleteDoc(ref);
```
### Query Builder
- Old APIs (firebase sdk v8)
```
import { firestore } from '@/firebase';

const collection = firestore.collection('candidates');
let query = collection.where('computed.search', 'array-contains', searchTerm.toLowerCase());
const snap = await query.limit(10).get();
```
- Latest modular APIs (firebase sdk v10)
Use query(), where(), limit() functions to build query, instead of methods of collection instance.
Use GetDocs() to get snapshot.
```
import { query, doc, getDocs, limit, collection, setDoc, where } from '@firebase/firestore';
import { firestore } from '@/firebase';

const collectionRef = collection(firestore, 'candidates');
let queryRef = query(collectionRef, where('computed.search', 'array-contains', searchTerm.toLowerCase()));
const snap = await getDocs(query(queryRef, limit(10)));
```
### Batch writes
- Old APIs (firebase sdk v8)
```
  const batch = firestore.batch();
  applicationIds.forEach(applicationId => {
    const ref = firestore.collection('applicationRecords').doc(applicationId);
    const data = {};
    data[`panelIds.${panelType}`] = '';
    batch.update(ref, data);
  });
  await batch.commit();
```
- Latest modular APIs (firebase sdk v10)
```
const batch = writeBatch(firestore);
applicationIds.forEach(applicationId => {
  const ref = doc(collection(firestore, 'applicationRecords'), applicationId);
  const data = {};
  data[`panelIds.${panelType}`] = '';
  batch.update(ref, data);
});
await batch.commit();
```
### Snapshot listener
- Old APIs (firebase sdk v8)
```
import { firestore, functions } from '@/firebase';

this.unsubscribe = firestore.doc(`exercises/${this.exercise.id}/reports/agency`)
.onSnapshot((snap) => {
  if (snap.exists) {
    this.report = vuexfireSerialize(snap);
  }
});
```
- Latest modular APIs (firebase sdk v10)
```
import { onSnapshot, doc } from '@firebase/firestore';
import { firestore, functions } from '@/firebase';

this.unsubscribe = onSnapshot(
  doc(firestore,`exercises/${this.exercise.id}/reports/agency`),
  (snap) => {
    if (snap.exists) {
      this.report = vuexfireSerialize(snap);
    }
  });
```
## Firebase function calls changes
- Old APIs (firebase sdk v8)
```
import { functions } from '@/firebase';
const response = await functions.httpsCallable('sendCandidateFormNotifications')(payload);
```
- Latest modular APIs (firebase sdk v10)
```
import { httpsCallable } from '@firebase/functions';
import { functions } from '@/firebase';
const response = await httpsCallable(functions, 'sendCandidateFormNotifications')(payload);
```
