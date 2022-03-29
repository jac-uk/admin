const { qtFirestore, firestore } = require('../firebase');

/**
 * Copies an document to the QT firestore
 */
const copyToQTFirestore = async (collectionPath, id) => {

  // load the document from the main firestore
  const doc = await firestore.collection(collectionPath).doc(id).get();

  // save the document to the QT firestore
  // 1. get all data fields, which is all of the Document object's properties from:
  //   - id - this is the document ID in the Firestore
  //   - ref - this is the DocumentReference object
  const data = doc.data();
  delete data.id;
  delete data.ref;
  // 2. now save the document to the QT firestore
  qtFirestore.collection(collectionPath).doc(id).set(data);

};

export default copyToQTFirestore;
