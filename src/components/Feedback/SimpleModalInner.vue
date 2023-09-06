<template>
  <div>
    <div class="modal__title govuk-!-padding-2 govuk-heading-m">
      {{ title }}
    </div>
    <p
      v-if="message"
      class="modal__message govuk-body-l govuk-!-padding-4"
    >
      {{ message }}
    </p>
    <div class="modal__content govuk-!-margin-6">
      <div class="govuk-grid-row">
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SimpleModalInner',
  props: {
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      default: '',
    },
  },
};
</script>

<style lang="css" scoped>
.modal  {
  text-align: left !important;
}
.modal__content  {
  text-align: left !important;
}
.modal__title {
  text-align: left;
  vertical-align: middle;
  border: solid 2px #1d70b8;
  background-color: #1d70b8;
  color: white;
}
.modal__message {
  vertical-align: middle;
}
.deny {
  background-color: #f3f2f1;
}
</style>
