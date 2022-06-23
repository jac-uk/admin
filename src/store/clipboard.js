import firebase from 'firebase/app';

const toJACString = (data) => {
  return `JAC_ENV=${data.environment}&&JAC_TYPE=${data.type}&&JAC_TITLE=${data.title}&&JAC_CONTENT=${JSON.stringify(data.content)}`;
};

const fromJACString = (JACString) => {
  const parts = JACString.split('&&');
  const data = {};
  parts.forEach(part => {
    if (part.indexOf('JAC_ENV=') >= 0) {
      data.environment = part.substring(8);
    }
    if (part.indexOf('JAC_TYPE=') >= 0) {
      data.type = part.substring(9);
    }
    if (part.indexOf('JAC_TITLE=') >= 0) {
      data.title = part.substring(10);
    }
    if (part.indexOf('JAC_CONTENT=') >= 0) {
      data.content = JSON.parse(part.substring(12), (key, value) => {
        if (value && typeof value === 'object' && typeof value.seconds === 'number' && typeof value.nanoseconds === 'number') {
          value = new firebase.firestore.Timestamp(value.seconds, value.nanoseconds);
        }
        return value;
      });
    }
  });
  return data;
};

const module = {
  namespaced: true,
  state: {
    data: {},
    hasData: false,
  },
  mutations: {
    setData (state, data) {
      state.data.environment = data.environment || '';
      state.data.type = data.type || '';
      state.data.title = data.title || '';
      state.data.content = data.content || '';
      state.hasData = !!data.type;
    },
  },
  actions: {
    async read ({ commit }) {
      if (navigator && navigator.clipboard && navigator.clipboard.readText && document.hasFocus()) {
        const clipboardText = await navigator.clipboard.readText();
        if (clipboardText) {
          if (clipboardText.indexOf('JAC_CONTENT') >= 0) {
            commit('setData', fromJACString(clipboardText));
          } else {
            commit('setData', {});
          }
        } else {
          commit('setData', {});
        }
      }
    },
    async write ({ commit }, data) {
      if (navigator && navigator.clipboard) {
        await navigator.clipboard.writeText(toJACString(data));
        commit('setData', data);
      }
    },
    async empty ({ commit }) {
      if (navigator && navigator.clipboard) {
        await navigator.clipboard.writeText('');
        commit('setData', {});
      }
    },
  },
};

export default module;
