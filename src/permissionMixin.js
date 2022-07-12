import PERMISSIONS from '@/permissions';

const permissionMixin = {
  data() {
    return {
      PERMISSIONS,
    };
  },
  methods: {
    hasPermissions(permissions) {
      return this.$store.getters['auth/hasPermissions'](permissions);
    },
  },
};

export default permissionMixin;
