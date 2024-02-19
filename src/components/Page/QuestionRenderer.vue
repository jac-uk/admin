<template>
  <div
    v-if="shouldRenderQuestion"
    class="govuk-summary-list__row"
  >
    <dt
      class="govuk-summary-list__key"
    >
      {{ currentItem.question }}
      <span
        class="govuk-hint"
      >
        {{ $filters.lookup(currentItem.questionType) }}
        {{ currentItem.groupAnswers ? ' - Grouped Answers' : '' }}
        {{ currentItem.minimumAnswerMode === 'some' ? ` - ${currentItem.minimumAnswerQuantity} Answer minimum` : '' }}
        {{ currentItem.allowEqualRanking ? ' - Allow Equal Rank' : '' }}
        {{ currentItem.allowLinkedQuestions ? ' - has linked Questions' : '' }}
      </span>
    </dt>
  </div>
</template>

<script>
export default {
  name: 'LocationPreferences',
  props: {
    section: {
      type: String,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    application: {
      type: Object,
      required: false,
      default: null,
    },
    review: {
      type: Boolean,
      required: true,
    },
    exercise: {
      type: Object,
      required: true,
    },
  },
  computed: {
    currentItem() {
      return this.exercise[this.section][this.index];
    },
    shouldRenderQuestion() {
      if (this.review) {
        // If there's a linked question and its answer doesn't match this question's linked answer, do not render the question
        if (this.currentItem.linkedQuestion && this.currentItem.linkedAnswer) {
          return this.isLinkedByAnswer;
        }

        // If there's no linked question, render the question
      }
      return true;
    },
    isLinkedByAnswer() {
      // find the linked question
      const linkedQuestion = Object.keys(this.application[this.section]).find(question => question === this.currentItem.linkedQuestion);
      if (linkedQuestion) {
        // check if the answer given for the linked question matches this questions linked answer
        const linkedAnswer = this.application[this.section][linkedQuestion];
        return linkedAnswer === this.currentItem.linkedAnswer;
      } else {
        return false;
      }
    },
  },
  methods: {
    sortRankedSelection(dataset) {
      return Object.fromEntries(Object.entries(dataset).sort((a, b) => a[1] - b[1]));
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
  },
};
</script>
