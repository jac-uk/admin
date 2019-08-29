<template>
  <div class="govuk-checkboxes__item-container">
    <div class="govuk-checkboxes__item">
      <input
        :id="inputId"
        v-model="$parent.inputValue"
        class="govuk-checkboxes__input"
        type="checkbox"
        :name="inputName"
        :value="value"
        :aria-describedby="hint ? hintId : false"
      >
      <label
        class="govuk-label govuk-checkboxes__label"
        :for="inputId"
      >
        {{ label }}
      </label>
      <span
        v-if="hint"
        :id="hintId"
        class="govuk-hint govuk-checkboxes__hint"
      >
        {{ hint }}
      </span>
    </div>
    <div
      v-if="showConditionalContent"
      class="govuk-checkboxes__conditional"
    >
      <slot />
    </div>
  </div>
</template>

<script>
let index = 0;

export default {
  name: 'CheckboxItem',
  props: {
    label: {
      required: true,
      type: String,
    },
    value: {
      required: true,
      validator: () => true,
    },
    hint: {
      default: '',
      type: String,
    },
  },
  data() {
    return {
      hasConditionalContent: !!(this.$slots.default),
    };
  },
  computed: {
    inputId() {
      return `${this.$parent.id}__${index}`;
    },
    hintId() {
      return `${this.$parent.id}__${index}__hint`;
    },
    inputName() {
      return this.$parent.id;
    },
    showConditionalContent() {
      return this.hasConditionalContent && this.isChecked;
    },
    isChecked() {
      return this.$parent.inputValue.indexOf(this.value) !== -1;
    },
  },
  created() {
    if (this.$parent.$options.name !== 'CheckboxGroup') {
      throw new Error('CheckboxItem component can only be used inside a CheckboxGroup component');
    }
    index++;
  },
};
</script>

<style scoped lang="scss">
  // We need to wrap both the input & conditional content in one top-level element
  // This is because Vue doesn't (yet) support components with multiple top-level elements (e.g. React Fragments)
  // This results in our markup structure differing slightly from the officially documented markup for this component
  // The fix is to re-implement the margin-bottom on checkbox items here
  .govuk-checkboxes__item-container {
    margin-bottom: govuk-spacing(2);
  }
</style>
