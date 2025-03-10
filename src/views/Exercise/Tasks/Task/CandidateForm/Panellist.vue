<template>
  <div class="panellist-form">
    <TextField
      :id="`panellist_${index}`"
      v-model="row.name"
      input-class="govuk-input--width-20"
      label=""
      class="panellist"
      required
    />
    <slot name="removeButton" />
  </div>
</template>

<script>
import TextField from '@jac-uk/jac-kit/draftComponents/Form/TextField.vue';
import { getRandomString } from '@/helpers/helpers';

export default {
  name: 'Panellist',
  components: {
    TextField,
  },
  props: {
    row: {
      required: true,
      type: Object,
    },
    index: {
      required: true,
      type: Number,
    },
    id: {
      required: false,
      type: String,
      default: '',
    },
  },
  created() {
    if (!this.row.hasOwnProperty('id')) this.row.id = getRandomString(3);
  },
};
</script>

<style lang="scss">
.panellist-form {
  .jac-add-another__remove-button {
    position: relative !important;
    vertical-align: bottom !important;
    margin-bottom: 32px !important;
    margin-left: 20px !important;
  }
  .govuk-form-group {
    display: inline-block;
  }
  .panellist > label {
    font-size: 19px;
    margin-bottom: 5px !important;
    font-weight: normal;
  }
}
</style>
