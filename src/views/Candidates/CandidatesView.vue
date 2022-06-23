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
    <span
      class="float-right govuk-!-margin-left-4"
    >
      <button
        v-if="editMode"
        class="govuk-button govuk-button btn-unlock"
        @click="toggleEdit"
      >
        Done
      </button>
      <button
        v-else
        class="govuk-button govuk-button--secondary btn-mark-as-applied"
        @click="toggleEdit"
      >
        Edit
      </button>
    </span>

    <div
      v-if="activeTab === 'details'"
    >
      <PersonalDetailsSummary
        :personal-details="personalDetails"
        :editable="editMode"
        @update="updateCandidate"
      />
      <dl v-if="characterInformation">
        <CharacterInformationSummary
          :editable="false"
          :character-information="characterInformation || {}"
          :version="characterInformationVersion"
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
import Notes from '@/components/Notes/Notes';
import Applications from '@jac-uk/jac-kit/draftComponents/Candidates/Applications';
import PersonalDetailsSummary from '@/views/InformationReview/PersonalDetailsSummary';
import CharacterInformationSummary from '@/views/InformationReview/CharacterInformationSummary';
import EqualityAndDiversity from '@jac-uk/jac-kit/draftComponents/Candidates/EqualityAndDiversity';
import Actions from '@/views/Candidates/Actions';
import { authorisedToPerformAction } from '@/helpers/authUsers';

export default {
  components: {
    TabsList,
    Notes,
    Applications,
    Actions,
    PersonalDetailsSummary,
    CharacterInformationSummary,
    EqualityAndDiversity,
  },
  data () {
    return {
      authorisedToPerformAction: false,
      editMode: false,
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
    authorisedUser () {
      return this.authorisedToPerformAction;
    },
    candidateRecord () {
      return this.$store.state.candidates.record;
    },
    personalDetails () {
      const localDocs = this.$store.state.candidates.personalDetails;
      return localDocs || {};
    },
    characterInformation () {
      const localDocs = this.$store.state.candidates.characterInformation;
      return localDocs || {};
    },
    characterInformationVersion () {
      return this.characterInformation._versionNumber ? this.characterInformation._versionNumber : 1;
    },
    equalityAndDiversity () {
      const localDocs = this.$store.state.candidates.equalityAndDiversitySurvey;
      return localDocs || {};
    },
    myFullName () {
      return this.personalDetails ? this.personalDetails.fullName : this.candidateRecord.fullName;
    },
    getUserId () {
      return this.$route.params.id || '';
    },
  },
  async created () {
    this.candidateId = this.getUserId;
    this.$store.dispatch('candidates/bindDoc', this.candidateId);
    this.$store.dispatch('candidates/bindDocs', this.candidateId);
    const email = firebase.auth().currentUser.email;
    this.authorisedToPerformAction = await authorisedToPerformAction(email);
  },
  destroyed () {
    this.$store.dispatch('candidates/unbindDoc');
    this.$store.dispatch('candidates/unbindDocs');
  },
  methods: {
    makeFullName (obj) {
      if (obj.firstName && this.personalDetails.lastName) {
        obj.fullName = `${obj.firstName} ${this.personalDetails.lastName}`;
      }
      if (obj.lastName && this.personalDetails.firstName) {
        obj.fullName = `${this.personalDetails.firstName} ${obj.lastName}`;
      }
      return obj;
    },
    updateCandidate (obj) {
      this.makeFullName(obj);
      this.$store.dispatch('candidates/savePersonalDetails', { data: obj, id: this.candidateId });
    },
    toggleEdit () {
      this.editMode = !this.editMode;
    },
  },
};
</script>
