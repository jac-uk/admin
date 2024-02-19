<template>
  <div class="govuk-radios">
    <div
      v-if="config.groupAnswers"
    >
      <div
        v-for="(item, itemIndex) in answers"
        :key="itemIndex"
      >
        <span class="govuk-heading-s govuk-!-margin-bottom-2 govuk-!-margin-top-4">{{ item.group }}</span>
        <EditSingleChoiceAnswers
          :id="`${id}-${itemIndex}`"
          v-model="selected"
          :answers="item.answers"
        />
      </div>
    </div>
    <div v-else>
      <EditSingleChoiceAnswers
        :id="id"
        v-model="selected"
        :answers="answers"
      />
    </div>
  </div>
</template>

<script>
import EditSingleChoiceAnswers from './_EditSingleChoiceAnswers.vue';

export default {
  compatConfig: {
    COMPONENT_V_MODEL: false,
    // or, for full vue 3 compat in this component:
    //MODE: 3,
  },
  name: 'SingleChoice',
  components: {
    EditSingleChoiceAnswers,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
    answers: {
      type: Array,
      required: true,
    },
    config: {
      type: Object,
      required: false,
      default: () => ({}),
    },
    modelValue: {
      type: String,
      default: null,
    },
  },
  emits: ['update:modelValue'],
  computed: {
    selected: {
      get() {
        return this.modelValue;
      },
      set(val) {
        this.$emit('update:modelValue', val);
      },
    },
  },
};

</script>
