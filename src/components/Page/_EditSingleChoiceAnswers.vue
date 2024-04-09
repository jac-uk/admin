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
      :value="answer.id"
      type="radio"
      class="govuk-radios__input"
    >
    <label
      :for="`${id}-answer-${index}`"
      class="govuk-label govuk-radios__label"
      :data-welsh="getDataWelsh(answer.answer)"
    >
      {{ $filters.lookup(answer.answer) }}
    </label>
  </div>
</template>

<script>
import { getDataWelsh } from '@/helpers/language';

export default {
  name: 'EditSingleChoiceAnswers',
  props: {
    id: {
      type: [String, Number],
      required: true,
    },
    answers: {
      required: true,
      type: Array,
    },
    modelValue: {
      type: String,
      default: null,
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
