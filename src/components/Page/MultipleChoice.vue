<template>
  <div class="govuk-checkboxes">
    <div
      v-if="config.groupAnswers"
    >
      <div
        v-for="(item, itemIndex) in answers"
        :key="itemIndex"
      >
        <span class="govuk-heading-s govuk-!-margin-bottom-2 govuk-!-margin-top-4">{{ item.group }}</span>
        <EditMultipleChoiceAnswers
          :id="`${id}-${itemIndex}`"
          v-model="selected"
          :answers="item.answers"
          :config="item"
        />
      </div>
    </div>
    <div v-else>
      <EditMultipleChoiceAnswers
        :id="id"
        v-model="selected"
        :answers="answers"
      />
    </div>
  </div>
</template>

<script>
import EditMultipleChoiceAnswers from './_EditMultipleChoiceAnswers.vue';

export default {
  compatConfig: {
    COMPONENT_V_MODEL: false,
    // or, for full vue 3 compat in this component:
    //MODE: 3,
  },
  name: 'MultipleChoice',
  components: {
    EditMultipleChoiceAnswers,
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
      type: Array,
      default: function () {
        return new Array();
      },
    },
  },
  emits: ['update:modelValue'],
  computed: {
    selected: {
      get() {
        return this.modelValue ? this.modelValue : [];
      },
      set(val) {
        this.$emit('update:modelValue', val);
      },
    },
  },
};

</script>
