import PERMISSIONS from '@/permissions';

const permissionMixin = {
  data() {
    return {
      PERMISSIONS,
    };
  },
  computed: {
    rawPermissions() {
      const rawPermissions = {};
      for (const group of Object.keys(this.PERMISSIONS)) {
        for (const p of Object.keys(this.PERMISSIONS[group].permissions)) {
          rawPermissions[p] = false;
        }
      }
      return rawPermissions;
    },
  },
  methods: {
    hasPermissions(permissions) {
      return this.$store.getters['auth/hasPermissions'](permissions);
    },
  },
};

export default permissionMixin;
