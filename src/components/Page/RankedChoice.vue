<template>
  <div>
    <div
      v-if="config.groupAnswers"
    >
      <div
        v-for="(item, itemIndex) in answers"
        :key="itemIndex"
      >
        <span class="govuk-heading-s govuk-!-margin-bottom-2 govuk-!-margin-top-4">{{ item.group }}</span>
        <EditRankedAnswers
          :id="`${id}-group-${itemIndex}`"
          v-model="localVModel"
          :answers="item.answers"
          :config="item"
        />
      </div>
    </div>
    <div
      v-else
      class="govuk-checkboxes"
    >
      <EditRankedAnswers
        :id="id"
        v-model="localVModel"
        :answers="answers"
        :config="config"
      />
    </div>
  </div>
</template>

<script>
import EditRankedAnswers from './_EditRankedChoiceAnswers.vue';

export default {
  compatConfig: {
    COMPONENT_V_MODEL: false,
    // or, for full vue 3 compat in this component:
    //MODE: 3,
  },
  name: 'RankedChoice',
  components: {
    EditRankedAnswers,
  },
  props: {
    id: {
      type: [String, Number],
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
      type: Object,
      default: function () {
        return new Object();
      },
    },
  },
  emits: ['update:modelValue'],
  data() {
    return {
      selected: [],
      ranking: {},
    };
  },
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
};

</script>
