<template>
  <div>
    <h1
      class="govuk-heading-xl govuk-!-margin-bottom-6"
    >
      Candidate: {{ myFullName }} {{ isFlaggedCandidate ? '*' : '' }}
    </h1>
    <TabsList
      :tabs="tabs"
      :active-tab.sync="activeTab"
    />
    <span
      v-if="hasPermissions([PERMISSIONS.candidates.permissions.canUpdateCandidates.value])"
      class="float-right govuk-!-margin-left-4"
    >
      <template v-if="activeTab === 'details'">
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
      </template>
      <button
        v-if="activeTab === 'notes' && candidateRecord && hasPermissions([PERMISSIONS.candidates.permissions.canFlagCandidates.value])"
        class="govuk-button govuk-button--secondary"
        @click="toggleFlaggedCandidate"
      >
        {{ candidateRecord.isFlaggedCandidate ? 'Un-Flag Candidate' : 'Flag Candidate' }}
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
        :can-create="hasPermissions([PERMISSIONS.notes.permissions.canCreateNotes.value])"
      />
    </div>

    <div
      v-if="activeTab === 'applications'"
    >
      <Applications :candidate-id="candidateId" />
    </div>
    <div
      v-if="activeTab === 'loginEmail'"
    >
      <UpdateLoginEmail :candidate-id="getUserId" />
    </div>
  </div>
</template>

<script>
import TabsList from '@jac-uk/jac-kit/draftComponents/TabsList';
import Notes from '@/components/Notes/Notes';
import Applications from '@jac-uk/jac-kit/draftComponents/Candidates/Applications';
import PersonalDetailsSummary from '@/views/InformationReview/PersonalDetailsSummary';
import CharacterInformationSummary from '@/views/InformationReview/CharacterInformationSummary';
import EqualityAndDiversity from '@jac-uk/jac-kit/draftComponents/Candidates/EqualityAndDiversity';
import UpdateLoginEmail from '@/views/Candidates/UpdateLoginEmail';
import permissionMixin from '@/permissionMixin';

export default {
  name: 'CandidatesView',
  components: {
    TabsList,
    Notes,
    Applications,
    UpdateLoginEmail,
    PersonalDetailsSummary,
    CharacterInformationSummary,
    EqualityAndDiversity,
  },
  mixins: [permissionMixin],
  data() {
    return {
      editMode: false,
      activeTab: 'details',
      candidateId: '',
    };
  },
  computed: {
    tabs() {
      const tabs = [
        {
          ref: 'details',
          title: 'Details',
        },
      ];
      if (this.hasPermissions([this.PERMISSIONS.notes.permissions.canReadNotes.value]))
        tabs.push({
          ref: 'notes',
          title: 'Notes',
        });
      if (this.hasPermissions([this.PERMISSIONS.applications.permissions.canReadApplications.value]))
        tabs.push({
          ref: 'applications',
          title: 'Applications',
        });
      if (this.hasPermissions([this.PERMISSIONS.candidates.permissions.canUpdateCandidates.value]))
        tabs.push({
          ref: 'loginEmail',
          title: 'Log in Email',
        });
      return tabs;
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
    characterInformationVersion() {
      return this.characterInformation._versionNumber ? this.characterInformation._versionNumber : 1;
    },
    equalityAndDiversity() {
      const localDocs = this.$store.state.candidates.equalityAndDiversitySurvey;
      return localDocs || {};
    },
    myFullName() {
      return this.personalDetails ? this.personalDetails.fullName : this.candidateRecord.fullName;
    },
    isFlaggedCandidate() {
      return this.candidateRecord && this.candidateRecord.isFlaggedCandidate;
    },
    getUserId() {
      return this.$route.params.id || '';
    },
  },
  async created() {
    this.candidateId = this.getUserId;
    this.$store.dispatch('candidates/bindDoc', this.candidateId);
    this.$store.dispatch('candidates/bindDocs', this.candidateId);
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
    toggleEdit(){
      this.editMode = !this.editMode;
    },
    toggleFlaggedCandidate() {
      this.$store.dispatch('candidates/save', {
        isFlaggedCandidate: !this.isFlaggedCandidate,
      });
    },
  },
};
</script>
