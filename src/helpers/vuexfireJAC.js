// customised Vuexfire firestoreAction to support Vuex 4
// ref: https://github.com/vuejs/vuefire/blob/v2/packages/vuexfire/src/firestore.ts
import { onSnapshot } from '@firebase/firestore';
const firestoreAction = (action) => {
  return function (context, payload) {
    const { state, commit } = context;

    const getUnsubscribeName = (name) => {
      return `unsubscribe${name[0].toUpperCase()}${name.slice(1)}`;
    };

    const unbindFirestoreRef = (name) => {
      const unsubscribe = state[getUnsubscribeName(name)];
      unsubscribe && unsubscribe();
    };

    const bindFirestoreRef = (name, ref, options) => {
      // unbind if ref is already bound
      unbindFirestoreRef(name);

      return new Promise((resolve) => {
        let unsubscribe = null;
        if (ref.type === 'query' || ref.type === 'collection') {
          // bind collection
          unsubscribe = onSnapshot(ref, (snapshot) => {
            const records = [];
            snapshot.forEach(doc => {
              const data = options && options.serialize ? options.serialize(doc) : doc.data();
              records.push(data);
            });
            commit('set', { name, value: records });
            resolve(records);
          });

          // unsubscribe = ref.onSnapshot(ref => {
          //   const records = [];
          //   ref.forEach(doc => {
          //     const data = options && options.serialize ? options.serialize(doc) : doc.data();
          //     records.push(data);
          //   });
          //   commit('set', { name, value: records });
          //   resolve(records);
          // });
        } else {
          // bind document
          unsubscribe = onSnapshot(ref, (snap) => {
            let record = null;
            if (snap.exists()) {
              record = options && options.serialize ? options.serialize(snap) : snap.data();
              commit('set', { name, value: record });
            }
            resolve(record);
          });

          // unsubscribe = ref.onSnapshot(snap => {
          //   let record = null;
          //   if (snap.exists) {
          //     record = options && options.serialize ? options.serialize(snap) : snap.data();
          //     commit('set', { name, value: record });
          //   }
          //   resolve(record);
          // });
        }
        commit('set', { name: getUnsubscribeName(name), value: unsubscribe });
      });
    };

    return action.call(this, { ...context, bindFirestoreRef, unbindFirestoreRef }, payload);
  };
};

export { firestoreAction };
