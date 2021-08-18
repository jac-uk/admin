<template>
  <div>
    <div
      v-if="!isPanelView && exercise.yesSalaryDetails"
      class="govuk-!-margin-top-9"
    >
      <h2 class="govuk-heading-l">
        Part Time Working Preferences
      </h2>
      <dl class="govuk-summary-list">
        <dt class="govuk-summary-list__key">
          {{ exercise.yesSalaryDetails }}
        </dt>
        <dd
          class="govuk-summary-list__value"
        >
          <InformationReviewRenderer
            :data="application.partTimeWorkingPreferencesDetails"
            field="partTimeWorkingPreferencesDetails"
            :edit="editable"
            type="text"
            @changeField="changePreferences"
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
        <dt class="govuk-summary-list__key">
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
            @changeField="changePreferences"
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
            @changeField="changePreferences"
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
              @changeField="changePreferences"
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
        v-if="application.jurisdictionPreferences"
        class="govuk-summary-list"
      >
        <div class="govuk-summary-list__row">
          <dt class="govuk-summary-list__key">
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
              @changeField="changePreferences"
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
              @changeField="changePreferences"
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
                @changeField="changePreferences"
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
        <div class="govuk-summary-list__row">
          <dt class="govuk-summary-list__key">
            Applying for a Welsh post
          </dt>
          <dd
            class="govuk-summary-list__value"
          >
            {{ application.applyingForWelshPost | toYesNo | showAlternative('Answer not provided') }}
          </dd>
        </div>
        <!---
      <div
        v-if="application.applyingForWelshPost"
        class="govuk-summary-list__row"
      >
        <dt class="govuk-summary-list__key">
          Can speak Welsh
        </dt>
        <dd
          class="govuk-summary-list__value"
        >
          {{ application.canSpeakWelsh | toYesNo | showAlternative('Answer not provided') }}
        </dd>
      </div>
      <div
        v-if="application.applyingForWelshPost"
        class="govuk-summary-list__row"
      >
        <dt class="govuk-summary-list__key">
          Can read and write in Welsh?
        </dt>
        <dd
          class="govuk-summary-list__value"
        >
          <p
            v-if="application.canReadAndWriteWelsh == false "
          >
            {{ application.canReadAndWriteWelsh | toYesNo | showAlternative('Answer not provided') }}
          </p>
          <p
            v-if="application.canReadAndWriteWelsh"
          >
            {{ application.canReadAndWriteWelsh | lookup | showAlternative('Answer not provided') }}
          </p>
        </dd>
      </div>
    </dl>
  </div>

  <div
    v-if="application.additionalWorkingPreferences"
    class="govuk-!-margin-top-9"
  >
    <h2
      class="govuk-heading-l"
      style="display:inline-block;"
    >
      Additional Preferences
    </h2>

    <div v-if="application.additionalWorkingPreferences && application.additionalWorkingPreferences.length">
      <dl
        v-for="(item, index) in application.additionalWorkingPreferences"
        :key="index"
        class="govuk-summary-list"
      >
        <div class="govuk-summary-list__row">
          <dt class="govuk-summary-list__key">
            {{ exercise.additionalWorkingPreferences[index].question }}
            <span class="govuk-body govuk-!-font-size-19">
              ({{ exercise.additionalWorkingPreferences[index].questionType | lookup }})
            </span>
          </dt>
          <dd
            v-if="exercise.additionalWorkingPreferences[index].questionType === 'single-choice'"
            class="govuk-summary-list__value"
          >
            <ul class="govuk-list">
              <li>{{ item.selection }}</li>
            </ul>
          </dd>
          <dd
            v-if="exercise.additionalWorkingPreferences[index].questionType === 'multiple-choice'"
            class="govuk-summary-list__value"
          >
            <ul class="govuk-list">
              <li>
                <span
                  v-for="(option, count) in exercise.additionalWorkingPreferences[index].answers"
                  :key="count"
                >
                  <strong
                    v-if="item.selection.includes(option.answer)"
                  > {{ option.answer }} </strong>
                  <span
                    v-else
                  >
                    {{ option.answer }}
                  </span>
                  <span
                    v-if="count+1!==exercise.additionalWorkingPreferences[index].answers.length"
                  >,</span>
                </span>
              </li>
            </ul>
          </dd>
          <dd
            v-if="exercise.additionalWorkingPreferences[index].questionType === 'ranked-choice'"
            class="govuk-summary-list__value"
          >
            <ul class="govuk-list">
              <li>
                <span
                  v-for="(choice, count) in item.selection"
                  :key="count"
                >
                  <strong>{{ count+1 }}.</strong> {{ choice }}
                </span>
              </li>
            </ul>
          </dd>
        </div>
      </dl>
    </div>
    <div
      v-else
      class="govuk-body"
    >
      No information provided
    --->
      </dl>
    </div>
  </div>
</template>
<script>
import InformationReviewRenderer from '@/components/Page/InformationReviewRenderer';
// import InformationReviewSectionRenderer from '@/components/Page/InformationReviewSectionRenderer';

export default {
  name: 'PersonalDetailsSummary',
  components: {
    InformationReviewRenderer,
    // InformationReviewSectionRenderer,
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
  computed: {
    applicationId() {
      return this.$route.params.applicationId;
    },
    // hasEthnicGroupDetails() {
    //   return this.application &&
    //     this.application.equalityAndDiversitySurvey &&
    //     this.application.equalityAndDiversitySurvey.ethnicGroup &&
    //     this.application.equalityAndDiversitySurvey.ethnicGroup.startsWith('other-');
    // },
    // ethnicGroupDetails() {
    //   switch (this.application.equalityAndDiversitySurvey.ethnicGroup) {
    //   case 'other-asian':
    //     return 'otherEthnicGroupAsianDetails';
    //   case 'other-white':
    //     return 'otherEthnicGroupWhiteDetails';
    //   case 'other-black':
    //     return 'otherEthnicGroupBlackDetails';
    //   case 'other-mixed':
    //     return 'otherEthnicGroupMixedDetails';
    //   default:
    //     return 'otherEthnicGroupDetails';
    //   }
    // },
  },
  methods: {
    // fieldContains(field, item) {
    //   if (field === item) {
    //     return true;
    //   }
    //   if (Array.isArray(field) && field.includes(item)) {
    //     return true;
    //   }
    //   return false;
    // },
    changePreferences(objChanged) {
      const myPrefs = { ...this.application, ...objChanged };
      this.$store.dispatch('application/update', { data: myPrefs, id: this.applicationId });
    },
  },
};
</script>
