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
      <ExercisesList :candidate-id="candidateId" />
    </div>
  </div>
</template>

<script>
import TabsList from '@/components/Page/TabsList';
import PersonalDetails from '@/components/Candidates/PersonalDetails';
import CharacterInformation from '@/components/Candidates/CharacterInformation';
import EqualityAndDiversity from '@/components/Candidates/EqualityAndDiversity';
import Notes from '@/components/Notes/Notes';
import ExercisesList from '@/components/ExercisesList';

export default {
  components: {
    TabsList,
    PersonalDetails,
    CharacterInformation,
    EqualityAndDiversity,
    Notes,
    ExercisesList,
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
    candidateRecords() {
      const localRecords = this.$store.state.candidates.records;
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
      return this.personalDetails ? this.personalDetails.fullName : this.candidateRecords.fullName;
    },
    getUserId() {
      return this.$route.params.id || '';
    },
  },
  created() {
    this.candidateId = this.getUserId;
    this.$store.dispatch('candidates/bind', this.candidateId);
    this.$store.dispatch('candidates/bindDocs', this.candidateId);
  },
  methods: {
    updateCandidate(obj) {
      this.$store.dispatch('candidates/savePersonalDetails', { data: obj, id: this.candidateId });
    },
  },
};
</script>
