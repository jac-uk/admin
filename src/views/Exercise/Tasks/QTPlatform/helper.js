/*eslint func-style: ["error", "declaration"]*/
import store from '@/store.js';

export {
  beforeRouteEnter,
  btnNext,
  getExpectedRouteName
};

function beforeRouteEnter(to, from, next) {
  const expectedRouteName = getExpectedRouteName(to.params.type);
  if (to.name === expectedRouteName) {
    next();
  } else {
    next({
      name: expectedRouteName,
      params: to.params,
    });
  }
}

async function btnNext() {
  this.$router.push({
    name: 'qt-platform-loading',
    params: this.$route.params,
  });
}

function getExpectedRouteName(type) {
  if (!store.state.tasks.loaded) return 'qt-platform-loading';
  const task = store.getters['tasks/getTask'](type);
  if (task && task.status) {
    return `qt-platform-${task.status}`;
  } else {
    return 'qt-platform-new';
  }
}
