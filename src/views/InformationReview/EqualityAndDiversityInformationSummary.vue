<template>
  <dl
    v-if="application.equalityAndDiversitySurvey"
    class="govuk-summary-list"
  >
    <div class="govuk-summary-list__row">
      <dt class="govuk-summary-list__key">
        Agreed to share data
      </dt>
      <dd
        v-if="application.equalityAndDiversitySurvey.hasOwnProperty('shareData')"
        class="govuk-summary-list__value"
      >
        {{ application.equalityAndDiversitySurvey.shareData | toYesNo }}
      </dd>
      <dd
        v-else
        class="govuk-summary-list__value"
      >
        {{ application.equalityAndDiversitySurvey.shareData | lookup }}
      </dd>
    </div>

    <div class="govuk-summary-list__row">
      <dt class="govuk-summary-list__key">
        Professional background
      </dt>
      <dd
        class="govuk-summary-list__value"
      >
        <span
          v-if="fieldContains(application.equalityAndDiversitySurvey.professionalBackground, 'prefer-not-to-say') && !editable"
        >
          Prefer not to say
        </span>
        <InformationReviewRenderer
          v-else
          type="multi-selection"
          :options="['barrister', 'cilex', 'solicitor', 'other-professional-background', 'prefer-not-to-say']"
          field="professionalBackground"
          :edit="editable"
          :data="application.equalityAndDiversitySurvey.professionalBackground"
          @changeField="changeEqualityAndDiversityInformation"
        />
      </dd>
    </div>
    
    <div 
      v-if="fieldContains(application.equalityAndDiversitySurvey.professionalBackground, 'other-professional-background')"
      class="govuk-summary-list__row"
    >
      <dt class="govuk-summary-list__key">
        Other Professional background details
      </dt>
      <dd
        class="govuk-summary-list__value"
      >
        <InformationReviewRenderer
          field="otherProfessionalBackgroundDetails"
          :edit="editable"
          :data="application.equalityAndDiversitySurvey.otherProfessionalBackgroundDetails"
          @changeField="changeEqualityAndDiversityInformation"
        />
      </dd>
    </div>

    <div
      v-if="isLegal"
      class="govuk-summary-list__row"
    >
      <dt class="govuk-summary-list__key">
        Current legal role
      </dt>
      <dd
        class="govuk-summary-list__value"
      >
        <span
          v-if="fieldContains(application.equalityAndDiversitySurvey.currentLegalRole, 'prefer-not-to-say') && !editable"
        >
          Prefer not to say
        </span>
        <InformationReviewRenderer
          v-else
          type="multi-selection"
          :options="['academic', 'barrister', 'cilex', 'solicitor', 'fee-paid-court-judge', 'fee-paid-tribunal-judge', 'other-fee-paid-judicial-office-holder', 'other-current-legal-role', 'salaried-court-judge', 'salaried-tribunal-judge', 'other-salaried-judicial-office-holder', 'prefer-not-to-say']"
          field="currentLegalRole"
          :edit="editable"
          :data="application.equalityAndDiversitySurvey.currentLegalRole"
          @changeField="changeEqualityAndDiversityInformation"
        />
      </dd>
    </div>

    <div 
      v-if="fieldContains(application.equalityAndDiversitySurvey.currentLegalRole, 'other-fee-paid-judicial-office-holder')"
      class="govuk-summary-list__row"
    >
      <dt class="govuk-summary-list__key">
        Other Fee-paid judicial office holder role details
      </dt>
      <dd
        class="govuk-summary-list__value"
      >
        <InformationReviewRenderer
          field="otherCurrentFeePaidJudicialOfficeHolderDetails"
          :edit="editable"
          :data="application.equalityAndDiversitySurvey.otherCurrentFeePaidJudicialOfficeHolderDetails"
          @changeField="changeEqualityAndDiversityInformation"
        />
      </dd>
    </div>
        
    <div 
      v-if="fieldContains(application.equalityAndDiversitySurvey.currentLegalRole, 'other-salaried-judicial-office-holder')"
      class="govuk-summary-list__row"
    >
      <dt class="govuk-summary-list__key">
        Other salaried judicial office holder role details
      </dt>
      <dd
        class="govuk-summary-list__value"
      >
        <InformationReviewRenderer
          field="otherCurrentSalariedJudicialOfficeHolderDetails"
          :edit="editable"
          :data="application.equalityAndDiversitySurvey.otherCurrentSalariedJudicialOfficeHolderDetails"
          @changeField="changeEqualityAndDiversityInformation"
        />
      </dd>
    </div>
        
    <div 
      v-if="fieldContains(application.equalityAndDiversitySurvey.currentLegalRole, 'other-current-legal-role')"
      class="govuk-summary-list__row"
    >
      <dt class="govuk-summary-list__key">
        Other current legal role details
      </dt>
      <dd
        class="govuk-summary-list__value"
      >
        <InformationReviewRenderer
          field="otherCurrentLegalRoleDetails"
          :edit="editable"
          :data="application.equalityAndDiversitySurvey.otherCurrentLegalRoleDetails"
          @changeField="changeEqualityAndDiversityInformation"
        />
      </dd>
    </div>

    <div class="govuk-summary-list__row">
      <dt class="govuk-summary-list__key">
        Held fee-paid judicial role
      </dt>
      <dd
        class="govuk-summary-list__value"
      >
        <span
          v-if="fieldContains(application.equalityAndDiversitySurvey.feePaidJudicialRole, 'prefer-not-to-say') && !editable"
        >
          Prefer not to say
        </span>
        <InformationReviewRenderer
          v-else
          type="selection"
          :options="[false, 'fee-paid-court-post', 'fee-paid-tribunal-post', 'other-fee-paid-judicial-office', 'prefer-not-to-say']"
          field="feePaidJudicialRole"
          :edit="editable"
          :data="application.equalityAndDiversitySurvey.feePaidJudicialRole"
          @changeField="changeEqualityAndDiversityInformation"
        />
      </dd>
    </div>

    <div 
      v-if="fieldContains(application.equalityAndDiversitySurvey.feePaidJudicialRole, 'other-fee-paid-judicial-office')"
      class="govuk-summary-list__row"
    >
      <dt class="govuk-summary-list__key">
        Other fee-paid judicial office details
      </dt>
      <dd
        class="govuk-summary-list__value"
      >
        <InformationReviewRenderer
          field="otherFeePaidJudicialRoleDetails"
          :edit="editable"
          :data="application.equalityAndDiversitySurvey.otherFeePaidJudicialRoleDetails"
          @changeField="changeEqualityAndDiversityInformation"
        />
      </dd>
    </div>

    <div class="govuk-summary-list__row">
      <dt class="govuk-summary-list__key">
        Attended state or fee-paying school
      </dt>
      <dd
        class="govuk-summary-list__value"
      >
        <span
          v-if="fieldContains(application.equalityAndDiversitySurvey.stateOrFeeSchool, 'prefer-not-to-say') && !editable"
        >
          Prefer not to say
        </span>
        <InformationReviewRenderer
          v-else
          type="selection"
          :options="['uk-state-selective', 'uk-state-non-selective', 'uk-independent-fee', 'non-uk-educated', 'prefer-not-to-say']"
          field="stateOrFeeSchool"
          :edit="editable"
          :data="application.equalityAndDiversitySurvey.stateOrFeeSchool"
          @changeField="changeEqualityAndDiversityInformation"
        />
      </dd>
    </div>

    <div class="govuk-summary-list__row">
      <dt class="govuk-summary-list__key">
        Attended Oxbridge universities
      </dt>
      <dd
        class="govuk-summary-list__value"
      >
        <span
          v-if="fieldContains(application.equalityAndDiversitySurvey.oxbridgeUni, 'prefer-not-to-say') && !editable"
        >
          Prefer not to say
        </span>
        <InformationReviewRenderer
          v-else
          type="selection"
          :options="[true, false, 'prefer-not-to-say']"
          field="oxbridgeUni"
          :edit="editable"
          :data="application.equalityAndDiversitySurvey.oxbridgeUni"
          @changeField="changeEqualityAndDiversityInformation"
        />
      </dd>
    </div>

    <div class="govuk-summary-list__row">
      <dt class="govuk-summary-list__key">
        First generation to go to university
      </dt>
      <dd
        class="govuk-summary-list__value"
      >
        <span
          v-if="fieldContains(application.equalityAndDiversitySurvey.firstGenerationStudent, 'prefer-not-to-say') && !editable"
        >
          Prefer not to say
        </span>
        <InformationReviewRenderer
          v-else
          type="selection"
          :options="[true, false, 'non-university-educated', 'prefer-not-to-say']"
          field="firstGenerationStudent"
          :edit="editable"
          :data="application.equalityAndDiversitySurvey.firstGenerationStudent"
          @changeField="changeEqualityAndDiversityInformation"
        />
      </dd>
    </div>

    <div class="govuk-summary-list__row">
      <dt class="govuk-summary-list__key">
        Ethnic group
      </dt>
      <dd
        class="govuk-summary-list__value"
      >
        <span
          v-if="fieldContains(application.equalityAndDiversitySurvey.ethnicGroup, 'prefer-not-to-say') && !editable"
        >
          Prefer not to say
        </span>
        <InformationReviewRenderer
          v-else
          type="selection"
          :options="['bangladeshi', 'chinese', 'indian', 'pakistani', 'other-asian', 'african', 'caribbean', 'other-black', 'uk-ethnic', 'irish', 'gypsy-irish-traveller', 'other-white', 'white-black-caribbean', 'white-black-african', 'white-asian', 'other-mixed', 'other-ethnic-group', 'prefer-not-to-say']"
          field="ethnicGroup"
          :edit="editable"
          :data="application.equalityAndDiversitySurvey.ethnicGroup"
          @changeField="changeEqualityAndDiversityInformation"
        />
      </dd>
    </div>
    
    <div 
      v-if="hasEthnicGroupDetails"
      class="govuk-summary-list__row"
    >
      <dt class="govuk-summary-list__key">
        Ethnicity
      </dt>
      <dd class="govuk-summary-list__value">
        <InformationReviewRenderer
          :field="ethnicGroupDetails"
          :edit="editable"
          :data="application.equalityAndDiversitySurvey[ethnicGroupDetails]"
          @changeField="changeEqualityAndDiversityInformation"
        />
      </dd>
    </div>

    <div class="govuk-summary-list__row">
      <dt class="govuk-summary-list__key">
        Sex
      </dt>
      <dd class="govuk-summary-list__value">
        <span
          v-if="fieldContains(application.equalityAndDiversitySurvey.gender, 'prefer-not-to-say') && !editable"
        >
          Prefer not to say
        </span>
        <InformationReviewRenderer
          v-else
          type="selection"
          :options="['female', 'male', 'gender-neutral', 'other-gender', 'prefer-not-to-say']"
          field="gender"
          :edit="editable"
          :data="application.equalityAndDiversitySurvey.gender"
          @changeField="changeEqualityAndDiversityInformation"
        />
      </dd>
    </div>

    <div 
      v-if="fieldContains(application.equalityAndDiversitySurvey.gender, 'other-gender')"
      class="govuk-summary-list__row"
    >
      <dt class="govuk-summary-list__key">
        Other sex
      </dt>
      <dd class="govuk-summary-list__value">
        <InformationReviewRenderer
          field="otherGenderDetails"
          :edit="editable"
          :data="application.equalityAndDiversitySurvey.otherGenderDetails"
          @changeField="changeEqualityAndDiversityInformation"
        />
      </dd>
    </div>

    <div class="govuk-summary-list__row">
      <dt class="govuk-summary-list__key">
        Gender is the same as sex assigned at birth
      </dt>
      <dd class="govuk-summary-list__value">
        <span
          v-if="fieldContains(application.equalityAndDiversitySurvey.changedGender, 'prefer-not-to-say') && !editable"
        >
          Prefer not to say
        </span>
        <InformationReviewRenderer
          v-else
          type="selection"
          :options="[true, false, 'prefer-not-to-say']"
          field="changedGender"
          :edit="editable"
          :data="application.equalityAndDiversitySurvey.changedGender"
          @changeField="changeEqualityAndDiversityInformation"
        />
      </dd>
    </div>

    <div 
      v-if="fieldContains(application.equalityAndDiversitySurvey.changedGender, false)"
      class="govuk-summary-list__row"
    >
      <dt class="govuk-summary-list__key">
        Gender identity
      </dt>
      <dd class="govuk-summary-list__value">
        <InformationReviewRenderer
          field="changedGender"
          :edit="editable"
          :data="application.equalityAndDiversitySurvey.genderIdentityDetails"
          @changeField="changeEqualityAndDiversityInformation"
        />
      </dd>
    </div>

    <div class="govuk-summary-list__row">
      <dt class="govuk-summary-list__key">
        Sexual orientation
      </dt>
      <dd class="govuk-summary-list__value">
        <span
          v-if="fieldContains(application.equalityAndDiversitySurvey.sexualOrientation, 'prefer-not-to-say') && !editable"
        >
          Prefer not to say
        </span>
        <InformationReviewRenderer
          v-else
          type="selection"
          :options="['bisexual', 'gay-man', 'gay-woman-lesbian', 'heterosexual-straight', 'other-sexual-orientation', 'prefer-not-to-say']"
          field="sexualOrientation"
          :edit="editable"
          :data="application.equalityAndDiversitySurvey.sexualOrientation"
          @changeField="changeEqualityAndDiversityInformation"
        />
      </dd>
    </div>

    <div 
      v-if="fieldContains(application.equalityAndDiversitySurvey.sexualOrientation, 'other-sexual-orientation')"
      class="govuk-summary-list__row"
    >
      <dt class="govuk-summary-list__key">
        Sexual orientation details
      </dt>
      <dd class="govuk-summary-list__value">
        <InformationReviewRenderer
          field="otherSexualOrientationDetails"
          :edit="editable"
          :data="application.equalityAndDiversitySurvey.otherSexualOrientationDetails"
          @changeField="changeEqualityAndDiversityInformation"
        />
      </dd>
    </div>

    <div class="govuk-summary-list__row">
      <dt class="govuk-summary-list__key">
        Disability
      </dt>
      <dd class="govuk-summary-list__value">
        <span
          v-if="fieldContains(application.equalityAndDiversitySurvey.disability, 'prefer-not-to-say') && !editable"
        >
          Prefer not to say
        </span>
        <InformationReviewRenderer
          v-else
          type="selection"
          :options="[true, false, 'prefer-not-to-say']"
          field="disability"
          :edit="editable"
          :data="application.equalityAndDiversitySurvey.disability"
          @changeField="changeEqualityAndDiversityInformation"
        />
      </dd>
    </div>

    <div 
      v-if="fieldContains(application.equalityAndDiversitySurvey.disability, true)"
      class="govuk-summary-list__row"
    >
      <dt class="govuk-summary-list__key">
        Disability details
      </dt>
      <dd class="govuk-summary-list__value">
        <InformationReviewRenderer
          field="disabilityDetails"
          :edit="editable"
          :data="application.equalityAndDiversitySurvey.disabilityDetails"
          @changeField="changeEqualityAndDiversityInformation"
        />
      </dd>
    </div>

    <div class="govuk-summary-list__row">
      <dt class="govuk-summary-list__key">
        Religion
      </dt>
      <dd class="govuk-summary-list__value">
        <span
          v-if="fieldContains(application.equalityAndDiversitySurvey.religionFaith, 'prefer-not-to-say') && !editable"
        >
          Prefer not to say
        </span>
        <InformationReviewRenderer
          v-else
          type="selection"
          :options="['no-religion', 'athiest', 'buddhist', 'christian', 'hindu', 'jewish', 'muslim', 'sikh', 'other-religion', 'prefer-not-to-say']"
          field="religionFaith"
          :edit="editable"
          :data="application.equalityAndDiversitySurvey.religionFaith"
          @changeField="changeEqualityAndDiversityInformation"
        />
      </dd>
    </div>

    <div 
      v-if="fieldContains(application.equalityAndDiversitySurvey.religionFaith, 'other-religion')"
      class="govuk-summary-list__row"
    >
      <dt class="govuk-summary-list__key">
        Other religion details
      </dt>
      <dd class="govuk-summary-list__value">
        <InformationReviewRenderer
          field="otherReligionDetails"
          :edit="editable"
          :data="application.equalityAndDiversitySurvey.otherReligionDetails"
          @changeField="changeEqualityAndDiversityInformation"
        />
      </dd>
    </div>
    
    <div class="govuk-summary-list__row">
      <dt class="govuk-summary-list__key">
        Attended outreach events
      </dt>
      <dd class="govuk-summary-list__value">
        <span
          v-if="fieldContains(application.equalityAndDiversitySurvey.attendedOutreachEvents, 'prefer-not-to-say') && !editable"
        >
          Prefer not to say
        </span>
        <InformationReviewRenderer
          v-else
          type="selection"
          :options="[true, false, 'prefer-not-to-say']"
          field="attendedOutreachEvents"
          :edit="editable"
          :data="application.equalityAndDiversitySurvey.attendedOutreachEvents"
          @changeField="changeEqualityAndDiversityInformation"
        />
      </dd>
    </div>
    
    <div 
      v-if="isLegal"
      class="govuk-summary-list__row"
    >
      <dt class="govuk-summary-list__key">
        Participated In judicial workshadowing Scheme
      </dt>
      <dd class="govuk-summary-list__value">
        <span
          v-if="fieldContains(application.equalityAndDiversitySurvey.participatedInJudicialWorkshadowingScheme, 'prefer-not-to-say') && !editable"
        >
          Prefer not to say
        </span>
        <InformationReviewRenderer
          v-else
          type="selection"
          :options="[true, false, 'prefer-not-to-say']"
          field="participatedInJudicialWorkshadowingScheme"
          :edit="editable"
          :data="application.equalityAndDiversitySurvey.participatedInJudicialWorkshadowingScheme"
          @changeField="changeEqualityAndDiversityInformation"
        />
      </dd>
    </div>

    <div 
      v-if="isLegal"
      class="govuk-summary-list__row"
    >
      <dt class="govuk-summary-list__key">
        Participated in Pre-Application Judicial Education Programme
      </dt>
      <dd class="govuk-summary-list__value">
        <span
          v-if="fieldContains(application.equalityAndDiversitySurvey.hasTakenPAJE, 'prefer-not-to-say') && !editable"
        >
          Prefer not to say
        </span>
        <InformationReviewRenderer
          v-else
          type="selection"
          :options="[true, false, 'prefer-not-to-say']"
          field="hasTakenPAJE"
          :edit="editable"
          :data="application.equalityAndDiversitySurvey.hasTakenPAJE"
          @changeField="changeEqualityAndDiversityInformation"
        />
      </dd>
    </div>
  </dl>
</template>
<script>
import InformationReviewRenderer from '@/components/Page/InformationReviewRenderer';

export default {
  name: 'PersonalDetailsSummary',
  components: {
    InformationReviewRenderer,
  },
  props: {
    application: {
      type: Object,
      required: true,
      default: () => {},
    },
    editable: {
      type: [Boolean, Function, Promise],
      required: true,
      default: false,
    },
    isLegal: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    applicationId() {
      return this.$route.params.applicationId;
    },
    hasEthnicGroupDetails() {
      return this.application &&
        this.application.equalityAndDiversitySurvey &&
        this.application.equalityAndDiversitySurvey.ethnicGroup &&
        this.application.equalityAndDiversitySurvey.ethnicGroup.startsWith('other-');
    },
    ethnicGroupDetails() {
      switch (this.application.equalityAndDiversitySurvey.ethnicGroup) {
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
      if (field === item) {
        return true;
      }
      if (Array.isArray(field) && field.includes(item)) {
        return true;
      }
      return false;
    },
    changeEqualityAndDiversityInformation(objChanged) {
      const myEqualityAndDiversityInfo = { ...this.application.equalityAndDiversitySurvey, ...objChanged };
      this.$store.dispatch('application/update', { data: { equalityAndDiversitySurvey: myEqualityAndDiversityInfo }, id: this.applicationId });
      this.$store.dispatch('candidates/saveEqualityAndDiversityInfo', { data: objChanged, id: this.application.userId });
    },
  },
};
</script>
