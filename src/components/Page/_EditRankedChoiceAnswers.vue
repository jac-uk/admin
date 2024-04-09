<template>
  <div
    v-for="(answer, index) in answers"
    :key="index"
    class="govuk-checkboxes__item"
  >
    <input
      :id="`${id}-answer-${index}`"
      v-model="selected"
      :name="`${id}-answer-${index}`"
      :value="answer.id"
      type="checkbox"
      class="govuk-checkboxes__input"
      @change="changeSelection"
    >
    <label
      :for="`${id}-answer-${index}`"
      class="govuk-label govuk-checkboxes__label"
      :data-welsh="getDataWelsh(answer.answer)"
    >
      {{ $filters.lookup(answer.answer) }}
    </label>
    <select
      v-if="selected.indexOf(answer.id) >= 0"
      :id="`${id}-rank-${index}`"
      v-model="localVModel[answer.id]"
      class="govuk-select"
      @change="changeRanking(answer.id, $event)"
    >
      <option
        v-for="score in numSelected"
        :key="score"
        :value="score"
      >
        {{ score }}
      </option>
    </select>
  </div>
</template>

<script>
import { getDataWelsh } from '@/helpers/language';
import { deleteField } from 'firebase/firestore';

export default {
  name: 'EditRankedChoiceAnswers',
  props: {
    id: {
      type: [String, Number],
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
      type: Object,
      default: function () {
        return new Object();
      },
    },
  },
  emits: ['update:modelValue'],
  data() {
    const selected = this.modelValue ? Object.keys(this.modelValue) : [];
    return {
      selected: selected.length ? selected : [],
    };
  },
  computed: {
    localVModel: {
      get() {
        return this.modelValue || {};
      },
      set(val) {
        this.$emit('update:modelValue', val);
      },
    },
    numSelected() {
      return Object.keys(this.localVModel).length;
    },
  },
  methods: {
    getDataWelsh(answer) {
      return getDataWelsh({ id: this.id, answer });
    },
    changeSelection(event) {
      if (event.target.checked) {
        if (Object.keys(this.localVModel).length === 0) {
          this.localVModel[event.target.value] = 1;
          this.$emit('update:modelValue', this.localVModel);
        } else {
          const max = Math.max(...Object.values(this.localVModel));
          this.localVModel[event.target.value] = max + 1;
        }
      } else {
        // remove un-selected
        this.localVModel[event.target.value] = deleteField();
        this.$emit('update:modelValue', this.localVModel);

        if (this.config.allowEqualRanking) {
          // reduce any ranks above the maximum rank. Leave the others alone.
          const maxRank = this.numSelected;
          Object.entries(this.localVModel).forEach(([key, value]) => {
            // exclude the one we just removed
            if (value?._methodName !== 'deleteField' && value > maxRank) this.localVModel[key] = maxRank;
          });
        } else {
          // ensure we have distinct ranks up to the maximum
          Object.entries(this.localVModel)
            .map(([key, value]) => { return { key: key, value: value }; })
            .filter(item => item.value?._methodName !== 'deleteField') // exclude the one we just removed
            .sort(( item1, item2 ) => {
              if (item1.value < item2.value) {
                return -1;
              } else if (item1.value > item2.value) {
                return 1;
              } else {
                return 0;
              }
            })
            .forEach((item, index) => this.localVModel[item.key] = index + 1);
        }
      }
    },
    changeRanking(ident, event) {
      if (!this.config.allowEqualRanking) {
        const newRank = event.target.value;

        // work out previous value (it will be missing from data set)
        const ranks = Object.values(this.localVModel);
        const missingRanks = [];
        for (let i = 1, len = ranks.length; i <= len; ++i) {
          if (ranks.indexOf(i) == -1) missingRanks.push(i);
        }
        const previousRank = missingRanks[0];

        // if old value > new value then increase rank of all items between new value and old value
        // if old value < new value then decrease rank of all items between old value and new value
        let startRank = 0;
        let endRank = 0;
        let change = 0;
        if (previousRank > newRank) {
          startRank = newRank;
          endRank = previousRank;
          change = 1;
        }
        if (previousRank < newRank) {
          startRank = previousRank;
          endRank = newRank;
          change = -1;
        }
        Object.entries(this.localVModel).forEach(([key, value]) => {
          if (key !== ident) {
            if (value >= startRank && value <= endRank) this.localVModel[key] = value + change;
          }
        });
      }
    },
  },
};
</script>
