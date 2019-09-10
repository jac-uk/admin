import firebase from '@/firebase';
const Timestamp = firebase.firestore.Timestamp;

const reviver = (key, value) => {
  // Convert serialized Timestamp objects to Date objects
  if (value && typeof value == 'object' && typeof value.seconds == 'number' && typeof value.nanoseconds == 'number') {
    value = new Timestamp(value.seconds, value.nanoseconds).toDate();
  }
  return value;
};

const convertFirestoreTimestampsToDates = (data) => {
  // Return non-object values untouched
  if (typeof data !== 'object' || data === null) return data;

  const json = JSON.stringify(data);
  return JSON.parse(json, reviver);
};

export default convertFirestoreTimestampsToDates;
