/**
 * Here we use Realtime Database to monitor user's connection
 */
import firebase from '@firebase/app';
import 'firebase/database';

export default {
  namespaced: true,
  actions: {
    bind: async (context, params ) => {
      firebase.database()
        .ref(`qualifyingTest/${params.qualifyingTestId}/userStatus/${params.candidateId}`)
        .on('value', snap => {
          const results = snap.val();
          const logList = [];
          Object.keys(results).forEach(log => {
            const result = results[log];
            const resultsReturn = {
              online: result.online,
              offline: result.offline,
              on: new Date(result.online),
              off: new Date(result.offline),
            };
            logList.push(resultsReturn);
          });
          context.commit('setRecords', logList);
        });
    },
  },
  mutations: {
    setRecords(state, records) {
      state.records = records;
    },
  },  
  state: {
    records: [],
  },
};
