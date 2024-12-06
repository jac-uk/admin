import store from '@/store';
import PERMISSIONS from '@/permissions';

/**
 * @param {Array} permissions
 * @returns {Boolean}
 */
const hasPermissions = (permissions) => {
  return store.getters['auth/hasPermissions'](permissions);
};

/**
 * Return a list of all permissions with false values
 * @returns {Object} e.g. { canReadUsers: false, canCreateUsers: false, ... }
 */
const getRawPermissions = () => {
  const rawPermissions = {};
  for (const group of Object.keys(PERMISSIONS)) {
    for (const p of Object.keys(PERMISSIONS[group].permissions)) {
      rawPermissions[p] = false;
    }
  }
  return rawPermissions;
};

export {
  hasPermissions,
  getRawPermissions
};
