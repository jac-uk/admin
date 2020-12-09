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
      <CharacterInformation
        :data="characterInformation"
      />
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
  </div>
</template>

<script>
import TabsList from '@jac-uk/jac-kit/draftComponents/TabsList';
import PersonalDetails from '@jac-uk/jac-kit/draftComponents/Candidates/PersonalDetails';
import CharacterInformation from '@jac-uk/jac-kit/draftComponents/Candidates/CharacterInformation';
import EqualityAndDiversity from '@jac-uk/jac-kit/draftComponents/Candidates/EqualityAndDiversity';
import Notes from '@/components/Notes/Notes';
import Applications from '@jac-uk/jac-kit/draftComponents/Candidates/Applications';

export default {
  components: {
    TabsList,
    PersonalDetails,
    CharacterInformation,
    EqualityAndDiversity,
    Notes,
    Applications,
  },
  data() {
    return {
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
      ],
      activeTab: 'details',
      candidateId: '',
    };
  },
  computed: {
    candidateRecord() {
      const localRecords = this.$store.state.candidates.record;
      return localRecords;
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
  },
  created() {
    this.candidateId = this.getUserId;
    this.$store.dispatch('candidates/bindDoc', this.candidateId);
    this.$store.dispatch('candidates/bindDocs', this.candidateId);
  },
  destroyed() {
    this.$store.dispatch('candidates/unbindDoc');
    this.$store.dispatch('candidates/unbindDocs');
  },
  methods: {
    updateCandidate(obj) {
      this.$store.dispatch('candidates/savePersonalDetails', { data: obj, id: this.candidateId });
    },
  },
};
</script>
