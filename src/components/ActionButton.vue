<template>
  <button
    class="govuk-button govuk-button--secondary jac-actionbutton"
    :class="computedClasses"
    :disabled="isLoading"
    v-on="listeners"
  >
    <span
      v-if="isLoading"
      class="spinner spinner-border spinner-border-sm"
    />
    <slot
      v-else-if="isSuccess"
      name="success"
    >
      Success!
    </slot>
    <slot
      v-else-if="hasError"
      name="error"
    >
      Error!
    </slot>
    <span
      v-if="!(isSuccess || hasError)"
      :class="{ loading: isLoading }"
    >
      <slot>Submit</slot>
    </span>
  </button>
</template>
<script>
export default {
  inheritAttrs: false,
  props: {
    timeout: {
      type: Number,
      default: 2000,
    },
  },
  data: () => ({
    isLoading: false,
    hasError: false,
    isSuccess: false,
  }),
  computed: {
    listeners() {
      return {
        ...this.$listeners,
        click: this.handleClick,
      };
    },
    computedClasses() {
      return {
        'jac-actionbutton--warning': this.hasError,
        'jac-actionbutton--success': this.isSuccess,
        'jac-actionbutton--loading': this.isLoading,
      };
    },
  },
  methods: {
    async handleClick(e) {
      try {
        this.isLoading = true;

        await this.$listeners.click(e);

        this.resetDelayed('isSuccess');
      } catch (error) {
        this.resetDelayed('hasError');
      } finally {
        this.isLoading = false;
      }
    },
    resetDelayed(property) {
      this[property] = true;
      setTimeout(() => {
        this[property] = false;
      }, this.timeout);
    },
  },
};
</script>

<style scoped>
.spinner {
  position: absolute;
  right: 50%;
}
.loading {
  visibility: hidden;
}
</style>
