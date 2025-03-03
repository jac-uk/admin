<template>
  <div
    v-if="application"
    class="govuk-grid-row"
  >
    <div class="govuk-grid-column-full">
      <div
        v-if="applications.length"
        class="text-center"
      >
        <ul class="moj-pagination__list">
          <li
            class="moj-pagination__item  moj-pagination__item--prev"
            @click="previousApplication"
          >
            <a class="moj-pagination__link govuk-link">Previous<span class="govuk-visually-hidden"> set of pages</span></a>
          </li>
          <li
            class="moj-pagination__item  moj-pagination__item--next"
            @click="nextApplication"
          >
            <a class="moj-pagination__link govuk-link">Next<span class="govuk-visually-hidden"> set of pages</span></a>
          </li>
        </ul>
      </div>

      <div id="panel-pack-div">
        <div class="govuk-grid-row">
          <div class="govuk-grid-column-one-half">
            <span class="govuk-caption-l">
              {{ application._language === 'cym' ? 'Application (Welsh)' : 'Application' }}
            </span>
            <h1 class="govuk-heading-l govuk-!-margin-bottom-4">
              {{ applicationReferenceNumber }} {{ candidateRecord && candidateRecord.isFlaggedCandidate ? '*' : '' }}
            </h1>
          </div>

          <div class="govuk-grid-column-one-half text-right print-none">
            <span
              v-if="activeTab == 'full' && hasPermissions([PERMISSIONS.applications.permissions.canUpdateApplications.value])"
            >
              <span
                class="govuk-!-margin-left-4"
              >
                <button
                  v-if="isApplied && !isWithdrawn"
                  class="govuk-button govuk-button--warning govuk-!-margin-right-2"
                  @click="$refs.modalRefWithdrawApplication.openModal()"
                >
                  Withdraw Application
                </button>
                <button
                  v-if="isApplied"
                  class="govuk-button btn-unlock"
                  @click="unlock"
                >
                  Move to Draft
                </button>
                <button
                  v-else
                  class="govuk-button btn-mark-as-applied"
                  @click="submitApplication"
                >
                  Mark as applied
                </button>
              </span>
              <span
                class="govuk-!-margin-left-4 govuk-!-margin-right-4"
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
            </span>
            <div class="moj-button-menu">
              <button
                ref="dropDownRef"
                class="govuk-button moj-button-menu__toggle-button govuk-button--secondary moj-button-menu__toggle-button--secondary"
                type="button"
                aria-haspopup="true"
                :aria-expanded="dropDownExpanded.toString()"
                @click="toggleExpand"
              >
                Actions
              </button>
              <div
                class="moj-button-menu__wrapper moj-button-menu__wrapper--right"
                role="menu"
              >
                <button
                  class="govuk-button govuk-button--secondary drop-down-button"
                  @click="downloadPage"
                >
                  Download Page
                </button>
                <button
                  id="clipboard-button"
                  class="govuk-button govuk-button--secondary drop-down-button"
                  @click="copyToClipboard"
                >
                  Copy to clipboard
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="govuk-grid-row">
          <div class="govuk-grid-column-one-third">
            <div class="panel govuk-!-margin-bottom-7 govuk-!-padding-4 background-light-grey">
              <span class="govuk-caption-m">
                Created on
              </span>
              <h2 class="govuk-heading-m govuk-!-margin-bottom-0">
                {{ $filters.showAlternative($filters.formatDate(application.createdAt), 'Unknown') }}
              </h2>
            </div>
          </div>

          <div class="govuk-grid-column-one-third">
            <div
              v-if="isApplied"
              class="panel govuk-!-margin-bottom-7 background-light-grey"
            >
              <span class="govuk-caption-m">Submitted on</span>
              <h2
                class="govuk-heading-m govuk-!-margin-bottom-0"
              >
                {{ $filters.showAlternative($filters.formatDate(application.appliedAt), 'Unknown') }}
              </h2>
            </div>
            <div
              v-else
              class="panel govuk-!-margin-bottom-7 background-light-grey"
            >
              <span class="govuk-caption-m">Status</span>
              <h2
                class="govuk-heading-m govuk-!-margin-bottom-0"
              >
                {{ $filters.lookup(application.status) }}
              </h2>
            </div>
          </div>

          <div class="govuk-grid-column-one-third">
            <div class="panel govuk-!-margin-bottom-7 background-light-grey">
              <span class="govuk-caption-m">
                Extension
              </span>
              <button
                v-if="application.dateExtension && hasPermissions([PERMISSIONS.applications.permissions.canUpdateApplications.value])"
                @click="$refs.modalRefExtension.openModal()"
              >
                Change
              </button>
              <h2
                v-if="application.dateExtension"
                class="govuk-heading-m govuk-!-margin-bottom-0"
              >
                {{ $filters.showAlternative($filters.formatDate(application.dateExtension), 'Unknown') }}
              </h2>
              <button
                v-else-if="hasPermissions([PERMISSIONS.applications.permissions.canUpdateApplications.value, PERMISSIONS.notes.permissions.canCreateNotes.value])"
                class="govuk-button govuk-!-margin-bottom-0"
                @click="$refs.modalRefExtension.openModal()"
              >
                Give Extension
              </button>
            </div>
          </div>
        </div>

        <Modal
          ref="modalRefExtension"
        >
          <component
            :is="`SubmissionExtension`"
            v-bind="{ applicationId: applicationId, userId: application.userId, dateExtension: application.dateExtension }"
            @close="$refs.modalRefExtension.closeModal()"
          />
        </Modal>

        <Modal
          ref="modalRefWithdrawApplication"
        >
          <ModalInner
            title="Withdraw Application"
            message="Are you sure you want to set this application as withdrawn?"
            @close="$refs.modalRefWithdrawApplication.closeModal()"
            @confirmed="confirmWithdraw"
          />
        </Modal>

        <TabsList
          v-model:active-tab="activeTab"
          :tabs="tabs"
          class="print-none"
        />
        <div
          v-if="activeTab == 'full' || activeTab == 'panel'"
          class="application-details"
        >
          <div v-if="application && exercise">
            <PersonalDetailsSummary
              :user-id="application.userId"
              :personal-details="application.personalDetails || {}"
              :editable="editable"
              :is-asked="isApplicationPartAsked('personalDetails')"
              :is-character-checks-asked="isCharacterChecksAsked"
              @update="changePersonalDetails"
            />
            <CharacterInformationSummary
              :editable="editable"
              :character-information="correctCharacterInformation"
              :version="characterInformationVersion"
              :is-asked="isApplicationPartAsked('characterInformation')"
              @update-application="changeApplication"
            />
            <EqualityAndDiversityInformationSummary
              :application="application"
              :equality-and-diversity-survey="application.equalityAndDiversitySurvey || {}"
              :editable="editable"
              :is-asked="isApplicationPartAsked('equalityAndDiversitySurvey')"
              @update-application="changeApplication"
            />

            <PreferencesSummary
              :application="application"
              :exercise="exercise"
              :editable="editable"
              :is-panel-view="isPanelView"
              @update-application="changeApplication"
            />

            <QualificationsAndMembershipsSummary
              :application="application"
              :exercise="exercise"
              :editable="editable"
              @update-application="changeApplication"
            />
            <ExperienceSummary
              :application="application"
              :exercise="exercise"
              :editable="editable"
              :is-panel-view="isPanelView"
              @update-application="changeApplication"
            />
            <AssessorsSummary
              :application="application"
              :application-id="applicationId"
              :exercise="exercise"
              :editable="editable"
            />
            <AssessmentsSummary
              :application="application"
              :exercise="exercise"
              :editable="editable"
              :authorised-to-perform-action="editable"
              @update-application="changeApplication"
            />
            <CommissionerConflictsSummary
              :application="application"
              :exercise="exercise"
              :editable="editable"
              @update-application="changeApplication"
            />
            <ResignationFromDWPSummary
              v-if="isJAC00187"
              :application="application"
              :exercise="exercise"
              :editable="editable"
              @update-application="changeApplication"
            />
          </div>
        </div>

        <div v-if="activeTab == 'characterchecks'">
          <CharacterChecks
            :application="application"
            :exercise="exercise"
          />
        </div>

        <div v-if="activeTab == 'issues'">
          No issues found
        </div>

        <div v-if="activeTab == 'agency'">
          <AgencyReport />
        </div>

        <div v-if="activeTab == 'notes'">
          <Notes
            title="Notes about the Application"
            :candidate-id="application.userId"
            :application-id="applicationId"
            :can-create="hasPermissions([PERMISSIONS.notes.permissions.canCreateNotes.value])"
          />
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <PageNotFound
      page="Application"
    />
  </div>
</template>

<script>
import TabsList from '@jac-uk/jac-kit/draftComponents/TabsList.vue';
import AgencyReport from './AgencyReport.vue';
import EventRenderer from '@jac-uk/jac-kit/draftComponents/EventRenderer.vue';
import Modal from '@jac-uk/jac-kit/components/Modal/Modal.vue';
import ModalInner from '@jac-uk/jac-kit/components/Modal/ModalInner.vue';
import SubmissionExtension from '@/components/ModalViews/SubmissionExtension.vue';
import Notes from '@/components/Notes/Notes.vue';
import PersonalDetailsSummary from '@/views/InformationReview/PersonalDetailsSummary.vue';
import CharacterInformationSummary from '@/views/InformationReview/CharacterInformationSummary.vue';
import EqualityAndDiversityInformationSummary from '@/views/InformationReview/EqualityAndDiversityInformationSummary.vue';
import PreferencesSummary from '@/views/InformationReview/PreferencesSummary.vue';
import QualificationsAndMembershipsSummary from '@/views/InformationReview/QualificationsAndMembershipsSummary.vue';
import ExperienceSummary from '@/views/InformationReview/ExperienceSummary.vue';
import AssessmentsSummary from '@/views/InformationReview/AssessmentsSummary.vue';
import AssessorsSummary from '@/views/InformationReview/AssessorsSummary.vue';
import CommissionerConflictsSummary from '@/views/InformationReview/CommissionerConflictsSummary.vue';
import ResignationFromDWPSummary from '@/views/InformationReview/ResignationFromDWPSummary.vue';
import InformationReviewRenderer from '@/components/Page/InformationReviewRenderer.vue';
import PageNotFound from '@/views/Errors/PageNotFound.vue';
import { splitFullName } from '@jac-uk/jac-kit/helpers/splitFullName';
import { logEvent } from '@/helpers/logEvent';
import CharacterChecks from '@/views/Exercise/Tasks/CharacterChecks.vue';
import {
  isLegal,
  isNonLegal,
  hasStatementOfSuitability,
  hasIndependentAssessments,
  isApplicationPartAsked,
  isCharacterChecksAsked,
  isJAC00187
} from '@/helpers/exerciseHelper';
import permissionMixin from '@/permissionMixin';
import { httpsCallable } from '@firebase/functions';
import { functions } from '@/firebase';

export default {
  name: 'Application',
  components: {
    TabsList,
    AgencyReport,
    EventRenderer,
    Modal,
    ModalInner,
    SubmissionExtension,
    Notes,
    PageNotFound,
    InformationReviewRenderer,
    CharacterChecks,
    PersonalDetailsSummary,
    CharacterInformationSummary,
    EqualityAndDiversityInformationSummary,
    PreferencesSummary,
    QualificationsAndMembershipsSummary,
    ExperienceSummary,
    AssessmentsSummary,
    AssessorsSummary,
    CommissionerConflictsSummary,
    ResignationFromDWPSummary,
  },
  mixins: [permissionMixin],
  data() {
    return {
      editMode: false,
      activeTab: 'full',
      dropDownExpanded: false,
    };
  },
  computed: {
    tabs() {
      const tabs = [
        {
          ref: 'full',
          title: 'Full information',
        },
      ];
      if (this.hasPermissions([this.PERMISSIONS.notes.permissions.canReadNotes.value])) {
        tabs.push({
          ref: 'notes',
          title: 'Notes',
        });
      }
      if (this.hasPermissions([this.PERMISSIONS.panels.permissions.canReadPanels.value])) {
        tabs.push({
          ref: 'panel',
          title: 'Panel pack',
        });
      }
      tabs.push(
        {
          ref: 'issues',
          title: 'Issues',
        },
        {
          ref: 'agency',
          title: 'Agency report',
        },
        {
          ref: 'characterchecks',
          title: 'Character checks',
        }
      );
      return tabs;
    },
    editable() {
      return this.editMode && this.hasPermissions([this.PERMISSIONS.applications.permissions.canUpdateApplications.value]);
    },
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    candidateRecord() {
      return this.$store.state.candidates.record;
    },
    isLegal() {
      return isLegal(this.exercise);
    },
    isNonLegal() {
      return isNonLegal(this.exercise);
    },
    correctCharacterInformation() {
      if (this.characterInformationVersion === 3) {
        return this.application.characterInformationV3 || {};
      } else if (this.applicationVersion >= 2) {
        return this.application.characterInformationV2 || {};
      } else {
        return this.application.characterInformation || {};
      }
    },
    hasStatementOfSuitability() {
      return hasStatementOfSuitability(this.exercise);
    },
    hasIndependentAssessments() {
      return hasIndependentAssessments(this.exercise);
    },
    applicationVersion() {
      return this.exercise._applicationVersion || 1;
    },
    characterInformationVersion() {
      // All exercises launching on or after 15/10/24 use the V3 Character questions
      if (this.exercise.applicationOpenDate > new Date('2024-10-15')) {
        return 3;
      }
      return this.applicationVersion >= 2 ? 2 : 1;
    },
    applications() {
      return this.$store.state.applications.records;
    },
    application() {
      return this.$store.getters['application/data']();
    },
    applicationId() {
      return this.$route.params.applicationId;
    },
    applicationReferenceNumber() {
      return this.$store.state.application.record ? this.$store.state.application.record.referenceNumber : null;
    },
    isPanelView() {
      return this.activeTab === 'panel';
    },
    isApplied() {
      if (this.application) {
        switch (this.application.status) {
        case 'applied':
          return true;
        default:
          return false;
        }
      }
      return false;
    },
    isWithdrawn() {
      if (this.application) {
        switch (this.application.status) {
        case 'withdrawn':
          return true;
        default:
          return false;
        }
      }
      return false;
    },
    title() {
      let title = this.application.personalDetails.title;
      if (!title) {
        title = '';
      }
      return title;
    },
    firstName() {
      let firstName = this.application.personalDetails.firstName;
      const fullName = this.application.personalDetails.fullName;
      if (!firstName) {
        if (fullName) {
          const result = splitFullName(fullName);
          firstName = result[0];
        } else {
          firstName = '';
        }
      }
      return firstName;
    },
    lastName() {
      let lastName = this.application.personalDetails.lastName;
      const fullName = this.application.personalDetails.fullName;
      if (!lastName) {
        if (fullName) {
          const result = splitFullName(fullName);
          lastName = result[1];
        } else {
          lastName = '';
        }
      }
      return lastName;
    },
    candidateId() {
      return this.application ? this.application.userId : null;
    },
    isCharacterChecksAsked() {
      return this.application && isCharacterChecksAsked(this.application);
    },
    isJAC00187() {
      const env = this.$store.getters.appEnvironment;
      return isJAC00187(env, this.application.exerciseRef);
    },
    uploadPath() {
      return `/exercise/${this.exercise.id}/user/${this.application.userId}`;
    },
    templatePath() {
      return `exercise/${this.exercise.id}/${this.exercise.downloads.candidateAssessementForms[0].file}`;
    },
    documentPath() {
      const path = `${this.uploadPath}/${this.application.uploadedSelfAssessment}`;
      return path.substring(1);
    },
  },
  watch: {
    '$route.params.applicationId'() {
      this.pageLoad();
    },
  },
  created() {
    this.pageLoad();
  },
  unmounted() {
    this.$store.dispatch('application/unbind');
    this.$store.dispatch('candidates/unbindDoc');
  },
  methods: {
    async pageLoad() {
      if (this.$route.query.tab) {
        this.activeTab = this.$route.query.tab;
      }
      if (this.$route.hash) {  // @TODO move this to within TabsList component
        this.activeTab = this.$route.hash.substring(1);
      }
      if (this.applicationId && (!this.application || this.$store.state.application.record.id !== this.applicationId)) {
        await this.$store.dispatch('application/bind', this.applicationId);
        if (this.$route.name === 'exercise-application') {  // redirect so the status side navigation is highlighted
          this.$router.replace({
            name: 'exercise-applications-application',
            params: { applicationId: this.applicationId, status: this.application.status },
          });
        }
        if (this.candidateId) {
          await this.$store.dispatch('candidates/bindDoc', this.candidateId);
        }
      }
    },
    nextApplication() {
      if (this.applications && this.applications.length) {
        for (let i = 0, len = this.applications.length; i < len; ++i) {
          if (this.applications[i].id === this.applicationId) {
            if (i < len) {
              this.$router.replace({
                name: 'exercise-applications-application',
                params: { applicationId: this.applications[i + 1].id, status: this.applications[i + 1].status },
              });
            }
            break;
          }
        }
      }
    },
    previousApplication() {
      if (this.applications && this.applications.length) {
        for (let i = 0, len = this.applications.length; i < len; ++i) {
          if (this.applications[i].id === this.applicationId) {
            if (i > 0) {
              this.$router.replace({
                name: 'exercise-applications-application',
                params: { applicationId: this.applications[i - 1].id, status: this.applications[i + 1].status },
              });
            }
            break;
          }
        }
      }
    },
    toggleExpand(){
      this.dropDownExpanded = !this.dropDownExpanded;
    },
    toggleEdit(){
      this.editMode = !this.editMode;
    },
    downloadPage() {
      window.print();
    },
    returnPrintReadyPanelPack(){
      const htmlCollection = (document.querySelector('#panel-pack-div'));
      const virtualDiv = document.createElement('div');
      virtualDiv.innerHTML = htmlCollection.innerHTML;
      const printNoneEls = virtualDiv.querySelectorAll('.print-none');
      printNoneEls.forEach(e => e.remove());
      return virtualDiv;
    },
    copyToClipboard() {
      const panelPack = this.returnPrintReadyPanelPack();
      const el = document.createElement('textarea');
      el.value = panelPack.textContent.split('  ').join('\n');
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      document.querySelector('#clipboard-button').innerText = 'Copied';
      setTimeout(() => {
        document.querySelector('#clipboard-button').innerText = 'Copy to clipboard';
      },3000);
    },
    unlock() {
      this.$store.dispatch('application/unlock');
    },
    submitApplication() {
      this.$store.dispatch('application/submit');
    },
    makeFullName(objChanged) {
      if (objChanged.firstName && this.application.personalDetails.lastName) {
        objChanged.fullName = `${objChanged.firstName} ${this.application.personalDetails.lastName}`;
      }
      if (objChanged.lastName && this.application.personalDetails.firstName) {
        objChanged.fullName = `${this.application.personalDetails.firstName} ${objChanged.lastName}`;
      }
      return objChanged;
    },
    changePersonalDetails(objChanged) {
      const myPersonalDetails = { ...this.application.personalDetails, ...objChanged };
      this.changeApplication({ personalDetails: myPersonalDetails });
      this.$store.dispatch('candidates/savePersonalDetails', { data: objChanged, id: this.application.userId });

      logEvent('info', 'Application updated (personal details)', {
        applicationId: this.applicationId,
        candidateName: myPersonalDetails.fullName,
        exerciseRef: this.exercise.referenceNumber,
      });
    },
    async confirmWithdraw() {
      const applicationExists = await this.$store.getters['application/exists'](this.applicationId);
      if (applicationExists) {
        this.$store.dispatch('applicationRecords/storeItems', { items: [this.applicationId] });
        await this.$store.dispatch('applicationRecords/updateStatus', { status: 'withdrawn' });
      } else {
        await this.$store.dispatch('application/withdraw', { applicationId: this.applicationId }, { root: true });
      }
      this.$refs.modalRefWithdrawApplication.closeModal();
    },
    async changeApplication(obj) {
      await this.$store.dispatch('application/update', { data: obj, id: this.applicationId });

      // If uploaded self assessment file then extract the content
      if (Object.keys(obj).includes('uploadedSelfAssessment')) {
        await this.triggerExtraction();
      }
    },
    isApplicationPartAsked(part) {
      return isApplicationPartAsked(this.exercise, part);
    },
    setExtracting(value) {
      this.$store.commit('application/set', { name: 'isExtractingSelfAssessment', value: value });
    },
    async triggerExtraction() {
      try {
        this.setExtracting(true);
        const response = await httpsCallable(functions, 'extractDocumentContent')({
          templatePath: this.templatePath,
          documentPath: this.documentPath,
          questions: this.exercise.selfAssessmentWordLimits.map(section => section.question ? section.question.trim() : ''),
        });
        await this.$store.dispatch('application/save', {
          uploadedSelfAssessmentContent: response.data.result,
          uploadedSelfAssessment: this.application.uploadedSelfAssessment,
        });
        this.setExtracting(false);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error occurred during extraction:', error);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
  .govuk-summary-list__value,
  .govuk-summary-list__value:last-child,
  .govuk-summary-list__key {
    @include govuk-media-query($from: tablet) {
      width: auto;
    }
  }

.drop-down-button{
  margin-bottom: 1px;
  min-width:150px;
  max-width:150px;
  width:150px;
}

</style>
