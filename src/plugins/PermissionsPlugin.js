import store from '@/store';

export default {
  install(Vue) {
    Vue.prototype.$hasPermission = (request, testStore) => {
      const permissions = testStore ? testStore.state.auth.currentUser.permissions : store.state.auth.currentUser.permissions;
      if (!permissions) {
        return false;
      }
      if (Array.isArray(request)) {
        let result = false;
        request.forEach(p => {
          if (permissions.includes(p)) {
           result = true;
          }
        });
        return result;
      }
      return permissions.includes(request);
    };
  },
};

