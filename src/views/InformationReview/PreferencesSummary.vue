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
            :is-asked="'interestedInPartTime' in application"
            @change-field="changePreferences"
          />
          <InformationReviewRenderer
            :data="application.partTimeWorkingPreferencesDetails"
            field="partTimeWorkingPreferencesDetails"
            :edit="editable"
            type="text"
            :is-asked="'partTimeWorkingPreferencesDetails' in application"
            @change-field="changePreferences"
          />
        </dd>
      </dl>
    </div>

    <div
      v-if="!isPanelView && exercise.locationQuestion"
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
            :is-asked="'locationPreferences' in application"
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
            :is-asked="'locationPreferences' in application"
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
              :is-asked="'locationPreferences' in application"
              @change-field="changePreferences"
            />
          </div>
        </dd>
      </dl>
    </div>

    <div
      v-if="!isPanelView && exercise.jurisdictionQuestion"
      class="govuk-!-margin-top-9"
    >
      <h2 class="govuk-heading-l">
        Jurisdiction preferences
      </h2>

      <dl
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
              :is-asked="'jurisdictionPreferences' in application"
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
              :is-asked="'jurisdictionPreferences' in application"
              @change-field="changePreferences"
            />
          </dd>
          <dd
            v-if="exercise.jurisdictionQuestionType == 'ranked-choice'"
            class="govuk-summary-list__value"
          >
            <div
              class="govuk-checkboxes__item"
            >
              <InformationReviewRenderer
                :data="application.jurisdictionPreferences"
                field="jurisdictionPreferences"
                :edit="editable"
                :options="exercise.jurisdictionQuestionAnswers.map(item => item.answer)"
                type="ranked-selection"
                :is-asked="'jurisdictionPreferences' in application"
                @change-field="changePreferences"
              />
            </div>
          </dd>
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
              :is-asked="'applyingForWelshPost' in application"
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
              :is-asked="'canSpeakWelsh' in application"
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
              :is-asked="'canReadAndWriteWelsh' in application"
              @change-field="changePreferences"
            />
          </dd>
        </div>
      </dl>
    </div>

    <div
      v-if="exercise.additionalWorkingPreferences && exercise.additionalWorkingPreferences.length"
    >
      <h2
        class="govuk-heading-l govuk-!-margin-top-6"
        style="display:inline-block;"
      >
        Additional Preferences
      </h2>

      <div v-if="application.additionalWorkingPreferences || editable">
        <dl
          v-for="(item, index) in exercise.additionalWorkingPreferences"
          :key="index"
          class="govuk-summary-list"
        >
          <div class="govuk-summary-list__row">
            <dt class="govuk-summary-list__key widerColumn">
              {{ exercise.additionalWorkingPreferences[index].question }}
              <span class="govuk-body govuk-!-font-size-19">
                ({{ $filters.lookup(exercise.additionalWorkingPreferences[index].questionType) }})
              </span>
            </dt>

            <dd
              v-if="exercise.additionalWorkingPreferences[index].questionType === 'single-choice'"
              class="govuk-summary-list__value"
            >
              <InformationReviewRenderer
                :data="additionalWorkingPreferenceAnswer(index)"
                field="additionalWorkingPreferences"
                :index="index"
                :edit="editable"
                :options="exercise.additionalWorkingPreferences[index].answers.map(item => item.answer)"
                type="selection"
                :is-asked="'additionalWorkingPreferences' in application"
                @change-field="changePreferences"
              />
            </dd>

            <dd
              v-if="exercise.additionalWorkingPreferences[index].questionType === 'multiple-choice'"
              class="govuk-summary-list__value"
            >
              <InformationReviewRenderer
                :data="additionalWorkingPreferenceAnswer(index)"
                field="additionalWorkingPreferences"
                :index="index"
                :edit="editable"
                :options="exercise.additionalWorkingPreferences[index].answers.map(item => item.answer)"
                type="multi-selection"
                :is-asked="'additionalWorkingPreferences' in application"
                @change-field="changePreferences"
              />
            </dd>

            <dd
              v-if="exercise.additionalWorkingPreferences[index].questionType === 'ranked-choice'"
              class="govuk-summary-list__value"
            >
              <InformationReviewRenderer
                :data="additionalWorkingPreferenceAnswer(index)"
                field="additionalWorkingPreferences"
                :index="index"
                :edit="editable"
                :options="exercise.additionalWorkingPreferences[index].answers.map(item => item.answer)"
                type="ranked-selection"
                :is-asked="'additionalWorkingPreferences' in application"
                @change-field="changePreferences"
              />
            </dd>
          </div>
        </dl>
      </div>
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
  </div>
</template>
<script>
import InformationReviewRenderer from '@/components/Page/InformationReviewRenderer';
import Banner from '@jac-uk/jac-kit/components/Banner/Banner.vue';

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
    additionalWorkingPreferenceAnswer(index) {
      let result = null;
      if (this.application.additionalWorkingPreferences) {
        if (this.application.additionalWorkingPreferences[index]) {
          result = this.application.additionalWorkingPreferences[index].selection;
        }
      }
      return result;
    },
    hasWelshPosts(requirement) {
      return this.exercise.welshRequirementType.some((req) => req === requirement);
    },
    changePreferences(obj) {
      let changedObj = this.application[obj.field] || [];

      if (obj.hasOwnProperty('change') && obj.hasOwnProperty('index')) {
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

      this.$emit('updateApplication', updatedApplication );
    },
  },
};
</script>

<style scoped>
  .widerColumn {
    width: 70%;
  }
</style>
