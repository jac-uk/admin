<template>
  <div
    v-for="(answer, index) in answers"
    :key="index"
    class="govuk-radios__item"
  >
    <input
      :id="`${id}-answer-${index}`"
      v-model="localVModel"
      :name="`${id}-answer-${index}`"
      :value="answer.answer"
      type="checkbox"
      class="govuk-checkboxes__input"
    >
    <label
      :for="`${id}-answer-${index}`"
      class="govuk-label govuk-checkboxes__label"
      :data-welsh="getDataWelsh(answer.answer)"
    >
      {{ $filters.lookup(answer.answer) }}
    </label>
  </div>
</template>

<script>
import { getDataWelsh } from '@/helpers/language';

export default {
  name: 'EditMultipleChoiceAnswers',
  props: {
    id: {
      type: String,
      required: true,
    },
    answers: {
      required: true,
      type: Array,
    },
    config: {
      type: Object,
      required: false,
      default: () => ({}),
    },
    modelValue: {
      type: Array,
      default: function () { 
        return new Array(); 
      },
    },
  },
  emits: ['update:modelValue'],
  computed: {
    localVModel: {
      get() {  
        return this.modelValue;
      },
      set(val) {
        this.$emit('update:modelValue', val);
      },
    },
  },
  methods: {
    getDataWelsh(answer) {
      return getDataWelsh({ id: this.id, answer });
    },
  },
};
</script>
