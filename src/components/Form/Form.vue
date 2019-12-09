<template>
  <div />
</template>

<script>
export default {
  data() {
    return {
      errorObject: {},
      errors: [],
    };
  },
  mounted: function () {
    this.$root.$on('handle-error', this.handleError);
  },
  beforeDestroy: function() {
    this.$root.$off('handle-error', this.handleError);
  },
  methods: {
    async validate() {
      this.$root.$emit('validate');
    },
    handleError(payload) {
      this.errorObject[payload.id] = payload.message;
      this.errors = []; // re-populate errors
      for (const item in this.errorObject) {
        if (this.errorObject[item]) {
          this.errors.push({ id: item, message: this.errorObject[item] });
        }
      }
    },
    isValid() {
      return this.errors.length === 0;
    },
  },
};
</script>
