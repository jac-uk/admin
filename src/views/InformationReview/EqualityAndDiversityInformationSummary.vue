<template>
  <div>
    <h2
      class="govuk-heading-l govuk-!-padding-top-6"
    >
      Equality and diversity information
    </h2>
    <dl
      v-if="application.equalityAndDiversitySurvey || editable"
      class="govuk-summary-list"
    >
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key widerColumn">
          Agreed to share data
        </dt>
        <dd
          v-if="fieldContains(equalityAndDiversitySurvey, 'shareData')"
          class="govuk-summary-list__value"
        >
          {{ equalityAndDiversitySurvey.shareData | toYesNo }}
        </dd>
        <dd
          v-else
          class="govuk-summary-list__value"
        >
          Question not answered
        </dd>
      </div>

      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key widerColumn">
          Professional background
        </dt>
        <dd
          class="govuk-summary-list__value"
        >
          <span
            v-if="fieldContains(equalityAndDiversitySurvey.professionalBackground, 'prefer-not-to-say') && !editable"
          >
            Prefer not to say
          </span>
          <InformationReviewRenderer
            v-else
            type="multi-selection"
            :options="['barrister', 'cilex', 'solicitor', 'other-professional-background', 'prefer-not-to-say']"
            field="professionalBackground"
            :edit="editable"
            :data="equalityAndDiversitySurvey.professionalBackground"
            @changeField="changeEqualityAndDiversityInformation"
          />
        </dd>
      </div>

      <div
        v-if="fieldContains(equalityAndDiversitySurvey.professionalBackground, 'other-professional-background')"
        class="govuk-summary-list__row"
      >
        <dt class="govuk-summary-list__key widerColumn">
          Other Professional background details
        </dt>
        <dd
          class="govuk-summary-list__value"
        >
          <InformationReviewRenderer
            field="otherProfessionalBackgroundDetails"
            :edit="editable"
            :data="equalityAndDiversitySurvey.otherProfessionalBackgroundDetails"
            @changeField="changeEqualityAndDiversityInformation"
          />
        </dd>
      </div>

      <div
        v-if="isLegal"
        class="govuk-summary-list__row"
      >
        <dt class="govuk-summary-list__key widerColumn">
          Current legal role
        </dt>
        <dd
          class="govuk-summary-list__value"
        >
          <span
            v-if="fieldContains(equalityAndDiversitySurvey.currentLegalRole, 'prefer-not-to-say') && !editable"
          >
            Prefer not to say
          </span>
          <InformationReviewRenderer
            v-else
            type="multi-selection"
            :options="['academic', 'barrister', 'cilex', 'solicitor', 'fee-paid-court-judge', 'fee-paid-tribunal-judge', 'other-fee-paid-judicial-office-holder', 'other-current-legal-role', 'salaried-court-judge', 'salaried-tribunal-judge', 'other-salaried-judicial-office-holder', 'prefer-not-to-say']"
            field="currentLegalRole"
            :edit="editable"
            :data="equalityAndDiversitySurvey.currentLegalRole"
            @changeField="changeEqualityAndDiversityInformation"
          />
        </dd>
      </div>

      <div
        v-if="fieldContains(equalityAndDiversitySurvey.currentLegalRole, 'other-fee-paid-judicial-office-holder')"
        class="govuk-summary-list__row"
      >
        <dt class="govuk-summary-list__key widerColumn">
          Other Fee-paid judicial office holder role details
        </dt>
        <dd
          class="govuk-summary-list__value"
        >
          <InformationReviewRenderer
            field="otherCurrentFeePaidJudicialOfficeHolderDetails"
            :edit="editable"
            :data="equalityAndDiversitySurvey.otherCurrentFeePaidJudicialOfficeHolderDetails"
            @changeField="changeEqualityAndDiversityInformation"
          />
        </dd>
      </div>

      <div
        v-if="fieldContains(equalityAndDiversitySurvey.currentLegalRole, 'other-salaried-judicial-office-holder')"
        class="govuk-summary-list__row"
      >
        <dt class="govuk-summary-list__key widerColumn">
          Other salaried judicial office holder role details
        </dt>
        <dd
          class="govuk-summary-list__value"
        >
          <InformationReviewRenderer
            field="otherCurrentSalariedJudicialOfficeHolderDetails"
            :edit="editable"
            :data="equalityAndDiversitySurvey.otherCurrentSalariedJudicialOfficeHolderDetails"
            @changeField="changeEqualityAndDiversityInformation"
          />
        </dd>
      </div>

      <div
        v-if="fieldContains(equalityAndDiversitySurvey.currentLegalRole, 'other-current-legal-role')"
        class="govuk-summary-list__row"
      >
        <dt class="govuk-summary-list__key widerColumn">
          Other current legal role details
        </dt>
        <dd
          class="govuk-summary-list__value"
        >
          <InformationReviewRenderer
            field="otherCurrentLegalRoleDetails"
            :edit="editable"
            :data="equalityAndDiversitySurvey.otherCurrentLegalRoleDetails"
            @changeField="changeEqualityAndDiversityInformation"
          />
        </dd>
      </div>

      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key widerColumn">
          Held fee-paid judicial role
        </dt>
        <dd
          class="govuk-summary-list__value"
        >
          <span
            v-if="fieldContains(equalityAndDiversitySurvey.feePaidJudicialRole, 'prefer-not-to-say') && !editable"
          >
            Prefer not to say
          </span>
          <InformationReviewRenderer
            v-else
            type="selection"
            :options="[false, 'fee-paid-court-post', 'fee-paid-tribunal-post', 'other-fee-paid-judicial-office', 'prefer-not-to-say']"
            field="feePaidJudicialRole"
            :edit="editable"
            :data="equalityAndDiversitySurvey.feePaidJudicialRole"
            @changeField="changeEqualityAndDiversityInformation"
          />
        </dd>
      </div>

      <div
        v-if="fieldContains(equalityAndDiversitySurvey.feePaidJudicialRole, 'other-fee-paid-judicial-office')"
        class="govuk-summary-list__row"
      >
        <dt class="govuk-summary-list__key widerColumn">
          Other fee-paid judicial office details
        </dt>
        <dd
          class="govuk-summary-list__value"
        >
          <InformationReviewRenderer
            field="otherFeePaidJudicialRoleDetails"
            :edit="editable"
            :data="equalityAndDiversitySurvey.otherFeePaidJudicialRoleDetails"
            @changeField="changeEqualityAndDiversityInformation"
          />
        </dd>
      </div>

      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key widerColumn">
          Attended state or fee-paying school
        </dt>
        <dd
          class="govuk-summary-list__value"
        >
          <span
            v-if="fieldContains(equalityAndDiversitySurvey.stateOrFeeSchool, 'prefer-not-to-say') && !editable"
          >
            Prefer not to say
          </span>
          <InformationReviewRenderer
            v-else
            type="selection"
            :options="['uk-state-selective', 'uk-state-non-selective', 'uk-independent-fee', 'non-uk-educated', 'prefer-not-to-say']"
            field="stateOrFeeSchool"
            :edit="editable"
            :data="equalityAndDiversitySurvey.stateOrFeeSchool"
            @changeField="changeEqualityAndDiversityInformation"
          />
        </dd>
      </div>

      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key widerColumn">
          Attended Oxbridge universities
        </dt>
        <dd
          class="govuk-summary-list__value"
        >
          <span
            v-if="fieldContains(equalityAndDiversitySurvey.oxbridgeUni, 'prefer-not-to-say') && !editable"
          >
            Prefer not to say
          </span>
          <InformationReviewRenderer
            v-else
            type="selection"
            :options="[true, false, 'prefer-not-to-say']"
            field="oxbridgeUni"
            :edit="editable"
            :data="equalityAndDiversitySurvey.oxbridgeUni"
            @changeField="changeEqualityAndDiversityInformation"
          />
        </dd>
      </div>

      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key widerColumn">
          First generation to go to university
        </dt>
        <dd
          class="govuk-summary-list__value"
        >
          <span
            v-if="fieldContains(equalityAndDiversitySurvey.firstGenerationStudent, 'prefer-not-to-say') && !editable"
          >
            Prefer not to say
          </span>
          <InformationReviewRenderer
            v-else
            type="selection"
            :options="[true, false, 'non-university-educated', 'prefer-not-to-say']"
            field="firstGenerationStudent"
            :edit="editable"
            :data="equalityAndDiversitySurvey.firstGenerationStudent"
            @changeField="changeEqualityAndDiversityInformation"
          />
        </dd>
      </div>

      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key widerColumn">
          Ethnic group
        </dt>
        <dd
          class="govuk-summary-list__value"
        >
          <span
            v-if="fieldContains(equalityAndDiversitySurvey.ethnicGroup, 'prefer-not-to-say') && !editable"
          >
            Prefer not to say
          </span>
          <InformationReviewRenderer
            v-else
            type="selection"
            :options="['bangladeshi', 'chinese', 'indian', 'pakistani', 'other-asian', 'african', 'caribbean', 'other-black', 'uk-ethnic', 'irish', 'gypsy-irish-traveller', 'other-white', 'white-black-caribbean', 'white-black-african', 'white-asian', 'other-mixed', 'other-ethnic-group', 'prefer-not-to-say']"
            field="ethnicGroup"
            :edit="editable"
            :data="equalityAndDiversitySurvey.ethnicGroup"
            @changeField="changeEqualityAndDiversityInformation"
          />
        </dd>
      </div>

      <div
        v-if="hasEthnicGroupDetails"
        class="govuk-summary-list__row"
      >
        <dt class="govuk-summary-list__key widerColumn">
          Ethnicity
        </dt>
        <dd class="govuk-summary-list__value">
          <InformationReviewRenderer
            :field="ethnicGroupDetails"
            :edit="editable"
            :data="equalityAndDiversitySurvey[ethnicGroupDetails]"
            @changeField="changeEqualityAndDiversityInformation"
          />
        </dd>
      </div>

      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key widerColumn">
          Sex
        </dt>
        <dd class="govuk-summary-list__value">
          <span
            v-if="fieldContains(equalityAndDiversitySurvey.gender, 'prefer-not-to-say') && !editable"
          >
            Prefer not to say
          </span>
          <InformationReviewRenderer
            v-else
            type="selection"
            :options="['female', 'male', 'gender-neutral', 'other-gender', 'prefer-not-to-say']"
            field="gender"
            :edit="editable"
            :data="equalityAndDiversitySurvey.gender"
            @changeField="changeEqualityAndDiversityInformation"
          />
        </dd>
      </div>

      <div
        v-if="fieldContains(equalityAndDiversitySurvey.gender, 'other-gender')"
        class="govuk-summary-list__row"
      >
        <dt class="govuk-summary-list__key widerColumn">
          Other sex
        </dt>
        <dd class="govuk-summary-list__value">
          <InformationReviewRenderer
            field="otherGenderDetails"
            :edit="editable"
            :data="equalityAndDiversitySurvey.otherGenderDetails"
            @changeField="changeEqualityAndDiversityInformation"
          />
        </dd>
      </div>

      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key widerColumn">
          Gender is the same as sex assigned at birth
        </dt>
        <dd class="govuk-summary-list__value">
          <span
            v-if="fieldContains(equalityAndDiversitySurvey.changedGender, 'prefer-not-to-say') && !editable"
          >
            Prefer not to say
          </span>
          <InformationReviewRenderer
            v-else
            type="selection"
            :options="[true, false, 'prefer-not-to-say']"
            field="changedGender"
            :edit="editable"
            :data="equalityAndDiversitySurvey.changedGender"
            @changeField="changeEqualityAndDiversityInformation"
          />
        </dd>
      </div>

      <div
        v-if="fieldContains(equalityAndDiversitySurvey.changedGender, false)"
        class="govuk-summary-list__row"
      >
        <dt class="govuk-summary-list__key widerColumn">
          Gender identity
        </dt>
        <dd class="govuk-summary-list__value">
          <InformationReviewRenderer
            field="changedGender"
            :edit="editable"
            :data="equalityAndDiversitySurvey.genderIdentityDetails"
            @changeField="changeEqualityAndDiversityInformation"
          />
        </dd>
      </div>

      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key widerColumn">
          Sexual orientation
        </dt>
        <dd class="govuk-summary-list__value">
          <span
            v-if="fieldContains(equalityAndDiversitySurvey.sexualOrientation, 'prefer-not-to-say') && !editable"
          >
            Prefer not to say
          </span>
          <InformationReviewRenderer
            v-else
            type="selection"
            :options="['bisexual', 'gay-man', 'gay-woman-lesbian', 'heterosexual-straight', 'other-sexual-orientation', 'prefer-not-to-say']"
            field="sexualOrientation"
            :edit="editable"
            :data="equalityAndDiversitySurvey.sexualOrientation"
            @changeField="changeEqualityAndDiversityInformation"
          />
        </dd>
      </div>

      <div
        v-if="fieldContains(equalityAndDiversitySurvey.sexualOrientation, 'other-sexual-orientation')"
        class="govuk-summary-list__row"
      >
        <dt class="govuk-summary-list__key widerColumn">
          Sexual orientation details
        </dt>
        <dd class="govuk-summary-list__value">
          <InformationReviewRenderer
            field="otherSexualOrientationDetails"
            :edit="editable"
            :data="equalityAndDiversitySurvey.otherSexualOrientationDetails"
            @changeField="changeEqualityAndDiversityInformation"
          />
        </dd>
      </div>

      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key widerColumn">
          Disability
        </dt>
        <dd class="govuk-summary-list__value">
          <span
            v-if="fieldContains(equalityAndDiversitySurvey.disability, 'prefer-not-to-say') && !editable"
          >
            Prefer not to say
          </span>
          <InformationReviewRenderer
            v-else
            type="selection"
            :options="[true, false, 'prefer-not-to-say']"
            field="disability"
            :edit="editable"
            :data="equalityAndDiversitySurvey.disability"
            @changeField="changeEqualityAndDiversityInformation"
          />
        </dd>
      </div>

      <div
        v-if="fieldContains(equalityAndDiversitySurvey.disability, true)"
        class="govuk-summary-list__row"
      >
        <dt class="govuk-summary-list__key widerColumn">
          Disability details
        </dt>
        <dd class="govuk-summary-list__value">
          <InformationReviewRenderer
            field="disabilityDetails"
            :edit="editable"
            :data="equalityAndDiversitySurvey.disabilityDetails"
            @changeField="changeEqualityAndDiversityInformation"
          />
        </dd>
      </div>

      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key widerColumn">
          Religion
        </dt>
        <dd class="govuk-summary-list__value">
          <span
            v-if="fieldContains(equalityAndDiversitySurvey.religionFaith, 'prefer-not-to-say') && !editable"
          >
            Prefer not to say
          </span>
          <InformationReviewRenderer
            v-else
            type="selection"
            :options="['no-religion', 'atheist', 'buddhist', 'christian', 'hindu', 'jewish', 'muslim', 'sikh', 'other-religion', 'prefer-not-to-say']"
            field="religionFaith"
            :edit="editable"
            :data="equalityAndDiversitySurvey.religionFaith"
            @changeField="changeEqualityAndDiversityInformation"
          />
        </dd>
      </div>

      <div
        v-if="fieldContains(equalityAndDiversitySurvey.religionFaith, 'other-religion')"
        class="govuk-summary-list__row"
      >
        <dt class="govuk-summary-list__key widerColumn">
          Other religion details
        </dt>
        <dd class="govuk-summary-list__value">
          <InformationReviewRenderer
            field="otherReligionDetails"
            :edit="editable"
            :data="equalityAndDiversitySurvey.otherReligionDetails"
            @changeField="changeEqualityAndDiversityInformation"
          />
        </dd>
      </div>

      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key widerColumn">
          Attended outreach events
        </dt>
        <dd class="govuk-summary-list__value">
          <span
            v-if="fieldContains(equalityAndDiversitySurvey.attendedOutreachEvents, 'prefer-not-to-say') && !editable"
          >
            Prefer not to say
          </span>
          <InformationReviewRenderer
            v-else
            type="selection"
            :options="[true, false, 'prefer-not-to-say']"
            field="attendedOutreachEvents"
            :edit="editable"
            :data="equalityAndDiversitySurvey.attendedOutreachEvents"
            @changeField="changeEqualityAndDiversityInformation"
          />
        </dd>
      </div>

      <div
        v-if="isLegal"
        class="govuk-summary-list__row"
      >
        <dt class="govuk-summary-list__key widerColumn">
          Participated In judicial workshadowing Scheme
        </dt>
        <dd class="govuk-summary-list__value">
          <span
            v-if="fieldContains(equalityAndDiversitySurvey.participatedInJudicialWorkshadowingScheme, 'prefer-not-to-say') && !editable"
          >
            Prefer not to say
          </span>
          <InformationReviewRenderer
            v-else
            type="selection"
            :options="[true, false, 'prefer-not-to-say']"
            field="participatedInJudicialWorkshadowingScheme"
            :edit="editable"
            :data="equalityAndDiversitySurvey.participatedInJudicialWorkshadowingScheme"
            @changeField="changeEqualityAndDiversityInformation"
          />
        </dd>
      </div>

      <div
        v-if="isLegal"
        class="govuk-summary-list__row"
      >
        <dt class="govuk-summary-list__key widerColumn">
          Participated in Pre-Application Judicial Education Programme
        </dt>
        <dd class="govuk-summary-list__value">
          <span
            v-if="fieldContains(equalityAndDiversitySurvey.hasTakenPAJE, 'prefer-not-to-say') && !editable"
          >
            Prefer not to say
          </span>
          <InformationReviewRenderer
            v-else
            type="selection"
            :options="['online-and-judge-led', 'online-only', false, 'prefer-not-to-say']"
            field="hasTakenPAJE"
            :edit="editable"
            :data="equalityAndDiversitySurvey.hasTakenPAJE"
            @changeField="changeEqualityAndDiversityInformation"
          />
        </dd>
      </div>
    </dl>
    <span
      v-else
      class="govuk-body"
    >
      No information provided
      <hr>
    </span>
  </div>
</template>
<script>
import InformationReviewRenderer from '@/components/Page/InformationReviewRenderer';
import { isLegal } from '@/helpers/exerciseHelper';

export default {
  name: 'EqualityAndDiversityInformationSummary',
  components: {
    InformationReviewRenderer,
  },
  props: {
    application: {
      type: Object,
      required: true,
      default: () => {},
    },
    equalityAndDiversitySurvey: {
      type: Object,
      required: true,
      default: new Object({}),
    },
    editable: {
      type: [Boolean, Function, Promise],
      required: true,
      default: false,
    },
  },
  computed: {
    applicationId() {
      return this.$route.params.applicationId;
    },
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    isLegal() {
      return isLegal(this.exercise);
    },
    hasEthnicGroupDetails() {
      return this.application &&
        this.equalityAndDiversitySurvey &&
        this.equalityAndDiversitySurvey.ethnicGroup &&
        this.equalityAndDiversitySurvey.ethnicGroup.startsWith('other-');
    },
    ethnicGroupDetails() {
      switch (this.equalityAndDiversitySurvey.ethnicGroup) {
      case 'other-asian':
        return 'otherEthnicGroupAsianDetails';
      case 'other-white':
        return 'otherEthnicGroupWhiteDetails';
      case 'other-black':
        return 'otherEthnicGroupBlackDetails';
      case 'other-mixed':
        return 'otherEthnicGroupMixedDetails';
      default:
        return 'otherEthnicGroupDetails';
      }
    },
  },
  methods: {
    fieldContains(field, item) {
      if (field && item) {
        if (field === item) {
          return true;
        }
        if (Array.isArray(field) && field.includes(item)) {
          return true;
        }
      }
      return false;
    },
    changeEqualityAndDiversityInformation(obj) {
      const myEqualityAndDiversityInfo = { ...this.application.equalityAndDiversitySurvey, ...obj };
      this.$emit('updateApplication', { equalityAndDiversitySurvey: myEqualityAndDiversityInfo });
    },
  },
};
</script>

<style scoped>
  .widerColumn {
    width: 70%;
  }
</style>
