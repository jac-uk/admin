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
  console.log('btnNext called, go to loading');
  this.$router.push({
    name: 'exercise-task-loading',
    params: this.$route.params,
  });
}

function getExpectedRouteName(type) {
  if (!store.state.tasks.loaded) return 'exercise-task-loading';
  const task = store.getters['tasks/getTask'](type);
  if (task && task.status) {
    return `exercise-task-${task.status}`;
  } else {
    return 'exercise-task-new';
  }
}
