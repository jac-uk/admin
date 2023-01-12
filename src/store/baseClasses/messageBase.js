import { firestore } from '@/firebase';
import firebase from '@firebase/app';
import { firestoreAction } from 'vuexfire';
import vuexfireSerialize from '@jac-uk/jac-kit/helpers/vuexfireSerialize';

'use strict';

export default class {
  collection = firestore.collection('messages');
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

        console.log('messageBase/bind');
        console.log('params', params);
        console.log('limit', limit);

        let firestoreRef = this.collection;
        for (const param of params) {
          const field = param[0];
          const operator = param[1];
          const val = param[2];
          firestoreRef = firestoreRef.where(field, operator, val);
        }
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
          await this.collection.doc(id).update(data);
        } else {
          await this.collection.add(data);
        }
      },
      delete: async (context, { id }) => {
        const ref = this.collection.doc(id);
        await ref.delete();
      },
      markAsRead: async (context, id) => {
        await context.dispatch('save', {
          data: {
            status: 'read',
          },
          id: id,
        });
        // await super.actions().save(context, {
        //   data: {
        //     status: 'read',
        //   },
        //   id: id,
        // });
      },
    };
  }
  mutations() {
      return {};
  }
  modules() {
      return {};
  }
  getModule = () => {
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
