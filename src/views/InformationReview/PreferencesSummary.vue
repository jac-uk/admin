<template>
  <div>
    <div
      v-if="!isPanelView && exercise.isSPTWOffered"
      class="govuk-!-margin-top-9"
    >
      <h2 class="govuk-heading-l">
        Part Time Working Preferences
      </h2>
      <dl class="govuk-summary-list">
        <dt class="govuk-summary-list__key widerColumn">
          Salaried part-time work (SPTW) - {{ exercise.yesSalaryDetails }}
          <Banner
            v-if="!exercise.yesSalaryDetails"
            status="warning"
            message="No SPTW details were provided when setting up this exercise"
          />
        </dt>
        <dd
          class="govuk-summary-list__value"
        >
          <InformationReviewRenderer
            :data="application.interestedInPartTime"
            field="interestedInPartTime"
            :edit="editable"
            type="selection"
            :options="[true, false]"
            :is-asked="isApplicationPartAsked('partTimeWorkingPreferences')"
            @change-field="changePreferences"
          />
          <InformationReviewRenderer
            :data="application.partTimeWorkingPreferencesDetails"
            field="partTimeWorkingPreferencesDetails"
            :edit="editable"
            type="text"
            :is-asked="isApplicationPartAsked('partTimeWorkingPreferences')"
            @change-field="changePreferences"
          />
        </dd>
      </dl>
    </div>
    <div
      v-if="!isPanelView && (exercise.locationQuestion || exercise.locationPreferences)"
      class="govuk-!-margin-top-9"
    >
      <h2 class="govuk-heading-l">
        Location preferences
      </h2>

      <dl
        v-if="exercise.locationQuestion"
        class="govuk-summary-list"
      >
        <dt class="govuk-summary-list__key widerColumn">
          {{ exercise.locationQuestion }}
        </dt>
        <dd
          v-if="exercise.locationQuestionType == 'single-choice'"
          class="govuk-summary-list__value"
        >
          <InformationReviewRenderer
            :data="application.locationPreferences"
            field="locationPreferences"
            :edit="editable"
            :options="exercise.locationQuestionAnswers.map(item => item.answer)"
            type="selection"
            :is-asked="isApplicationPartAsked('locationPreferences')"
            @change-field="changePreferences"
          />
        </dd>
        <dd
          v-if="exercise.locationQuestionType == 'multiple-choice'"
          class="govuk-summary-list__value"
        >
          <InformationReviewRenderer
            :data="application.locationPreferences"
            field="locationPreferences"
            :edit="editable"
            :options="exercise.locationQuestionAnswers.map(item => item.answer)"
            type="multi-selection"
            :is-asked="isApplicationPartAsked('locationPreferences')"
            @change-field="changePreferences"
          />
        </dd>
        <dd
          v-if="exercise.locationQuestionType == 'ranked-choice'"
          class="govuk-summary-list__value"
        >
          <div
            class="govuk-checkboxes__item"
          >
            <InformationReviewRenderer
              :data="application.locationPreferences"
              field="locationPreferences"
              :edit="editable"
              :options="exercise.locationQuestionAnswers.map(item => item.answer)"
              type="ranked-selection"
              :is-asked="isApplicationPartAsked('locationPreferences')"
              @change-field="changePreferences"
            />
          </div>
        </dd>
      </dl>

      <dl
        v-else-if="exercise.locationPreferences"
        class="govuk-summary-list"
      >
        <div
          v-for="(item) in exercise.locationPreferences"
          :key="item"
          class="govuk-summary-list__row"
        >
          <template v-if="shouldRenderQuestion(item, 'locationPreferences')">
            <dt class="govuk-summary-list__key widerColumn">
              {{ item.question }}
            </dt>
            <div
              v-if="application.locationPreferences"
              class="govuk-summary-list__value"
            >
              <span class="govuk-hint">
                {{ $filters.lookup(item.questionType) }}
                {{ item.groupAnswers ? ' - Grouped Answers' : '' }}
                {{ item.minimumAnswerMode === 'some' ? ` - ${item.minimumAnswerQuantity} Answer minimum` : '' }}
                {{ item.allowEqualRanking ? ' - Allow Equal Rank' : '' }}
                {{ item.allowLinkedQuestions ? ' - has linked Questions' : '' }}
              </span>
              <InformationReviewRenderer
                :data="application.locationPreferences[item.id]"
                field="locationPreferences"
                :edit="editable"
                :type="item.questionType"
                :options="item.answers.map((ans) => ans.answer)"
                :index="item.question"
                :is-asked="isApplicationPartAsked('locationPreferences')"
                :question-config="getQuestionConfig(item)"
                @change-field="changePreferences"
              />
            </div>
          </template>
        </div>
      </dl>
    </div>
  </div>
  <div
    v-if="!isPanelView && (exercise.jurisdictionQuestion || exercise.jurisdictionPreferences)"
    class="govuk-!-margin-top-9"
  >
    <h2 class="govuk-heading-l govuk-!-margin-top-6">
      Jurisdiction preferences
    </h2>

    <dl
      v-if="exercise.jurisdictionQuestion"
      class="govuk-summary-list"
    >
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key widerColumn">
          {{ exercise.jurisdictionQuestion }}
        </dt>
        <dd
          v-if="exercise.jurisdictionQuestionType == 'single-choice'"
          class="govuk-summary-list__value"
        >
          <InformationReviewRenderer
            :data="application.jurisdictionPreferences"
            field="jurisdictionPreferences"
            :edit="editable"
            :options="exercise.jurisdictionQuestionAnswers.map(item => item.answer)"
            type="selection"
            :is-asked="isApplicationPartAsked('jurisdictionPreferences')"
            @change-field="changePreferences"
          />
        </dd>
        <dd
          v-if="exercise.jurisdictionQuestionType == 'multiple-choice'"
          class="govuk-summary-list__value"
        >
          <InformationReviewRenderer
            :data="application.jurisdictionPreferences"
            field="jurisdictionPreferences"
            :edit="editable"
            :options="exercise.jurisdictionQuestionAnswers.map(item => item.answer)"
            type="multi-selection"
            :is-asked="isApplicationPartAsked('jurisdictionPreferences')"
            @change-field="changePreferences"
          />
        </dd>
        <dd
          v-if="exercise.jurisdictionQuestionType == 'ranked-choice'"
          class="govuk-summary-list__value"
        >
          <div class="govuk-checkboxes__item">
            <InformationReviewRenderer
              :data="application.jurisdictionPreferences"
              field="jurisdictionPreferences"
              :edit="editable"
              :options="exercise.jurisdictionQuestionAnswers.map(item => item.answer)"
              type="ranked-selection"
              :is-asked="isApplicationPartAsked('jurisdictionPreferences')"
              @change-field="changePreferences"
            />
          </div>
        </dd>
      </div>
    </dl>

    <dl
      v-else-if="exercise.jurisdictionPreferences"
      class="govuk-summary-list"
    >
      <div
        v-for="(item) in exercise.jurisdictionPreferences"
        :key="item"
        class="govuk-summary-list__row"
      >
        <template v-if="shouldRenderQuestion(item, 'jurisdictionPreferences')">
          <dt class="govuk-summary-list__key widerColumn">
            {{ item.question }}
          </dt>
          <div
            v-if="application.jurisdictionPreferences"
            class="govuk-summary-list__value"
          >
            <span class="govuk-hint">
              {{ $filters.lookup(item.questionType) }}
              {{ item.groupAnswers ? ' - Grouped Answers' : '' }}
              {{ item.minimumAnswerMode === 'some' ? ` - ${item.minimumAnswerQuantity} Answer minimum` : '' }}
              {{ item.allowEqualRanking ? ' - Allow Equal Rank' : '' }}
              {{ item.allowLinkedQuestions ? ' - has linked Questions' : '' }}
            </span>

            <InformationReviewRenderer
              :options="getItemAnswers(item)"
              :data="application.jurisdictionPreferences[item.id]"
              field="jurisdictionPreferences"
              :edit="editable"
              :type="item.questionType"
              :index="item.question"
              :is-asked="isApplicationPartAsked('jurisdictionPreferences')"
              :question-config="getQuestionConfig(item)"
              @change-field="changePreferences"
            />
          </div>
        </template>
      </div>
    </dl>
  </div>
  <div
    v-if="exercise.welshRequirement"
    class="govuk-!-margin-top-9"
  >
    <h2 class="govuk-heading-l">
      Welsh posts
    </h2>

    <dl class="govuk-summary-list">
      <div
        v-if="exercise.welshRequirementType.some((req) => req === 'welsh-administration-questions')"
        class="govuk-summary-list__row"
      >
        <dt class="govuk-summary-list__key widerColumn">
          Applying for a Welsh post
        </dt>

        <dd
          class="govuk-summary-list__value"
        >
          <InformationReviewRenderer
            :data="application.applyingForWelshPost"
            field="applyingForWelshPost"
            :edit="editable"
            :options="[true, false]"
            type="selection"
            :is-asked="isApplicationPartAsked('welshPosts')"
            @change-field="changePreferences"
          />
        </dd>
      </div>

      <div
        v-if="hasWelshPosts('welsh-speaking')"
        class="govuk-summary-list__row"
      >
        <dt class="govuk-summary-list__key widerColumn">
          Can speak Welsh
        </dt>
        <dd
          class="govuk-summary-list__value"
        >
          <InformationReviewRenderer
            :data="application.canSpeakWelsh"
            field="canSpeakWelsh"
            :edit="editable"
            :options="[true, false]"
            type="selection"
            :is-asked="isApplicationPartAsked('welshPosts')"
            @change-field="changePreferences"
          />
        </dd>
      </div>
      <div
        v-if="hasWelshPosts('welsh-reading-writing')"
        class="govuk-summary-list__row"
      >
        <dt class="govuk-summary-list__key widerColumn">
          Can read and write in Welsh?
        </dt>
        <dd
          class="govuk-summary-list__value"
        >
          <InformationReviewRenderer
            :data="application.canReadAndWriteWelsh"
            field="canReadAndWriteWelsh"
            :edit="editable"
            :options="[false, 'read', 'write', 'both']"
            type="selection"
            :is-asked="isApplicationPartAsked('welshPosts')"
            @change-field="changePreferences"
          />
        </dd>
      </div>
    </dl>
  </div>
  <div
    v-if="exercise.additionalWorkingPreferences && exercise.additionalWorkingPreferences.length"
    class="govuk-!-margin-top-9"
  >
    <h2
      class="govuk-heading-l govuk-!-margin-top-6"
      style="display:inline-block;"
    >
      Additional Preferences
    </h2>

    <template v-if="application.additionalWorkingPreferences">
      <dl
        v-for="(item, index) in exercise.additionalWorkingPreferences"
        :key="index"
        class="govuk-summary-list"
      >
        <div class="govuk-summary-list__row">
          <dt class="govuk-summary-list__key widerColumn">
            {{ exercise.additionalWorkingPreferences[index].question }}
            <span
              v-if="!exercise.additionalWorkingPreferences[index].hasOwnProperty('groupAnswers')"
              class="govuk-body govuk-!-font-size-19"
            >
              ({{ $filters.lookup(exercise.additionalWorkingPreferences[index].questionType) }})
            </span>
            <br>
            <span
              v-if="item.topic"
              class="govuk-body govuk-!-font-size-19"
            >
              {{ item.topic }}
            </span>
          </dt>
          <dd
            v-if="item.hasOwnProperty('groupAnswers')"
            class="govuk-summary-list__value"
          >
            <!-- new working prefs -->
            <span class="govuk-hint">
              {{ $filters.lookup(item.questionType) }}
              {{ item.groupAnswers ? ' - Grouped Answers' : '' }}
              {{ item.minimumAnswerMode === 'some' ? ` - ${item.minimumAnswerQuantity} Answer minimum` : '' }}
              {{ item.allowEqualRanking ? ' - Allow Equal Rank' : '' }}
              {{ item.allowLinkedQuestions ? ' - has linked Questions' : '' }}
            </span>
            <InformationReviewRenderer
              :data="application.additionalWorkingPreferences[item.id]"
              field="additionalWorkingPreferences"
              :index="index"
              :edit="editable"
              :options="getItemAnswers(item)"
              :type="item.questionType"
              :is-asked="isApplicationPartAsked('additionalWorkingPreferences')"
              :question-config="getQuestionConfig(item)"
              @change-field="changePreferences"
            />
          </dd>
          <dd
            v-else
            class="govuk-summary-list__value"
          >
            <!-- old working prefs -->
            <InformationReviewRenderer
              :data="additionalWorkingPreferenceAnswer(index)"
              field="additionalWorkingPreferences"
              :index="index"
              :edit="editable"
              :options="exercise.additionalWorkingPreferences[index].answers.map(item => item.answer)"
              :type="getQuestionType(item)"
              :is-asked="isApplicationPartAsked('additionalWorkingPreferences')"
              @change-field="changePreferences"
            />
          </dd>
        </div>
      </dl>
    </template>
    <div
      v-else
    >
      <span
        class="govuk-body"
      >
        No information (not asked)
      </span>
    </div>
  </div>
</template>
<script>
import InformationReviewRenderer from '@/components/Page/InformationReviewRenderer.vue';
import Banner from '@jac-uk/jac-kit/components/Banner/Banner.vue';
import { isApplicationPartAsked } from '@/helpers/exerciseHelper';

export default {
  name: 'PreferencesSummary',
  components: {
    InformationReviewRenderer,
    Banner,
  },
  props: {
    application: {
      type: Object,
      required: true,
      default: () => {},
    },
    exercise: {
      type: Object,
      required: true,
      default: () => {},
    },
    editable: {
      type: [Boolean, Function, Promise],
      required: true,
      default: false,
    },
    isPanelView: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['updateApplication'],
  computed: {
    applicationId() {
      return this.$route.params.applicationId;
    },
  },
  methods: {
    shouldRenderQuestion(item, section) {
      // If there's a linked question and its answer doesn't match this question's linked answer, do not render the question
      if (item.linkedQuestion && item.linkedAnswer) {
        return this.isLinkedByAnswer(item, section);
      }

      // If there's no linked question, render the question
      return true;
    },
    getQuestionType(item) {
      switch (item.questionType) {
      case 'single-choice':
        return 'selection';
      case 'multiple-choice':
        return 'multi-selection';
      case 'ranked-choice':
        return 'ranked-selection';
      }
    },
    isLinkedByAnswer(item, section) {
      // find the linked question
      const linkedQuestion = Object.keys(this.application[section]).find(question => question === item.linkedQuestion);
      if (linkedQuestion) {
        // check if the answer given for the linked question matches this questions linked answer
        const linkedAnswer = this.application[section][linkedQuestion];
        return linkedAnswer === item.linkedAnswer;
      } else {
        return false;
      }
    },
    additionalWorkingPreferenceAnswer(index) {
      let result = null;
      if (this.application.additionalWorkingPreferences) {
        if (this.application.additionalWorkingPreferences[index]) {
          result = this.application.additionalWorkingPreferences[index].selection;
        }
      }
      return result;
    },
    getQuestionConfig(item) {
      if (item.hasOwnProperty('answerSource') && item.answerSource !== '') {
        if (item.answerSource === 'jurisdictions') {
          return { ...item, ...{ answers: this.exercise.jurisdiction.reduce((arr, val, index) => (arr[index] = { answer: val }, arr), {}) } };
        }
      } else {
        return item;
      }
    },
    getItemAnswers(item) {
      let res = [];
      if (item.hasOwnProperty('answerSource') && item.answerSource !== '') {
        if (item.answerSource === 'jurisdictions') {
          return this.exercise.jurisdiction;
        }
      } else if (item.hasOwnProperty('answers')) {
        res = item.answers.map((ans) => ans.answer);
      }
      return res;
    },
    hasWelshPosts(requirement) {
      return this.exercise.welshRequirementType.some((req) => req === requirement);
    },
    changePreferences(obj) {
      let changedObj = this.application[obj.field] || [];

      if (['locationPreferences', 'jurisdictionPreferences', 'additionalWorkingPreferences'].includes(obj.field)) {
        changedObj[obj.index] = obj.change;
      } else if (obj.hasOwnProperty('change') && obj.hasOwnProperty('index')) {
        if (changedObj.length) {
          changedObj[obj.index].selection = obj.change;
        } else {
          changedObj = {
            [obj.field]: {
              [obj.index]: {
                selection: obj.change,
              },
            },
          };
        }
      } else {
        changedObj = obj;
      }

      const updatedApplication = {
        ...this.application,
        ...changedObj ,
      };

      this.$emit('updateApplication', updatedApplication);
    },
    isApplicationPartAsked(part) {
      return isApplicationPartAsked(this.exercise, part);
    },
  },
};
</script>

<style scoped>
  .widerColumn {
    width: 70%;
  }
</style>
