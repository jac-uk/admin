import { firestore } from '@/firebase';
import firebase from '@firebase/app';
import { firestoreAction } from '@xquick-code/vuexfire';
import vuexfireSerialize from '@jac-uk/jac-kit/helpers/vuexfireSerialize';

'use strict';

const collection = firestore.collection('messages');

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
        let firestoreRef = collection;
        for (const param of params) {
          const field = param[0];
          const operator = param[1];
          const val = param[2];
          firestoreRef = firestoreRef.where(field, operator, val);
        }
        firestoreRef = firestoreRef.orderBy('createdAt');
        if (limit) {
          firestoreRef = firestoreRef.limit(limit);
        }
        return bindFirestoreRef('records', firestoreRef, { serialize: vuexfireSerialize });
      }),
      unbind: firestoreAction(({ unbindFirestoreRef }) => {
        return unbindFirestoreRef('records');
      }),
      save: async (context, { data, id }) => {
        const isUpdate = id ? true : false;
        if (isUpdate) {
          data.lastUpdatedAt = firebase.firestore.FieldValue.serverTimestamp();
          data.lastUpdatedBy = {
            userId: context.rootState.auth.currentUser.uid,
            displayName: context.rootState.auth.currentUser.displayName,
          };
          if (data.status) {
            const status = data.status;

            // Make an entry in the statusLog
            data[`statusLog.${status}`] = firebase.firestore.FieldValue.serverTimestamp();
          }
        } else {
          data.createdAt = firebase.firestore.FieldValue.serverTimestamp();
          data.createdBy = {
            userId: context.rootState.auth.currentUser.uid,
            displayName: context.rootState.auth.currentUser.displayName,
          };
          if (data.status) {
            const status = data.status;

            // Make an entry in the statusLog
            data.statusLog = {
              [status]: firebase.firestore.FieldValue.serverTimestamp(),
            };
          }
        }

        if (isUpdate) {
          await collection.doc(id).update(data);
        } else {
          await collection.add(data);
        }
      },
      delete: async (context, { id }) => {
        const ref = collection.doc(id);
        await ref.delete();
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
      return {};
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
