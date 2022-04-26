<script>
import PERMISSIONS from '@/permissions';

export default {
  data() {
    return {
      PERMISSIONS,
    };
  },
  methods: {
    hasPermission(permission) {
      return this.$store.getters['auth/hasPermission'](permission);
    },
  },
};
</script>
