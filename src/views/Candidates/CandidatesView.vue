<template>
  <div>
    <h1
      class="govuk-heading-xl govuk-!-margin-bottom-6"
    >
      Candidate: {{ myFullName }}
    </h1>
    <TabsList
      :tabs="tabs"
      :active-tab.sync="activeTab"
    />

    <div
      v-if="activeTab === 'details'"
    >
      <PersonalDetails
        :candidate="personalDetails"
        @changedetails="updateCandidate"
      />
      <h2 class="govuk-heading-l">
        Character information
      </h2>

      <dl v-if="displayNewCharacterInformation && characterInformation">
        <CriminalOffencesSummary
          :character-information="characterInformation"
          :required-wider-column="false"
        />
        <FixedPenaltiesSummary
          :character-information="characterInformation"
          :required-wider-column="false"
        />
        <MotoringOffencesSummary
          :character-information="characterInformation"
          :required-wider-column="false"
        />
        <FinancialMattersSummary
          :character-information="characterInformation"
          :required-wider-column="false"
        />
        <ProfessionalConductSummary
          :character-information="characterInformation"
          :required-wider-column="false"
        />
        <FurtherInformationSummary
          :character-information="characterInformation"
          :required-wider-column="false"
        />
        <CharacterDeclarationSummary
          :character-information="characterInformation"
          :required-wider-column="false"
        />
      </dl>
      <dl v-else>
        <CharacterInformationSummaryV1
          :character-information="characterInformation"
          :required-wider-column="false"
        />
      </dl>

      <EqualityAndDiversity
        :data="equalityAndDiversity"
      />
    </div>

    <div
      v-if="activeTab === 'notes'"
    >
      <Notes
        title="Notes about the Candidate"
        :candidate-id="getUserId"
      />
    </div>

    <div
      v-if="activeTab === 'applications'"
    >
      <Applications :candidate-id="candidateId" />
    </div>
    <div
      v-if="activeTab === 'actions' && authorisedUser"
    >
      <Actions :candidate-id="getUserId" />
    </div>
  </div>
</template>

<script>
import firebase from '@firebase/app';
import TabsList from '@jac-uk/jac-kit/draftComponents/TabsList';
import PersonalDetails from '@jac-uk/jac-kit/draftComponents/Candidates/PersonalDetails';
import EqualityAndDiversity from '@jac-uk/jac-kit/draftComponents/Candidates/EqualityAndDiversity';
import Notes from '@/components/Notes/Notes';
import Applications from '@jac-uk/jac-kit/draftComponents/Candidates/Applications';
import CriminalOffencesSummary from '@/views/InformationReview/CriminalOffencesSummary';
import FixedPenaltiesSummary from '@/views/InformationReview/FixedPenaltiesSummary';
import MotoringOffencesSummary from '@/views/InformationReview/MotoringOffencesSummary';
import FinancialMattersSummary from '@/views/InformationReview/FinancialMattersSummary';
import ProfessionalConductSummary from '@/views/InformationReview/ProfessionalConductSummary';
import FurtherInformationSummary from '@/views/InformationReview/FurtherInformationSummary';
import CharacterDeclarationSummary from '@/views/InformationReview/CharacterDeclarationSummary';
import CharacterInformationSummaryV1 from '@/views/Exercises/Applications/CharacterInformationSummaryV1.vue';
import Actions from '@/views/Candidates/Actions';
import { authorisedToPerformAction }  from '@/helpers/authUsers';

export default {
  components: {
    TabsList,
    PersonalDetails,
    EqualityAndDiversity,
    Notes,
    Applications,
    CriminalOffencesSummary,
    FixedPenaltiesSummary,
    MotoringOffencesSummary,
    FinancialMattersSummary,
    ProfessionalConductSummary,
    FurtherInformationSummary,
    CharacterDeclarationSummary,
    CharacterInformationSummaryV1,
    Actions,
  },
  data() {
    return {
      authorisedToPerformAction: false,
      tabs: [
        {
          ref: 'details',
          title: 'Details',
        },
        {
          ref: 'notes',
          title: 'Notes',
        },
        {
          ref: 'applications',
          title: 'Applications',
        },
        {
          ref: 'actions',
          title: 'Actions',
        },
      ],
      activeTab: 'details',
      candidateId: '',
    };
  },
  computed: {
    authorisedUser(){
      return this.authorisedToPerformAction;
    },
    candidateRecord() {
      return this.$store.state.candidates.record;
    },
    personalDetails() {
      const localDocs = this.$store.state.candidates.personalDetails;
      return localDocs || {};
    },
    characterInformation() {
      const localDocs = this.$store.state.candidates.characterInformation;
      return localDocs || {};
    },
    equalityAndDiversity() {
      const localDocs = this.$store.state.candidates.equalityAndDiversitySurvey;
      return localDocs || {};
    },
    myFullName() {
      return this.personalDetails ? this.personalDetails.fullName : this.candidateRecord.fullName;
    },
    getUserId() {
      return this.$route.params.id || '';
    },
    displayNewCharacterInformation() {
      return this.characterInformation._versionNumber === 2;
    },
  },
  async created() {
    this.candidateId = this.getUserId;
    this.$store.dispatch('candidates/bindDoc', this.candidateId);
    this.$store.dispatch('candidates/bindDocs', this.candidateId);
    const email = firebase.auth().currentUser.email;
    this.authorisedToPerformAction = await authorisedToPerformAction(email);
  },
  destroyed() {
    this.$store.dispatch('candidates/unbindDoc');
    this.$store.dispatch('candidates/unbindDocs');
  },
  methods: {
    makeFullName(obj) {
      if (obj.firstName && this.personalDetails.lastName) {
        obj.fullName = `${obj.firstName} ${this.personalDetails.lastName}`;
      }
      if (obj.lastName && this.personalDetails.firstName) {
        obj.fullName = `${this.personalDetails.firstName} ${obj.lastName}`;
      }
      return obj;
    },
    updateCandidate(obj) {
      this.makeFullName(obj);
      this.$store.dispatch('candidates/savePersonalDetails', { data: obj, id: this.candidateId });
    },
  },
};
</script>
