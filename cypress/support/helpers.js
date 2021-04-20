/* eslint-disable func-style */

const firebase = require('firebase-admin');
const Timestamp = firebase.firestore.Timestamp;

module.exports = {
  getDocument,
  getDocuments,
  getDocumentsFromQueries,
  getAllDocuments,  // @TODO consider names used here
  isEmpty,
  applyUpdates,
  checkArguments,
  isDateInPast, // @TODO we want one set of date & exercise helpers (see actions/shared/converters)
  formatDate,
  getDate,
  getRandomString,
};

async function getDocument(query) {
  const doc = await query.get();
  if (doc.exists) {
    const document = doc.data();
    document.id = doc.id;
    document.ref = doc.ref;
    return document;
  }
  return false;
}

async function getDocuments(query) {
  const documents = [];
  const snapshot = await query.get();
  snapshot.forEach((doc) => {
    const document = doc.data();
    document.id = doc.id;
    document.ref = doc.ref;
    documents.push(document);
  });
  return documents;
}

async function getDocumentsFromQueries(queries) {
  const documents = [];
  const querySnapshots = await Promise.all(queries.map(query => query.get()));
  querySnapshots.forEach((snapshot) => {
    snapshot.forEach(doc => {
    const document = doc.data();
    document.id = doc.id;
    document.ref = doc.ref;
    documents.push(document);
    });
  });
  return documents;
}

async function getAllDocuments(db, references) {
  const documents = [];
  if (references.length) {
    const snapshot = await db.getAll(...references);
    snapshot.forEach((doc) => {
      const document = doc.data();
      document.id = doc.id;
      document.ref = doc.ref;
      documents.push(document);
    });
  }
  return documents;
}

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

async function applyUpdates(db, commands) {
  const BATCH_SIZE = 200;
  if (commands.length) {
    if (commands.length < BATCH_SIZE) {
      try {
        const batch = db.batch();
        for (let i = 0, len = commands.length; i < len; ++i) {
          switch (commands[i].command) {
          case 'set':
              batch.set(commands[i].ref, commands[i].data, { merge: true });
            break;
          default:
              batch[commands[i].command](commands[i].ref, commands[i].data);
          }
        }
        await batch.commit();
        return commands.length;
      } catch (error) {
        console.log(error);
        return false;
      }
    } else { // process in batches of 199
      let totalCommandsExecuted = 0;
      const chunkedCommands = chunkArray(commands, BATCH_SIZE - 1);
      for (let i = 0, len = chunkedCommands.length; i < len; ++i) {
        const result = await applyUpdates(db, chunkedCommands[i]);
        if (result) { totalCommandsExecuted += result; }
      }
      return totalCommandsExecuted;
    }
  }
  return false;
}

function chunkArray(arr, size) {
  var myArray = [];
  for (var i = 0; i < arr.length; i += size) {
    myArray.push(arr.slice(i, i + size));
  }
  return myArray;
}

function checkArguments(definitions, data) {
  // check data only contains defined props
  const allowedKeys = Object.keys(definitions);
  const providedKeys = Object.keys(data);
  for (let i = 0, len = providedKeys.length; i < len; ++i) {
    if (allowedKeys.indexOf(providedKeys[i]) < 0) {
      // console.log('data contains non-defined props');
      return false;
    }
  }

  // check data contains required definitions
  const requiredKeys = [];
  for (key in definitions) {
    if (definitions[key].required) { requiredKeys.push(key); }
  }
  for (let i = 0, len = requiredKeys.length; i < len; ++i) {
    if (providedKeys.indexOf(requiredKeys[i]) < 0) {
      // console.log('data does not contain required props');
      return false;
    }
    // check required props have a value
    if (data[requiredKeys[i]].length === 0) {
      return false;
    }
  }
  // @TODO perhaps make this return richer information like `{ isOK: Boolean, message: String }`
  return true;
}

function isDateInPast(date) {
  const dateToCompare = new Date(date);
  const today = new Date();
  return dateToCompare < today;
}

function getDate(value) {
  let returnValue;
  if (value && (value.seconds || value._seconds)) { // convert firestore timestamp to date
    const seconds = value.seconds || value._seconds;
    const nanoseconds = value.nanoseconds || value._nanoseconds;
    returnValue = new Timestamp(seconds, nanoseconds);
    returnValue = returnValue.toDate();
  } else if (value && !isNaN(new Date(value).valueOf())) {
    returnValue = new Date(value);
  } else {
    returnValue = new Date(); // NOTE: returns today's date by default
  }
  return returnValue;
}

function toDateString(date) {
  return new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
    .toISOString()
    .split('T')[0];
}

function formatDate(value) {
  if (value && (value.seconds !== undefined || value._seconds !== undefined)) { // convert firestore timestamp to date
    const seconds = value.seconds || value._seconds;
    const nanoseconds = value.nanoseconds || value._nanoseconds;
    value = new Timestamp(seconds, nanoseconds);
    value = value.toDate();
  }
  if (!isNaN(new Date(value).valueOf()) && value !== null) {
    if (!(value instanceof Date)) {
      value = new Date(value);
    }
    value = toDateString(value);
  }
  return value ? value : '';
}

function getRandomString(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const result = [];
  for (let i = 0; i < length; i++) {
    result.push(chars.charAt(Math.floor(Math.random() * chars.length)));
  }
  return result.join('');
}
