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
        :config="config"
      />
    </div>
  </div>
</template>

<script>
import EditMultipleChoiceAnswers from './_EditMultipleChoiceAnswers.vue';
import { cloneDeep } from 'lodash';

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
      type: [Array, Object],
      required: true,
    },
    config: {
      type: Object,
      required: false,
      default: () => ({}),
    },
    modelValue: {
      type: [Array, Object],
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
        const copyVal = cloneDeep(val);
        if (this.config.groupAnswers && Array.isArray(this.config.answers)) {
          // sort the answers based on the order of the answerIds
          copyVal.sort((a, b) => this.answerIds.indexOf(a) - this.answerIds.indexOf(b));
        }
        this.$emit('update:modelValue', copyVal);
      },
    },
    answerIds() {
      const ids = [];
      if (this.config.groupAnswers && Array.isArray(this.config.answers)) {
        this.config.answers.forEach((group) => {
          if (Array.isArray(group.answers)) {
            group.answers.forEach((answer) => {
              ids.push(answer.id);
            });
          }
        });
      }
      return ids;
    },
  },
};

</script>
