<template>
  <div>
    <div class="moj-page-header-actions">
      <div class="moj-page-header-actions__title">
        <h2 class="govuk-heading-l">
          Applications - {{ status | lookup }}
        </h2>
      </div>

      <div
        v-if="status === 'applied'"
        class="moj-page-header-actions__actions float-right"
      >
        <div class="moj-button-menu">
          <div class="moj-button-menu__wrapper">
            <button
              v-if="hasPermissions([
                PERMISSIONS.exercises.permissions.canReadExercises.value,
                PERMISSIONS.applications.permissions.canReadApplications.value
              ])"
              class="govuk-button govuk-button--secondary moj-button-menu__item moj-page-header-actions__action"
              data-module="govuk-button"
              @click="exportContacts()"
            >
              Export contacts
            </button>
          </div>
        </div>
      </div>

      <div
        v-if="status === 'draft'"
        class="moj-page-header-actions__actions float-right"
      >
        <div class="moj-button-menu">
          <div class="moj-button-menu__wrapper">
            <button
              v-if="hasPermissions([
                PERMISSIONS.exercises.permissions.canReadExercises.value,
                PERMISSIONS.applications.permissions.canReadApplications.value
              ])"
              class="govuk-button govuk-button--secondary moj-button-menu__item moj-page-header-actions__action"
              data-module="govuk-button"
              @click="lateApplicationPopUp()"
            >
              Late Application
            </button>
          </div>
        </div>
      </div>
    </div>

    <Table
      :key="status"
      ref="applicationsTable"
      data-key="id"
      :data="applications"
      :columns="tableColumns"
      :custom-search="{
        placeholder: 'Search candidate names',
        handler: candidateSearch,
        field: 'userId',
      }"
      :page-size="50"
      @change="getTableData"
    >
      <template #row="{row}">
        <TableCell :title="tableColumns[0].title">
          <RouterLink
            class="govuk-link"
            :to="{name: 'exercise-applications-application', params: { applicationId: row.id, status: status }}"
            target="_blank"
          >
            {{ row.referenceNumber | showAlternative(row.id) }}
          </RouterLink>
        </TableCell>
        <TableCell :title="tableColumns[1].title">
          <RouterLink
            :to="{ name: 'candidates-view', params: { id: row.userId } }"
            target="_blank"
          >
            {{ row.personalDetails && row.personalDetails.fullName }}
          </RouterLink>
        </TableCell>
        <TableCell :title="tableColumns[2].title">
          {{ row.status | lookup }}
        </TableCell>
      </template>
    </Table>
    <Modal ref="modalLateApplication">
      <div class="late-application">
        <div class="modal__title govuk-!-padding-2 govuk-heading-m">
          Request a Late Application to a Closed Exercise
        </div>
        <div class="modal__content govuk-!-margin-6">
          <div class="govuk-grid-row">
            <div v-if="positiveCandidate === null || positiveCandidate === false">
              <div class="govuk-inset-text">
                Check that the user has an account on the system
              </div>
              <ErrorSummary
                :errors="errors"
              />
              <form
                ref="formRef"
                @submit.prevent="submitForm"
              >
                <div class="govuk-form-group">
                  <div class="form-row">
                    <label
                      class="govuk-label"
                      for="late-application-name"
                    >
                      Candidate Name
                    </label>
                    <input
                      id="late-application-name"
                      v-model="formData.fullName"
                      class="govuk-input"
                      name="late-application-name"
                      type="text"
                    >
                  </div>
                  <div class="form-row">
                    <label
                      class="govuk-label"
                      for="late-application-email"
                    >
                      Candidate Email
                    </label>
                    <input
                      id="late-application-email"
                      v-model="formData.email"
                      class="govuk-input"
                      name="late-application-email"
                      type="email"
                    >
                  </div>
                  <div class="form-row">
                    <label
                      class="govuk-label"
                      for="late-application-reason"
                    >
                      Reason for allowing a late application
                    </label>
                    <input
                      id="late-application-reason"
                      v-model="formData.reason"
                      class="govuk-input"
                      name="late-application-reason"
                      type="text"
                    >
                  </div>
                  <div class="form-row">
                    <label
                      class="govuk-label"
                      for="late-application-sl"
                    >
                      Senior Leadership Name
                    </label>
                    <select
                      id="late-application-sl"
                      v-model="formData.seniorLeadership"
                      class="govuk-select"
                      name="late-application-sl"
                    >
                      <option>Select a Senior Leadership Name</option>
                      <option value="Andrew">Andrew</option>
                      <option value="Mark" selected>Mark</option>
                      <option value="Tom">Tom</option>
                    </select>
                  </div>
                </div>
                <button
                  class="govuk-button govuk-!-margin-right-3"
                  @click="submitForm"
                >
                  Submit
                </button>
                <button
                  class="govuk-button govuk-button--secondary govuk-!-margin-right-3"
                  @click="closeModal('modalLateApplication')"
                >
                  Cancel
                </button>
              </form>
            </div>
            <div v-if="positiveCandidate">
              <p>Your request has been sent to the Leadership Team.</p>
              <p>You will receive an answer soon.</p>
              <p>
                <button
                  class="govuk-button govuk-button--secondary"
                  @click="closeModal('modalLateApplication')"
                >
                  Close
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import ErrorSummary from '@jac-uk/jac-kit/draftComponents/Form/ErrorSummary';
import Table from '@jac-uk/jac-kit/components/Table/Table';
import TableCell from '@jac-uk/jac-kit/components/Table/TableCell';
import { functions } from '@/firebase';
import { downloadXLSX } from '@jac-uk/jac-kit/helpers/export';
import Modal from '@jac-uk/jac-kit/components/Modal/Modal';
import permissionMixin from '@/permissionMixin';
import { MESSAGES_STATUS } from '@/helpers/constants';

export default {
  name: 'ApplicationsList',
  components: {
    Modal,
    Table,
    TableCell,
    ErrorSummary,
  },
  mixins: [permissionMixin],
  props: {
    status: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      positiveCandidate: null,
      formData: {},
      errors: [],
    };
  },
  computed: {
    exerciseId() {
      return this.$route.params.id;
    },
    tableColumns() {
      const cols = [];
      cols.push({ title: 'Reference number' });
      if (this.status === 'draft') {
        cols.push({ title: 'Name', sort: 'documentId', default: true });
      } else {
        cols.push({ title: 'Name', sort: 'personalDetails.fullName', default: true });
      }
      cols.push({ title: 'Status' });
      return cols;
    },
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    applications() {
      return this.$store.state.applications.records;
    },
  },
  methods: {
    getTableData(params) {
      return this.$store.dispatch(
        'applications/bind',
        {
          exerciseId: this.exercise.id,
          status: this.status,
          ...params,
        }
      );
    },
    async gatherReportData() {
      const response = await functions.httpsCallable('exportApplicationContactsData')({ exerciseId: this.exercise.id, status: this.status });
      const reportData = [];
      reportData.push(response.data.headers.map(header => header));
      response.data.rows.forEach((row) => {
        reportData.push(Object.values(row).map(cell => cell));
      });
      return reportData;
    },
    async exportContacts() {
      const title = 'Contacts';
      const xlsxData = await this.gatherReportData();
      downloadXLSX(
        xlsxData,
        {
          title: `${this.exercise.referenceNumber} ${title}`,
          sheetName: title,
          fileName: `${this.exercise.referenceNumber} - ${title}.xlsx`,
        }
      );
    },
    async candidateSearch(searchTerm) {
      return await this.$store.dispatch('candidates/search', { searchTerm: searchTerm, exerciseId: this.exercise.id });
    },
    lateApplicationPopUp() {
      this.formData.exerciseId = this.exerciseId;
      this.openModal('modalLateApplication');
    },
    openModal(modalRef){
      this.$refs[modalRef].openModal();
    },
    closeModal(modalRef) {
      this.formData = {};
      this.positiveCandidate = null;
      this.errors = [];
      this.$refs[modalRef].closeModal();
    },
    async submitForm() {
      // this.closeModal('modalLateApplication');
      // const candidatesSearch = await this.candidateSearch(this.formData.email);
      await functions.httpsCallable('getUserByEmail')({ email: this.formData.email })
        .then(
          (result) => {
            // console.log('then', result.data);
            const resultsData = result.data;
            if (resultsData.uid) {
              // console.log('submitForm positive');
              this.positiveCandidate = true;
              this.processRequestLateApplication(resultsData);
            } else {
              // console.log('submitForm negative');
              this.positiveCandidate = false;
              this.errors = [{ id: 'email', message: 'The user doesn\'t exist on the system' }];
            }
          },
          (error) => {
            this.positiveCandidate = false;
            this.errors = [{ id: 'error', message: error }];
          }
        );
    },
    async processRequestLateApplication(dataAuth) {
      // console.log('processRequestLateApplication', this.exercise.id, this.formData, dataAuth);
      const prepareData = {
        type: 'lateApplicationRequests',
        status: MESSAGES_STATUS.NEW,
        lateApplicationRequests: {
          exerciseId: this.exercise.id,
          exerciseName: this.exercise.exerciseName,
          ...dataAuth,
          ...this.formData,
        },
      };
      // console.log('processRequestLateApplication prepareData', prepareData);
      await this.$store.dispatch('messages/save', { data: prepareData })
        .then(
          (result) => {
            console.log('processRequestLateApplication promise positive', result);
          },
          (error) => {
            this.positiveCandidate = false;
            this.errors = [{ id: 'email', message: error }];
            console.log('processRequestLateApplication promise negative', error);
          }
        );
    },
  },
};
</script>

<style lang="scss" scoped>

  .modal .late-application .govuk-form-group,
  .modal .late-application .govuk-inset-text {
    text-align: left;
  }
  .late-application .modal__title {
    color: govuk-colour("white");
  }
  .form-row {
    margin-bottom: 1em;
  }
</style>
