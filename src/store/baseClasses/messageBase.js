import { firestore } from '@/firebase';
import { doc, addDoc, updateDoc, deleteDoc ,collection, query, where, orderBy, limit as firestoreLimit, serverTimestamp } from '@firebase/firestore';
import { firestoreAction } from '@/helpers/vuexfireJAC';
import vuexfireSerialize from '@jac-uk/jac-kit/helpers/vuexfireSerialize';

'use strict';

const collectionName = 'messages';
const collectionRef = collection(firestore, collectionName);

export default class {
  state() {
    return {
      record: null,
      records: [],
    };
  }
  getters() {
    return {};
  }
  actions() {
    return {
      bind: firestoreAction(({ bindFirestoreRef }, { params, limit }) => {
        let queryRef = collectionRef;
        for (const param of params) {
          const field = param[0];
          const operator = param[1];
          const val = param[2];
          queryRef = query(queryRef, where(field, operator, val));
        }
        queryRef = query(queryRef, orderBy('createdAt'));
        if (limit) {
          queryRef = query(queryRef, firestoreLimit(limit));
        }
        return bindFirestoreRef('records', queryRef, { serialize: vuexfireSerialize });
      }),
      unbind: firestoreAction(({ unbindFirestoreRef }) => {
        return unbindFirestoreRef('records');
      }),
      save: async (context, { data, id }) => {
        const isUpdate = id ? true : false;
        if (isUpdate) {
          data.lastUpdatedAt = serverTimestamp();
          data.lastUpdatedBy = {
            userId: context.rootState.auth.currentUser.uid,
            displayName: context.rootState.auth.currentUser.displayName,
          };
          if (data.status) {
            const status = data.status;

            // Make an entry in the statusLog
            data[`statusLog.${status}`] = serverTimestamp();
          }
        } else {
          data.createdAt = serverTimestamp();
          data.createdBy = {
            userId: context.rootState.auth.currentUser.uid,
            displayName: context.rootState.auth.currentUser.displayName,
          };
          if (data.status) {
            const status = data.status;

            // Make an entry in the statusLog
            data.statusLog = {
              [status]: serverTimestamp(),
            };
          }
        }

        if (isUpdate) {
          await updateDoc(doc(firestore, collectionName, id), data);
        } else {
          await addDoc(collection(firestore, collectionName), data);
        }
      },
      delete: async (context, { id }) => {
        const docRef = doc(firestore, collectionName, id);
        await deleteDoc(docRef);
      },
      markAsRead: async (context, id) => {
        await context.dispatch('save', {
          data: {
            status: 'read',
          },
          id: id,
        });
      },
    };
  }
  mutations() {
    return {
      set: (state, { name, value }) => {
        state[name] = value;
      },
    };
  }
  modules() {
      return {};
  }
  getModule() {
    return {
        namespaced: true,
        state: this.state(),
        getters: this.getters(),
        actions: this.actions(),
        mutations: this.mutations(),
        modules: this.modules(),
    };
  }
}
