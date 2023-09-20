import { firestore } from '@/firebase';

const collection = firestore.collection('userInvitations');

export default {
  namespaced: true,
  actions: {
    get: async (_, { email, status }) => {
      try {
        const snap = await collection
          .where('email', '==', email)
          .where('status', '==', status)
          .limit(1)
          .get();
        let result = null;
        snap.forEach(doc => {
          result = {
            id: doc.id,
            ...doc.data(),
          };
        });
        return result;
      } catch (error) {
        return null;
      }
    },
    create: async (_, data) => {
      return await collection.add(data);
    },
    save: async (_, { id, data }) => {
      const ref = collection.doc(id);
      await ref.set(data, { merge: true });
    },
  },
  mutations: {},
  state: {},
  getters: {},
};
