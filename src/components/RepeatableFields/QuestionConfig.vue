<template>
  <fieldset class="govuk-fieldset govuk-!-margin-bottom-5">
    <legend class="govuk-fieldset__legend govuk-fieldset__legend--l">
      <div class="govuk-body govuk-!-margin-0">
        <span v-if="type">{{ $filters.lookup(type) }} {{ index + 1 }}</span>
        <span v-else>Custom question {{ index + 1 }}</span>
      </div>
    </legend>
    <TextField
      v-if="!type"
      id="working-preference-topic"
      v-model="row.topic"
      hint="This will be used as the title of links to this question - e.g. Division preferences"
      label="Preference type"
    />

    <div
      v-if="otherLinkedQuestions && otherLinkedQuestions.length"
    >
      <h3 class="govuk-heading-m govuk-!-margin-bottom-0">
        Link this question?
      </h3>
      <div class="govuk-label">
        This question will only be asked if the user selects a specific answer from another question
      </div>
      <div class="govuk-button-group">
        <Select
          id="linked-question"
          v-model="row.linkedQuestion"
          class="govuk-!-margin-right-2"
        >
          <option value="">
            Choose a question
          </option>
          <option
            v-for="question in otherLinkedQuestions"
            :key="question.question"
            :value="question.id"
          >
            {{ question.question }}
          </option>
        </Select>
        <Select
          v-if="row.linkedQuestion"
          id="linked-answer"
          v-model="row.linkedAnswer"
        >
          <option value="">
            Choose an answer
          </option>
          <template v-if="getLinkedQuestion(row.linkedQuestion).groupAnswers">
            <optgroup
              v-for="item in getLinkedQuestion(row.linkedQuestion).answers"
              :key="item.group"
              :label="item.group"
            >
              <option
                v-for="answer in item.answers"
                :key="answer.answer"
                :value="answer.id"
              >
                {{ answer.answer }}
              </option>
            </optgroup>
          </template>
          <template v-else>
            <option
              v-for="answer in getLinkedQuestion(row.linkedQuestion).answers"
              :key="answer.answer"
              :value="answer.id"
            >
              {{ answer.answer }}
            </option>
          </template>
        </Select>
      </div>
    </div>

    <TextField
      id="working-preference-${type}-question"
      v-model="row.question"
      label="What question would you like to ask?"
      required
    />

    <RadioGroup
      :id="`working-preference-${type}-question-required_${index}`"
      v-model="row.questionRequired"
      label="Is the candidate required to answer this question?"
      :messages="{
        required: 'Please choose one of the following options'
      }"
    >
      <RadioItem
        :value="true"
        label="Yes - this question must be answered by the candidate"
      />
      <RadioItem
        :value="false"
        label="No - answering this question is optional"
      />
    </RadioGroup>

    <RadioGroup
      :id="`working-preference-${type}-question-type_${index}`"
      v-model="row.questionType"
      label="How would you like the question answered?"
      :messages="{
        required: 'Please choose one of the following options'
      }"
    >
      <RadioItem
        value="single-choice"
        label="Single choice"
      />
      <RadioItem
        value="multiple-choice"
        label="Multiple choice"
      />
      <RadioItem
        value="ranked-choice"
        label="Ranked choice"
      />
    </RadioGroup>

    <RadioGroup
      v-if="row.questionType != 'single-choice'"
      :id="`working-preference-${type}-answer-_${index}`"
      v-model="row.minimumAnswerMode"
      label="How many answers should candidates select?"
    >
      <RadioItem
        v-if="row.questionType != 'multiple-choice'"
        value="all"
        label="All"
      />
      <RadioItem
        value="any"
        label="Any"
      />
      <RadioItem
        value="some"
        label="At least"
      >
        <TextField
          :id="`working-preference-${type}-answer-quantity-_${index}`"
          v-model="row.minimumAnswerQuantity"
          label="Specify the amount"
          input-class="govuk-input--width-2"
          required
        />
      </RadioItem>
      <RadioItem
        value="exactly"
        label="Exactly"
      >
        <TextField
          :id="`working-preference-${type}-answer-quantity-_${index}`"
          v-model="row.minimumAnswerQuantity"
          label="Specify the amount"
          input-class="govuk-input--width-2"
          required
        />
      </RadioItem>
    </RadioGroup>

    <Checkbox
      v-if="row.questionType == 'ranked-choice'"
      id="allow-equal-ranking"
      v-model="row.allowEqualRanking"
      label="Allow equal ranking?"
      hint="For example two answers could be ranked in first place"
    >
      Yes
    </Checkbox>

    <RadioGroup
      :id="`working-preference-${type}-linked-questions-_${index}`"
      v-model="row.allowLinkedQuestions"
      label="Allow answers to have linked questions?"
    >
      <RadioItem
        :value="true"
        label="Yes"
      />
      <RadioItem
        :value="false"
        label="No"
      />
    </RadioGroup>

    <RadioGroup
      v-if="type == 'jurisdictionPreference'"
      :id="`working-preference-${type}-answer-source-_${index}`"
      v-model="row.answerSource"
      label="Answers"
    >
      <RadioItem
        value="jurisdiction"
        label="Use master jurisdiction list as answers"
      />
      <RadioItem
        value=""
        label="Custom answers"
      />
    </RadioGroup>

    <div v-if="type != 'jurisdictionPreference' || row.answerSource == ''">
      <RadioGroup
        :id="`working-preference-${type}-answer-grouping-_${index}`"
        v-model="row.groupAnswers"
        label="Group answers together?"
      >
        <RadioItem
          :value="true"
          label="Yes - answers will be grouped together"
        />
        <RadioItem
          :value="false"
          label="No"
        />
      </RadioGroup>

      <RepeatableFields
        v-if="row.groupAnswers"
        v-model="row.answers"
        :component="repeatableFields.AnswerGroup"
        ident="answer"
        type-name="answer group"
        required
      />
      <RepeatableFields
        v-else
        v-model="row.answers"
        :component="repeatableFields.Answer"
        ident="answer"
        type-name="answer"
        required
      />
    </div>
    <slot name="removeButton" />
  </fieldset>
</template>

<script>
import TextField from '@jac-uk/jac-kit/draftComponents/Form/TextField.vue';
import RadioGroup from '@jac-uk/jac-kit/draftComponents/Form/RadioGroup.vue';
import RadioItem from '@jac-uk/jac-kit/draftComponents/Form/RadioItem.vue';
import Checkbox from '@jac-uk/jac-kit/draftComponents/Form/Checkbox.vue';
import Select from '@jac-uk/jac-kit/draftComponents/Form/Select.vue';
import RepeatableFields from '@jac-uk/jac-kit/draftComponents/RepeatableFields.vue';
import AnswerGroup from '@/components/RepeatableFields/AnswerGroup.vue';
import Answer from '@/components/RepeatableFields/Answer.vue';
import { shallowRef } from 'vue';
import { getRandomString } from '@jac-uk/jac-kit/helpers/helpers';

export default {
  name: 'QuestionConfig',
  components: {
    TextField,
    RepeatableFields,
    RadioGroup,
    RadioItem,
    Checkbox,
    Select,
  },
  props: {
    row: {
      required: true,
      type: Object,
    },
    index: {
      required: true,
      type: Number,
    },
    type: {
      required: false,
      type: String,
      default: '',
    },
    linkedQuestions: {
      required: false,
      type: Array,
      default: () => [],
    },
  },
  data() {
    // set default values
    if (!this.row.hasOwnProperty('id')) this.row.id = getRandomString(3);
    if (!this.row.hasOwnProperty('questionRequired')) this.row.questionRequired = true;
    if (!this.row.hasOwnProperty('questionType')) this.row.questionType = 'single-choice';
    if (!this.row.hasOwnProperty('allowLinkedQuestions')) this.row.allowLinkedQuestions = false;
    if (!this.row.hasOwnProperty('minimumAnswerMode')) this.row.minimumAnswerMode = 'any';
    if (
      this.type === 'jurisdictionPreference'
      && !this.row.hasOwnProperty('answerSource')
    ) {
      this.row.answerSource = 'jurisdiction';
    }
    if (!this.row.hasOwnProperty('groupAnswers')) this.row.groupAnswers = false;
    return {
      repeatableFields: shallowRef({
        Answer,
        AnswerGroup,
      }),
    };
  },
  computed: {
    otherLinkedQuestions() {
      return this.linkedQuestions.filter(item => item.question !== this.row.question);
    },
  },
  watch: {
    'row.questionType': {
      handler() {
        if (this.row.questionType === 'single-choice') {
          this.row.minimumAnswerMode = 'any'; // reset to default
        }
      },
    },
  },
  methods: {
    getLinkedQuestion(questionTitle) {
      return this.linkedQuestions.find(question => question.id === questionTitle);
    },
  },
};
</script>

<style lang="scss" scoped>

.govuk-fieldset {
  @include govuk-responsive-padding(6);
  border: 2px solid $govuk-border-colour;
}

.jac-add-another__remove-button {
  color: blue;
}

</style>
