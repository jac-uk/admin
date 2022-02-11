<template>
  <div>
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
              <span class="govuk-heading-l">
                Application
              </span>
              <h1 class="govuk-heading-l govuk-!-margin-bottom-4">
                {{ applicationReferenceNumber }}
              </h1>
            </div>
            <div class="govuk-grid-column-one-half text-right print-none">
              <span
                v-if="activeTab == 'full'"
              >
                <span
                  class="govuk-!-margin-left-4"
                >
                  <button
                    v-if="isApplied"
                    class="govuk-button btn-unlock"
                    @click="unlock"
                  >
                    Unlock
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
                    @click="downloadAsPdf"
                  >
                    Download As PDF
                  </button>
                  <button
                    id="docDownloadButton"
                    class="govuk-button govuk-button--secondary drop-down-button"
                    @click="downloadAsDoc"
                  >
                    Download As Doc
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
                  {{ application.createdAt | formatDate | showAlternative("Unknown") }}
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
                  {{ application.appliedAt | formatDate | showAlternative("Unknown") }}
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
                  Draft
                </h2>
              </div>
            </div>

            <div class="govuk-grid-column-one-third">
              <div class="panel govuk-!-margin-bottom-7 background-light-grey">
                <span class="govuk-caption-m">
                  Extension
                </span>
                <button
                  v-if="application.dateExtension"
                  @click="$refs.modalRefExtension.openModal()"
                >
                  Change
                </button>
                <h2
                  v-if="application.dateExtension"
                  class="govuk-heading-m govuk-!-margin-bottom-0"
                >
                  {{ application.dateExtension | formatDate | showAlternative("Unknown") }}
                </h2>
                <button
                  v-else
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

          <TabsList
            class="print-none"
            :tabs="tabs"
            :active-tab.sync="activeTab"
          />

          <div
            v-if="activeTab == 'full' || activeTab == 'panel'"
            class="application-details"
          >
            <div v-if="application && exercise">
              <PersonalDetailsSummary
                :user-id="application.userId"
                :personal-details="application.personalDetails || {}"
                :editable="editMode"
                @update="changePersonalDetails"
              />
              <CharacterInformationSummary
                :editable="(editMode && authorisedToPerformAction)"
                :character-information="correctCharacterInformation"
                :version="applicationVersion"
                @updateApplication="changeApplication"
              />
              <EqualityAndDiversityInformationSummary
                :application="application"
                :equality-and-diversity-survey="application.equalityAndDiversitySurvey || {}"
                :editable="(editMode && authorisedToPerformAction)"
                @updateApplication="changeApplication"
              />
              <PreferencesSummary
                :application="application"
                :exercise="exercise"
                :editable="(editMode && authorisedToPerformAction)"
                :is-panel-view="isPanelView"
                @updateApplication="changeApplication"
              />
              <QualificationsAndMembershipsSummary
                :application="application"
                :exercise="exercise"
                :editable="(editMode && authorisedToPerformAction)"
                @updateApplication="changeApplication"
              />
              <ExperienceSummary
                :application="application"
                :exercise="exercise"
                :editable="(editMode && authorisedToPerformAction)"
                :is-panel-view="isPanelView"
                @updateApplication="changeApplication"
              />
              <AssessorsSummary
                :application="application"
                :application-id="applicationId"
                :exercise="exercise"
                :editable="editMode"
                :is-panel-view="isPanelView"
              />
              <AssessmentsSummary
                :application="application"
                :exercise="exercise"
                :editable="editMode"
                :authorised-to-perform-action="authorisedToPerformAction"
                :is-panel-view="isPanelView"
                @updateApplication="changeApplication"
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
  </div>
</template>

<script>
import TabsList from '@jac-uk/jac-kit/draftComponents/TabsList';
import AgencyReport from './AgencyReport.vue';
import EventRenderer from '@jac-uk/jac-kit/draftComponents/EventRenderer';
import jsPDF from 'jspdf';
import htmlDocx from 'html-docx-js/dist/html-docx'; //has to be imported from dist folder
import { saveAs } from 'file-saver';
import Modal from '@jac-uk/jac-kit/components/Modal/Modal';
import SubmissionExtension from '@/components/ModalViews/SubmissionExtension';
import Notes from '@/components/Notes/Notes';
import CharacterInformationSummary from '@/views/InformationReview/CharacterInformationSummary';
import PersonalDetailsSummary from '@/views/InformationReview/PersonalDetailsSummary';
import EqualityAndDiversityInformationSummary from '@/views/InformationReview/EqualityAndDiversityInformationSummary';
import PreferencesSummary from '@/views/InformationReview/PreferencesSummary';
import QualificationsAndMembershipsSummary from '@/views/InformationReview/QualificationsAndMembershipsSummary';
import ExperienceSummary from '@/views/InformationReview/ExperienceSummary';
import AssessmentsSummary from '@/views/InformationReview/AssessmentsSummary';
import AssessorsSummary from '@/views/InformationReview/AssessorsSummary';
import {
  isLegal,
  isNonLegal,
  hasStatementOfSuitability,
  hasIndependentAssessments
} from '@/helpers/exerciseHelper';

export default {
  components: {
    TabsList,
    AgencyReport,
    EventRenderer,
    Modal,
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
  },
  data() {
    return {
      authorisedToPerformAction: false,
      editMode: false,
      tabs: [
        {
          ref: 'full',
          title: 'Full information',
        },
        {
          ref: 'notes',
          title: 'Notes',
        },
        {
          ref: 'panel',
          title: 'Panel pack',
        },
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
        },
      ],
      activeTab: 'full',
      dropDownExpanded: false,
    };
  },
  computed: {
    editable() {
      return this.editMode && this.authorisedToPerformAction;
    },
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    isLegal() {
      return isLegal(this.exercise);
    },
    isNonLegal() {
      return isNonLegal(this.exercise);
    },
    correctCharacterInformation() {
      if (this.applicationVersion === 2) {
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
    applications() {
      return this.$store.state.applications.records;
    },
    application() {
      return this.$store.getters['application/data']();
    },
    applicationId() {
      return this.$route.params.applicationId;
    },
    exerciseId() {
      return this.$store.state.exerciseDocument.record ? this.$store.state.exerciseDocument.record.id : null;
    },
    applicationReferenceNumber() {
      return this.$store.state.application.record ? this.$store.state.application.record.referenceNumber : null;
    },
    isPanelView() {
      return this.activeTab === 'panel';
    },
    generateFilename() {
      return this.applicationReferenceNumber ? this.applicationReferenceNumber : 'judicial-appointments-application';
    },
    ethnicGroupDetails() {
      switch (this.application.equalityAndDiversitySurvey.ethnicGroup) {
      case 'other-asian':
        return this.application.equalityAndDiversitySurvey.otherEthnicGroupAsianDetails;
      case 'other-white':
        return this.application.equalityAndDiversitySurvey.otherEthnicGroupWhiteDetails;
      case 'other-black':
        return this.application.equalityAndDiversitySurvey.otherEthnicGroupBlackDetails;
      case 'other-mixed':
        return this.application.equalityAndDiversitySurvey.otherEthnicGroupMixedDetails;
      default:
        return this.application.equalityAndDiversitySurvey.otherEthnicGroupDetails;
      }
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
    otherMemberships() {
      // @NOTE this is a bit ugly as we can't just lookup label
      const selected = {};

      if (this.application.professionalMemberships) {
        this.application.professionalMemberships.forEach(membership => {
          if (this.application.memberships[membership]) {
            const otherMembership = this.exercise.otherMemberships.find(m => m.value === membership);
            selected[membership] = {
              ...this.application.memberships[membership],
              label: otherMembership.label,
            };
          }
        });
      }

      return selected;
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
  },
  watch: {
    '$route.params.applicationId'() {
      this.pageLoad();
    },
  },
  created() {
    this.pageLoad();
    this.$root.$on('changeUserDetails', (obj) => this.changeUserDetails(obj));
  },
  destroyed() {
    this.$store.dispatch('application/unbind');
  },
  methods: {
    async pageLoad() {
      this.authorisedToPerformAction = await authorisedToPerformAction(this.$store.state.auth.currentUser.email);
      if (this.$route.params.tab) {
        this.activeTab = this.$route.params.tab;
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
    downloadAsPdf() {
      const pdf = new jsPDF();

      pdf.fromHTML(
        this.returnPrintReadyPanelPack(),
        15,
        15,
        {
          width: 170,
          elementHandlers: {
            '.jac-button-group': () => true,
          },
        },
      );

      const fileName = this.generateFilename;

      pdf.save(`${fileName}.pdf`);
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
    downloadAsDoc() {
      const fileName = this.generateFilename;
      const content = this.returnPrintReadyPanelPack().outerHTML;
      const converted = htmlDocx.asBlob(content);
      saveAs(converted, `${fileName}.docx`);
    },
    unlock() {
      this.$store.dispatch('application/unlock');
    },
    submitApplication() {
      this.$store.dispatch('application/submit');
    },
    closeModal(modalRef) {
      this.$refs[modalRef].closeModal();
    },
    changeApplication(obj) {
      this.$store.dispatch('application/update', { data: obj, id: this.applicationId });
    },
    changePersonalDetails(obj) {
      this.changeApplication({ personalDetails: obj });
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
