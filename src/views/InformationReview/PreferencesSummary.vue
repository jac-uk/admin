<template>
  <div>
    <div
      v-if="!isPanelView && exercise.yesSalaryDetails"
      class="govuk-!-margin-top-9"
    >
      <h2 class="govuk-heading-l">
        Part Time Working Preferences
      </h2>
      <!---
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
      --->
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
            v-for="(answer, index) in exercise.locationQuestionAnswers"
            :key="index"
            class="govuk-checkboxes__item"
          >
            <!-- 
            <InformationReviewSectionRenderer
              :data="application.locationPreferences[index]"
            />

              :value="characterInformation.criminalOffenceDetails"
            :data="characterInformation.criminalOffenceDetails"
            :data-default="emptyDetailObject"
            :edit="edit"
            field="criminalOffenceDetails"
            @changeField="changeCharacterInfo"
            -->

            <!-- 
            :data="application.locationPreferences[index]"
            :field="locationPreferences"
            :edit="editable"
            :options="exercise.locationQuestionAnswers.map(item => item.answer)"
            type="selection"
            @changeField="changePreferences"
            /> 
            -->
          </div>
        </dd>
      </dl>
    </div>
    <!---
          {{ application.locationPreferences || 'No answer provided' }}
        </dd>
        <dd
          v-else
          class="govuk-summary-list__value"
        >
          <p
            v-for="(item, index) in application.locationPreferences"
            :key="item.name"
            class="govuk-body"
          >
            <strong>
              {{ `${index + 1}:` }}
            </strong>
            {{ `${item}` }}
          </p>
        </dd>
      </dl>
      <div
        v-else
        class="govuk-body"
      >
        No information provided
      </div>
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
            {{ application.jurisdictionPreferences }}
          </dd>
          <dd
            v-else
            class="govuk-summary-list__value"
          >
            <p
              v-for="item in application.jurisdictionPreferences"
              :key="item.name"
              class="govuk-body"
            >
              {{ item }}
            </p>
          </dd>
        </div>
      </dl>
      <div
        v-else
        class="govuk-body"
      >
        No information provided
      </div>
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
      </div>
    </div>
  --->
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
    // applicationId() {
    //   return this.$route.params.applicationId;
    // },
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
      console.log(objChanged);
    //   const myEqualityAndDiversityInfo = { ...this.application.equalityAndDiversitySurvey, ...objChanged };
    //   this.$store.dispatch('application/update', { data: { equalityAndDiversitySurvey: myEqualityAndDiversityInfo }, id: this.applicationId });
    //   this.$store.dispatch('candidates/saveEqualityAndDiversityInfo', { data: objChanged, id: this.application.userId });
    },
  },
};
</script>
