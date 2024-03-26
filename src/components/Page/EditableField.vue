<template>
  <div class="editable-field">
    <div
      v-if="!editField"
      class="non-editable"
    >
      <div
        v-if="value == undefined || value == null || value === '' || (Array.isArray(value) && !value.length)"
      >
        <span>
          No information
        </span>
        <span v-if="!isAsked">
          (not asked)
        </span>
      </div>

      <span v-else-if="isEmail">
        <a
          :href="`mailto:${value}`"
          class="govuk-link govuk-link--no-visited-state wrap"
          target="_blank"
        >
          {{ value }}
        </a>
      </span>

      <span v-else-if="isRoute">
        <RouterLink
          :to="{ ...routeTo }"
        >
          {{ value }}
        </RouterLink>
      </span>

      <span
        v-else-if="isText"
        class="wrap"
      >
        {{ value }}
      </span>

      <span
        v-else-if="isTextarea"
        class="wrap"
      >
        {{ value }}
      </span>

      <span
        v-else-if="isDate"
        class="wrap"
      >
        {{ formattedDate }}
      </span>

      <span
        v-else-if="isSelection"
        class="wrap"
      >
        {{ $filters.toYesNo($filters.lookup(value)) }}
      </span>

      <div
        v-else-if="isMultiSelection"
        class="wrap"
      >
        <div
          v-if="(value instanceof Array)"
          class="wrap"
        >
          <li
            v-for="item in value"
            :key="item"
          >
            {{ $filters.toYesNo($filters.lookup(item)) }}
          </li>
        </div>
      </div>

      <div
        v-else-if="isRankedSelection"
        class="wrap"
      >
        <li
          v-for="(item, i) in value"
          :key="item"
        >
          <strong> {{ i + 1 }}: </strong>
          {{ item }}
        </li>
      </div>

      <div
        v-else-if="config"
        class="wrap"
      >
        <template v-if="isRankedChoice">
          <div
            v-if="!config.allowEqualRanking"
          >
            <!-- Render ranked-choice answers without equal ranking -->
            <p
              v-for="(answerIndex, answer) in sortRankedSelection(value)"
              :key="answer"
              class="govuk-body"
            >
              <strong>
                {{ answerIndex }}:
              </strong>
              <span
                v-if="config.groupAnswers"
              >
                {{ findGroupByAnswer(config.answers, answer) + ' - ' }}
              </span>
              {{ answer }}
            </p>
          </div>
          <div
            v-else-if="config.allowEqualRanking"
          >
            <!-- Render ranked-choice answers with equal ranking -->
            <p
              v-for="sortedAnswers in sortEqualRankedSelection(value)"
              :key="sortedAnswers.rank"
              class="govuk-body"
            >
              <strong>
                {{ sortedAnswers.rank }}:
              </strong>
              <span
                v-for="(answer, sortedAnswerIndex) in sortedAnswers.answers"
                :key="answer"
              >
                {{ `${answer}${(sortedAnswerIndex + 1 < sortedAnswers.answers.length) ? ', ' : ''}` }}
              </span>
            </p>
          </div>
        </template>
        <div
          v-else-if="isSingleChoice"
        >
          <!-- Render single-choice answer -->
          {{ value }}
        </div>
        <div
          v-else-if="isMultipleChoice"
        >
          <!-- {{ value }} -->
          <!-- Render multiple-choice answers -->
          <p
            v-for="answer in value"
            :key="answer"
            class="govuk-body"
          >
            <strong v-if="config.groupAnswers">
              {{ findGroupByAnswer(config.answers, answer) + ' - ' }}
            </strong>
            {{ answer }}
          </p>
        </div>
      </div>

      <div
        v-else
        class="wrap"
      >
        {{ value }}
      </div>

      <br>

      <a
        v-if="editMode"
        href="#"
        class="govuk-link change-link print-none"
        @click.prevent="btnClickEdit()"
      >
        {{ link }}
      </a>
    </div>

    <div
      v-if="editField"
      class="edit-field"
    >
      <TextField
        v-if="isEmail"
        :id="`editable-field-${id}`"
        v-model="localField"
        type="email"
      />

      <TextField
        v-if="isPhone"
        :id="`editable-field-${id}`"
        v-model="localField"
        type="tel"
      />

      <TextField
        v-if="isText || isRoute"
        :id="`editable-field-${id}`"
        v-model="localField"
      />

      <TextareaInput
        v-if="isTextarea"
        :id="`editable-field-${id}`"
        v-model="localField"
      />

      <DateInput
        v-if="isDate"
        :id="`data-of-birth-${id}`"
        v-model="localField"
        :type="(displayMonthYearOnly ? 'month' : 'date')"
        :value="localField"
      />

      <Select
        v-if="isSelection"
        :id="`selection-input-${id}`"
        v-model="localField"
      >
        <option
          v-for="option in options"
          :key="option"
          :value="option"
        >
          {{ $filters.lookup($filters.toYesNo(option)) }}
        </option>
      </Select>

      <CheckboxGroup
        v-if="isMultiSelection"
        :id="`multi-selection-input-${id}`"
        v-model="localField"
      >
        <CheckboxItem
          v-for="option in options"
          :key="option"
          :value="option"
          :label="$filters.lookup(option)"
        />
      </CheckboxGroup>

      <div
        v-if="isRankedSelection"
        class="govuk-checkboxes"
      >
        <div
          v-for="(answer, i) in options"
          :key="i"
          class="govuk-checkboxes__item"
        >
          <div
            style="display: inline-flex"
          >
            <input
              v-model="localField"
              :value="answer"
              type="checkbox"
              class="govuk-checkboxes__input"
              @change="updateRanking"
            >
            <label
              :for="`${id}-answer-${i}`"
              class="govuk-label govuk-checkboxes__label"
            >
              {{ answer }}
            </label>

            <Select
              v-if="localField"
              :id="answer"
              v-model="ranking[answer]"
              @input="updateRanking"
            >
              <option
                v-for="(score) in localField.length"
                :key="score"
                :value="score"
              >
                {{ score }}
              </option>
            </Select>
          </div>
        </div>
      </div>

      <template
        v-if="config"
      >
        <SingleChoice
          v-if="isSingleChoice"
          :id="index"
          v-model="localField"
          :answers="config.answers"
          :config="config"
        />

        <MultipleChoice
          v-if="isMultipleChoice"
          :id="index"
          v-model="localField"
          :answers="config.answers"
          :config="config"
        />

        <RankedChoice
          v-if="isRankedChoice"
          :id="index"
          v-model="localField"
          :answers="config.answers"
          :config="config"
        />
      </template>

      <div class="change-link">
        <button
          class="govuk-button govuk-!-margin-right-3"
          @click="btnClickSubmit()"
        >
          Save
        </button>
        <button
          class="govuk-button govuk-button--warning"
          @click="cancelEdit()"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import TextField from '@jac-uk/jac-kit/draftComponents/Form/TextField.vue';
import TextareaInput from '@jac-uk/jac-kit/draftComponents/Form/TextareaInput.vue';
import DateInput from '@jac-uk/jac-kit/draftComponents/Form/DateInput.vue';
import formatEmail from '@jac-uk/jac-kit/helpers/Form/formatEmail';
import Select from '@jac-uk/jac-kit/draftComponents/Form/Select.vue';
import CheckboxGroup from '@jac-uk/jac-kit/draftComponents/Form/CheckboxGroup.vue';
import CheckboxItem from '@jac-uk/jac-kit/draftComponents/Form/CheckboxItem.vue';
//import * as filters from '../filters/filters';
import Form from '@jac-uk/jac-kit/draftComponents/Form/Form.vue';
import { transformOnSelection } from '@jac-uk/jac-kit/helpers/array';
import SingleChoice from './SingleChoice.vue';
import MultipleChoice from './MultipleChoice.vue';
import RankedChoice from './RankedChoice.vue';

export default {
  components: {
    TextField,
    TextareaInput,
    DateInput,
    Select,
    CheckboxGroup,
    CheckboxItem,
    SingleChoice,
    MultipleChoice,
    RankedChoice,
  },
  extends: Form,
  props: {
    editMode: {
      type: [Boolean, Function, Promise],
      required: false,
      default: () => false,
    },
    extension: {
      type: [String, Array],
      required: false,
      default: null,
    },
    index: {
      type: [Number, String],
      required: false,
      default: null,
    },
    field: {
      type: String,
      default: 'value',
    },
    value: {
      type: [String, Date, Number, Object, Array, Boolean],
      default: () => null,
    },
    type: {
      type: String,
      default: 'text',
    },
    link: {
      type: String,
      default: 'Change',
    },
    options: {
      type: Array,
      default: null,
    },
    routeTo: {
      type: Object,
      default: null,
    },
    displayMonthYearOnly: {
      type: Boolean,
      default: false,
    },
    isAsked: {
      type: Boolean,
      required: false,
      default: true,
    },
    config: {
      type: Object,
      required: false,
      default: null,
    },
  },
  emits: ['changeField'],
  data() {
    return {
      localField: '',
      editField: false,
      id: null,
      //filters: filters,
      ranking: {},
    };
  },
  computed: {
    isEmail() {
      return this.type === 'email';
    },
    isPhone() {
      return this.type === 'tel';
    },
    isText() {
      return this.type === 'text';
    },
    isTextarea() {
      return this.type === 'textarea';
    },
    isRoute() {
      return this.type === 'route' && this.routeTo !== null;
    },
    isDate() {
      return this.type === 'date';
    },
    isSelection() {
      return this.type === 'selection';
    },
    isRankedSelection() {
      return this.type === 'ranked-selection';
    },
    isMultiSelection() {
      return this.type === 'multi-selection';
    },
    isSingleChoice() {
      return this.type === 'single-choice';
    },
    isMultipleChoice() {
      return this.type === 'multiple-choice';
    },
    isRankedChoice() {
      return this.type === 'ranked-choice';
    },
    valueToDate() {
      const newDate = this.isDate ? new Date(this.value) : null;
      return newDate;
    },
    formattedDate() {
      return this.$filters.formatDate(this.value, (this.displayMonthYearOnly ? 'month' : ''));
    },
  },
  watch: {
    editMode: function() {
      if (this.editField && !this.editMode) {
        this.cancelEdit();
      }
    },
    localField(newValue, oldValue) {
      if (this.isMultiSelection) {
        this.localField = transformOnSelection(newValue, oldValue, 'prefer-not-to-say');
      }
    },
  },
  mounted () {
    this.id = this._uid;
  },
  methods: {
    sortRankedSelection(dataset) {
      if (dataset) {
        return Object.fromEntries(Object.entries(dataset).sort((a, b) => a[1] - b[1]));
      } else {
        return [];
      }
    },
    sortEqualRankedSelection(dataset) {
      const groups = {};
      Object.entries(dataset).forEach(([answer, rank]) => {
        if (!groups[rank]) {
          groups[rank] = [];
        }
        groups[rank].push(answer);
      });
      return Object.entries(groups).map(([rank, answers]) => ({ rank, answers }));
    },
    findGroupByAnswer(dataset, targetAnswer) {
      for (const question of dataset) {

        if (question.answers.some(answerObj => answerObj.answer === targetAnswer)) {
          return question.group;
        }
      }
      return null; // Return null if the answer is not found in any group
    },
    updateRanking() {
      const rankedSelection = [];
      const cleanedRanking = {};
      for (let i = 0, len = this.localField.length; i < len; ++i) {
        if (!this.ranking[this.localField[i]]) { this.ranking[this.localField[i]] = this.localField.length; }
        rankedSelection.push({ answer: this.localField[i], rank: this.ranking[this.localField[i]] });
        cleanedRanking[this.localField[i]] = this.ranking[this.localField[i]];
      }
      this.ranking = cleanedRanking;
      this.localField = rankedSelection.sort(( item1, item2 ) => {
        if (item1.rank < item2.rank) {
          return -1;
        } else if (item1.rank > item2.rank) {
          return 1;
        } else {
          return 0;
        }
      }).map((item) => {
        return item.answer;
      });
    },
    cancelEdit() {
      this.editField = false;
    },
    btnClickEdit() {
      this.localField = this.value;
      this.editField = true;
    },
    btnClickSubmit() {
      let resultObj;
      this.validate();
      if (this.isValid()) {

        if (this.isEmail) {
          const value = formatEmail(this.localField);
          this.localField = value;
        }

        if (this.index != undefined || this.extension != undefined) { // is nested or indexed item
          resultObj = {
            field: this.field,
            change: this.localField,
          };
          if (this.index != undefined) { // is indexed item
            resultObj = {
              ...resultObj,
              index: this.index,
            };
          }
          if (this.extension != undefined) { // is nested item
            resultObj = {
              ...resultObj,
              extension: this.extension,
            };
          }
        } else {
          resultObj = { [this.field]: this.localField }; // else
        }

        this.$emit('changeField', resultObj);

        this.editField = false;
      }
    },
  },
};
</script>

<style scoped>
  .non-editable {
    display: flex;
    flex-direction: row;
    width: 100%;
  }

  .edit-field {
    width: 100%;
    /* display: inline-flex; */
  }

  .non-editable .change-link {
    margin-left: auto;
  }

  .wrap {
    overflow-wrap: anywhere;
  }
</style>
