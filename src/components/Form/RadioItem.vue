<template>
  <div class="govuk-radios__item-container">
    <div class="govuk-radios__item">
      <input
        :id="inputId"
        v-model="$parent.inputValue"
        class="govuk-radios__input"
        type="radio"
        :name="inputName"
        :value="value"
        :aria-describedby="hint ? hintId : false"
      >
      <label
        class="govuk-label govuk-radios__label"
        :for="inputId"
      >
        {{ label }}
      </label>
      <span
        v-if="hint"
        :id="hintId"
        class="govuk-hint govuk-radios__hint"
      >
        {{ hint }}
      </span>
    </div>
    <div
      v-if="showConditionalContent"
      id="conditional-how-contacted-conditional"
      class="govuk-radios__conditional"
    >
      <slot />
    </div>
  </div>
</template>

<script>
let index = 0;

export default {
  name: 'RadioItem',
  props: {
    label: {
      required: true,
      type: String,
    },
    value: {
      required: true,
      type: String, // Could also be boolean, number, null, undefined...
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
    inputType() {
      return this.$parent.inputType;
    },
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
      return this.hasConditionalContent && (this.$parent.inputValue === this.value);
    },
  },
  created() {
    if (this.$parent.$options.name !== 'Radios') {
      throw new Error('RadioItem component can only be used inside a Radios component');
    }
    index++;
  },
};
</script>

<style scoped lang="scss">
  // We need to wrap both the input & conditional content in one top-level element
  // This is because Vue doesn't (yet) support components with multiple top-level elements (e.g. React Fragments)
  // This results in our markup structure differing slightly from the officially documented markup for this component
  // The fix is to re-implement the margin-bottom on radio items here
  .govuk-radios__item-container {
    margin-bottom: govuk-spacing(2);
  }
</style>
