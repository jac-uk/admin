<template>
  <div>
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-three-quarters">
        <h1 class="govuk-heading-l">
          {{ type | lookup }}
        </h1>
      </div>
      <div class="govuk-grid-column-one-quarter text-right">
        <FullScreenButton />
      </div>
    </div>

    <TabsList
      :tabs="tabs"
      :active-tab.sync="activeTab"
    />

    <!-- OVERVIEW -->
    <div v-show="activeTab == 'overview'">
      <div class="govuk-grid-row">
        <div class="govuk-grid-column-one-half">
          <div class="panel govuk-!-margin-bottom-5 govuk-!-padding-4 background-light-grey">
            <div class="govuk-caption-m">
              Applied
            </div>
            <h2
              class="govuk-heading-m govuk-!-margin-bottom-0"
            >
              8,888
            </h2>
          </div>
        </div>
        <div class="govuk-grid-column-one-half">
          <div class="panel govuk-!-margin-bottom-5 govuk-!-padding-4 background-light-grey">
            <div class="govuk-caption-m">
              Shortlisted
            </div>
            <h2
              class="govuk-heading-m govuk-!-margin-bottom-0"
            >
              276
            </h2>
          </div>
        </div>
      </div>

      <div class="govuk-grid-row">
        <div class="govuk-grid-column-full">
          <div class="govuk-caption-m">
            Successful candidates
          </div>
          <Table
            data-key="id"
            :data="[
              { id: 1, status: 'siftPassed', total: 4444, female: 40, bame: 10, solicitor: 5, disability: 1 },
              { id: 2, status: 'qualifyingTestPassed', total: 2222, female: 41, bame: 11, solicitor: 6, disability: 2 },
              { id: 3, status: 'scenarioTestPassed', total: 1111, female: 42, bame: 12, solicitor: 7, disability: 3 },
              { id: 4, status: 'telephoneAssessmentPassed', total: 555, female: 43, bame: 13, solicitor: 8, disability: 4 },
              { id: 5, status: 'eligibilitySCCPassed', total: 276, female: 44, bame: 14, solicitor: 9, disability: 5 },
            ]"
            :columns="[
              { title: 'Status' },
              { title: 'Total', class: 'text-right' },
              { title: 'Female %', class: 'text-right' },
              { title: 'BAME %', class: 'text-right' },
              { title: 'Solicitor %', class: 'text-right' },
              { title: 'Disability %', class: 'text-right' },
            ]"
            local-data
          >
            <template #row="{row}">
              <TableCell title="Status">
                {{ row.status | lookup }}
              </TableCell>
              <TableCell
                title="Total"
                class="text-right"
              >
                {{ row.total }}
              </TableCell>
              <TableCell
                title="Female %"
                class="text-right"
              >
                {{ row.female }}
              </TableCell>
              <TableCell
                title="BAME %"
                class="text-right"
              >
                {{ row.bame }}
              </TableCell>
              <TableCell
                title="Solicitor %"
                class="text-right"
              >
                {{ row.solicitor }}
              </TableCell>
              <TableCell
                title="Disability %"
                class="text-right"
              >
                {{ row.disability }}
              </TableCell>
            </template>
          </Table>
        </div>
        <div class="govuk-grid-column-full">
          <div class="govuk-caption-m">
            Unsuccessful candidates
          </div>
          <Table
            data-key="id"
            :data="[
              { id: 1, status: 'siftFailed', total: 4444, female: 60, bame: 10, solicitor: 5, disability: 1 },
              { id: 2, status: 'qualifyingTestFailed', total: 2222, female: 59, bame: 11, solicitor: 6, disability: 2 },
              { id: 3, status: 'scenarioTestFailed', total: 1111, female: 58, bame: 12, solicitor: 7, disability: 3 },
              { id: 4, status: 'telephoneAssessmentFailed', total: 555, female: 57, bame: 13, solicitor: 8, disability: 4 },
              { id: 5, status: 'rejectedIneligibleStatutory', total: 174, female: 56, bame: 14, solicitor: 9, disability: 5 },
              { id: 6, status: 'rejectedIneligibleAdditional', total: 102, female: 56, bame: 14, solicitor: 9, disability: 5 },
              { id: 7, status: 'withdrawn', total: 27, female: 56, bame: 14, solicitor: 9, disability: 5 },
            ]"
            :columns="[
              { title: 'Status' },
              { title: 'Total', class: 'text-right' },
              { title: 'Female %', class: 'text-right' },
              { title: 'BAME %', class: 'text-right' },
              { title: 'Solicitor %', class: 'text-right' },
              { title: 'Disability %', class: 'text-right' },
            ]"
            local-data
          >
            <template #row="{row}">
              <TableCell title="Status">
                {{ row.status | lookup }}
              </TableCell>
              <TableCell
                title="Total"
                class="text-right"
              >
                {{ row.total }}
              </TableCell>
              <TableCell
                title="Female %"
                class="text-right"
              >
                {{ row.female }}
              </TableCell>
              <TableCell
                title="BAME %"
                class="text-right"
              >
                {{ row.bame }}
              </TableCell>
              <TableCell
                title="Solicitor %"
                class="text-right"
              >
                {{ row.solicitor }}
              </TableCell>
              <TableCell
                title="Disability %"
                class="text-right"
              >
                {{ row.disability }}
              </TableCell>
            </template>
          </Table>
        </div>
      </div>
    </div>
    <!-- END OVERVIEW -->

    <!-- APPLICATIONS -->
    <div v-show="activeTab == 'applications'">
      <div class="govuk-grid-row">
        <div class="govuk-grid-column-full">
          <Table
            data-key="id"
            :data="filteredApplications"
            :columns="tableColumns"
            :search="['personalDetails.fullName']"
            :filters="[
              {
                title: 'Status',
                field: 'status',
                type: 'checkbox',
                options: availableStatuses,
              },
            ]"
            local-data
            @change="updateTableState"
          >
            <template #row="{row}">
              <TableCell title="Ref">
                <span
                  class="govuk-link"
                  @click="viewApplication(row)"
                >{{ row.referenceNumber }}</span>
              </TableCell>
              <TableCell title="Full name">
                {{ row.personalDetails.fullName }}
              </TableCell>
              <TableCell title="Status">
                <StatusTag
                  :pass-statuses="[ passStatus ]"
                  :status="row.status"
                />
              </TableCell>
            </template>
          </Table>
        </div>
      </div>
    </div>
    <!-- END APPLICATIONS -->

    <Modal
      ref="viewApplication"
      class="modal-large"
    >
      <TitleBar v-if="currentApplication">
        <div class="govuk-grid-row govuk-!-margin-0">
          <div class="govuk-grid-column-three-quarters govuk-!-padding-0">
            <div class="govuk-grid-row govuk-!-margin-0">
              <div class="govuk-grid-column-one-half govuk-!-padding-0">
                <div class="govuk-caption-m text--inverse">
                  {{ currentApplication.referenceNumber }}
                </div>
              </div>
              <div class="govuk-grid-column-one-half govuk-!-padding-0">
                <StatusTag
                  :pass-statuses="[ passStatus ]"
                  :status="currentApplication.status"
                  class="govuk-!-margin-left-1"
                />
              </div>
            </div>
            {{ currentApplication.personalDetails.fullName }}
          </div>
          <div class="govuk-grid-column-one-quarter govuk-!-padding-0 govuk-!-padding-top-3 text-right">
            <span
              class="govuk-body govuk-link text--inverse govuk-!-padding-top-3 govuk-!-margin-bottom-0 govuk-!-margin-right-4"
              @click="prevApplication"
            >Previous</span>

            <span
              class="govuk-body govuk-link text--inverse govuk-!-padding-top-3 govuk-!-margin-bottom-0 govuk-!-margin-right-4"
              @click="nextApplication"
            >Next</span>

            <span
              class="govuk-body govuk-link text--inverse govuk-!-padding-top-3 govuk-!-margin-bottom-0"
              @click="closeApplication"
            >Close</span>
          </div>
        </div>
      </TitleBar>
      <div
        v-if="currentApplication"
        class="govuk-!-padding-left-2 govuk-!-padding-right-2"
      >
        <div
          v-if="isCheck"
          class="govuk-inset-text"
        >
          <p class="govuk-body-l govuk-!-margin-bottom-2">
            Please review this application and mark it appropriately
          </p>
          <button
            class="govuk-button govuk-button--secondary govuk-!-margin-bottom-1 govuk-!-margin-right-2"
            type="button"
          >
            Add a note
          </button>
          <button
            type="button"
            class="govuk-button govuk-button--warning govuk-!-margin-bottom-1 govuk-!-margin-right-2"
          >
            Reject
          </button>
          <button
            class="govuk-button govuk-!-margin-bottom-1"
            type="button"
          >
            Approve
          </button>
        </div>
        <TabsList
          :tabs="applicationTabs"
          :active-tab.sync="applicationTab"
          class="govuk-!-margin-bottom-0"
        />
        <div
          v-if="applicationTab == 'results'"
          class="govuk-!-padding-left-4 govuk-!-padding-right-4"
        >
          <h2 class="govuk-heading-l govuk-!-padding-top-4">
            Results
          </h2>
          <dl class="govuk-summary-list govuk-!-margin-top-4">
            <div
              v-for="taskType in taskTypes"
              :key="taskType"
              class="govuk-summary-list__row"
            >
              <dt class="govuk-summary-list__key">
                {{ taskType | lookup }}
              </dt>
              <dd class="govuk-summary-list__value">
                {{ randomNumber(0, 30) }}
              </dd>
            </div>
          </dl>
        </div>
        <div
          v-if="applicationTab == 'application'"
          class="govuk-!-padding-left-4 govuk-!-padding-right-4"
        >
          <PersonalDetailsSummary
            :personal-details="currentApplication.personalDetails"
            :editable="false"
            :user-id="currentApplication.userId"
          />
        </div>
        <div
          v-if="applicationTab == 'notes'"
          class="govuk-!-padding-left-4 govuk-!-padding-right-4"
        >
          <Notes
            title="Notes about the Application"
            :candidate-id="currentApplication.userId"
            :application-id="currentApplication.id"
            :can-create="true"
            class="govuk-!-margin-top-0"
          />
        </div>
      </div>
    </Modal>

    <Modal
      ref="createCheck"
    >
      <TitleBar>
        Start a new check
      </TitleBar>
      <Form
        @save="$refs['createCheck'].closeModal(); checkApplication(applications[0])"
        @cancel="$refs['createCheck'].closeModal()"
        class="govuk-!-padding-4"
      >
        <RadioGroup
          id="check-type"
          v-model="newCheckType"
          label="Which type of check would you like to perform?"
        >
          <RadioItem
            v-for="item in ['100%', '10%', 'Custom']"
            :key="item"
            :value="item"
            :label="`${item} check`"
          />
        </RadioGroup>
      </Form>
    </Modal>

    <!-- CHECKS -->
    <div v-show="activeTab == 'checks'">
      <div class="govuk-grid-row">
        <div class="govuk-grid-column-one-half">
          <button
            type="button"
            class="govuk-button govuk-button--secondary govuk-!-margin-bottom-1 govuk-!-margin-right-2"
            @click="btnCreateCheck"
          >
            Start a new check
          </button>
        </div>
        <div class="govuk-grid-column-one-half text-right">
          <ActionButton
            class="govuk-!-margin-bottom-1 govuk-!-margin-right-2"
            type="primary"
            disabled
          >
            Checks completed
          </ActionButton>
        </div>
        <div class="govuk-grid-column-full">
          <Table
            data-key="id"
            :data="checks"
            :columns="[
              { title: 'Check' },
              { title: 'Status' },
              { title: 'Notes' },
            ]"
            local-data
          >
            <template #row="{row}">
              <TableCell title="Check">
                <span class="govuk-link" @click="checkApplication(applications[0])">{{ row.type }} check by {{ row.createdBy }}</span>
              </TableCell>
              <TableCell title="Status">
                <StatusTag
                  v-if="row.status"
                  :pass-statuses="[ 'pass' ]"
                  :status="row.status"
                />
                <div
                  v-else
                  class="govuk-tag govuk-tag--grey"
                >
                  In progress
                </div>
              </TableCell>
              <TableCell title="Notes">
                {{ row.note }}
              </TableCell>
            </template>
          </Table>
        </div>
      </div>
    </div>
    <!-- END CHECKS -->
  </div>
</template>

<script>
import defaultView from './default';
import FullScreenButton from '@/components/Page/FullScreenButton';
import TabsList from '@jac-uk/jac-kit/draftComponents/TabsList';
import Table from '@jac-uk/jac-kit/components/Table/Table';
import TableCell from '@jac-uk/jac-kit/components/Table/TableCell';
import Modal from '@jac-uk/jac-kit/components/Modal/Modal';
import TitleBar from '@/components/Page/TitleBar';
import StatusTag from '../StatusChanges/StatusTag';
import PersonalDetailsSummary from '@/views/InformationReview/PersonalDetailsSummary';
import Notes from '@/components/Notes/Notes';
import Form from '@/components/Page/Form';
import RadioGroup from '@jac-uk/jac-kit/draftComponents/Form/RadioGroup';
import RadioItem from '@jac-uk/jac-kit/draftComponents/Form/RadioItem';
import { generateApplications, randomArrayItem, randomNumber } from './dummyData';
import { APPLICATION_STATUS } from '@/helpers/constants';
import { getTableData } from '@/helpers/tableHelper';

export default {
  components: {
    FullScreenButton,
    TabsList,
    Table,
    TableCell,
    Modal,
    TitleBar,
    StatusTag,
    PersonalDetailsSummary,
    Notes,
    Form,
    RadioGroup,
    RadioItem,
  },
  extends: defaultView,
  data() {
    const passStatus = APPLICATION_STATUS.ELIGIBILITY_SCC_PASSED;
    const failStatuses = [
      APPLICATION_STATUS.CRITICAL_ANALYSIS_FAILED,
      APPLICATION_STATUS.SITUATIONAL_JUDGEMENT_FAILED,
      APPLICATION_STATUS.QUALIFYING_TEST_FAILED,
      APPLICATION_STATUS.SCENARIO_TEST_FAILED,
      APPLICATION_STATUS.SIFT_FAILED,
      APPLICATION_STATUS.TELEPHONE_ASSESSMENT_FAILED,
      APPLICATION_STATUS.REJECTED_INELIGIBLE_STATUTORY,
      APPLICATION_STATUS.REJECTED_INELIGIBLE_ADDITIONAL,
      APPLICATION_STATUS.REJECTED_CHARACTER,
      APPLICATION_STATUS.WITHDRAWN,
    ];
    const applications = generateApplications('JAC00485', 1000).map(application => {
      return {
        ...application,
        status: (Math.random() < 0.1 ) ? passStatus : randomArrayItem(failStatuses),
      };
    });
    return {
      activeTab: 'overview',
      tabs: [
        { ref: 'overview', title: 'Overview' },
        { ref: 'applications', title: 'Applications' },
        { ref: 'checks', title: 'Checks' },
      ],
      applicationTab: 'results',
      applicationTabs: [
        { ref: 'results', title: 'Results' },
        { ref: 'application', title: 'Application' },
        { ref: 'notes', title: 'Notes' },
      ],
      tableColumns: [
        { title: 'Ref', sort: 'referenceNumber' },
        { title: 'Full name', sort: 'personalDetails.fullName' },
        { title: 'Status', sort: 'status' },
      ],
      tableState: null,
      passStatus: passStatus,
      availableStatuses: failStatuses.concat(passStatus),
      applications: applications,
      currentApplication: null,
      isCheck: false,
      newCheckType: null,
    };
  },
  computed: {
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    stage() {
      return this.$route.params.stage;
    },
    filteredApplications() {
      if (!this.tableState)  return this.applications;
      return getTableData(this.applications, this.tableColumns, this.tableState);
    },
    taskTypes() {
      return ['sift','criticalAnalysis', 'situationalJudgement', 'qualifyingTest', 'scenarioTest', 'telephoneAssessment', 'eligibilitySCC'];
    },
    checks() {
      return this.$store.state.checks.records;
    },
  },
  methods: {
    randomNumber(min, max) {
      return randomNumber(min, max);
    },
    updateTableState(params) {
      this.tableState = params;
    },
    checkApplication(row) {
      this.currentApplication = row;
      this.isCheck = true;
      this.$refs['viewApplication'].openModal();
    },
    viewApplication(row) {
      this.currentApplication = row;
      this.isCheck = false;
      this.$refs['viewApplication'].openModal();
    },
    prevApplication() {
      const currentIndex = this.applications.findIndex(application => application.id === this.currentApplication.id);
      if (currentIndex > 0) {
        this.currentApplication = this.applications[currentIndex - 1];
      }
    },
    nextApplication() {
      const currentIndex = this.applications.findIndex(application => application.id === this.currentApplication.id);
      if (currentIndex < this.applications.length) {
        this.currentApplication = this.applications[currentIndex + 1];
      }
    },
    closeApplication() {
      this.currentApplication = null;
      this.$refs['viewApplication'].closeModal();
    },
    btnCreateCheck() {
      this.$refs['createCheck'].openModal();
    },
  },
};
</script>

<style>
.modal-large > .modal {
  max-width: 90%;
  width: 900px;
  min-height: 80%;
}
</style>
