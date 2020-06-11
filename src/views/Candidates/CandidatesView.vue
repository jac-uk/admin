<template>
  <div>
    <h1
      class="govuk-heading-xl govuk-!-margin-bottom-6"
    >
      Candidate: {{ fullName }}
    </h1>

    <TabsList
      :tabs="tabs"
      :active-tab.sync="activeTab"
    />

    <div 
      v-if="activeTab === 'details'"
    >
      <PersonalDetails 
        :data="personalDetails" 
      />
      <CharacterInformation 
        :data="characterInformation" 
      />
      <EqualityAndDiversity 
        :data="equalityAndDiversity" 
      />
    </div>

    <div 
      v-if="activeTab === 'applications'"
    >
      This functionality is not available yet
    </div>
  </div>
</template>

<script>
import TabsList from '@/components/Page/TabsList';
import PersonalDetails from '@/components/Candidates/PersonalDetails';
import CharacterInformation from '@/components/Candidates/CharacterInformation';
import EqualityAndDiversity from '@/components/Candidates/EqualityAndDiversity';

export default {
  components: {
    TabsList,
    PersonalDetails,
    CharacterInformation,
    EqualityAndDiversity,
  },
  data() {
    return {
      tabs: [
        {
          ref: 'details',
          title: 'Details',
        },
        {
          ref: 'applications',
          title: 'Applications',
        },
      ],
      activeTab: 'details',
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
    fullName() {
      return this.personalDetails.fullName ? this.personalDetails.fullName : this.candidateRecords.fullName;
    },
  },
  created() {
    const id = this.$route.params.id || '';
    this.$store.dispatch('candidates/bind', id);
    this.$store.dispatch('candidates/bindDocs', id);
  },
};
</script>
