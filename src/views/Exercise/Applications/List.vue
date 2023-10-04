<template>
  <div>
    <div class="moj-page-header-actions">
      <div class="moj-page-header-actions__title">
        <h2 class="govuk-heading-l">
          Applications - {{ $filters.lookup(status) }}
        </h2>
      </div>

      <div
        v-if="status === 'draft' || status === 'applied'"
        class="moj-page-header-actions__actions float-right"
      >
        <div class="moj-button-menu">
          <div class="moj-button-menu__wrapper">
            <button
              v-if="status === 'draft' && hasPermissions([
                PERMISSIONS.exercises.permissions.canSendApplicationReminders.value,
              ])"
              class="govuk-button govuk-button moj-button-menu__item moj-page-header-actions__action"
              data-module="govuk-button"
              :disabled="!applications || !applications.length"
              @click="openApplicationReminderModal"
            >
              Send reminders
            </button>
            <ActionButton
              v-if="hasPermissions([
                PERMISSIONS.exercises.permissions.canReadExercises.value,
                PERMISSIONS.applications.permissions.canReadApplications.value
              ])"
              :action="exportContacts"
            >
              Export contacts
            </ActionButton>
            <button
              v-if="status === 'draft' && isClosed && hasPermissions([PERMISSIONS.applications.permissions.canRequestLateApplications.value])"
              class="govuk-button govuk-button--secondary moj-button-menu__item moj-page-header-actions__action"
              data-module="govuk-button"
              @click="openModal"
            >
              Late Application
            </button>
          </div>
        </div>
      </div>
    </div>
    <Table
      :key="tableStatus"
      ref="applicationsTable"
      data-key="id"
      :data="applications"
      :columns="tableColumns"
      search-map="_search"
      :page-item-type="pageItemType"
      :page-size="50"
      :total="exercise._applications[status]"
      @change="getTableData"
    >
      <template #row="{row}">
        <TableCell :title="tableColumns[0].title">
          <RouterLink
            class="govuk-link"
            :to="{name: 'exercise-applications-application', params: { applicationId: row.id, status: status }}"
            target="_blank"
          >
            {{ $filters.showAlternative(row.referenceNumber, row.id) }}
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
          {{ row._language === 'cym' ? 'Yes' : 'No' }}
        </TableCell>
        <TableCell :title="tableColumns[3].title">
          {{ $filters.lookup(row.status) }}
        </TableCell>
      </template>
    </Table>

    <Modal
      ref="applicationReminderModal"
    >
      <ModalInner
        @close="closeApplicationReminderModal"
        @confirmed="sendApplicationReminders"
      />
    </Modal>

    <Modal ref="lateApplicationRequestModal">
      <LateApplicationRequest
        @success="openConfirmationModal()"
        @close="closeModal()"
      />
    </Modal>
    <Modal ref="lateApplicationRequestConfirmModal">
      <LateApplicationConfirmation
        @close="closeConfirmationModal()"
      />
    </Modal>
  </div>
</template>

<script>
import Table from '@jac-uk/jac-kit/components/Table/Table.vue';
import TableCell from '@jac-uk/jac-kit/components/Table/TableCell.vue';
import { functions } from '@/firebase';
import { downloadXLSX } from '@jac-uk/jac-kit/helpers/export';
import permissionMixin from '@/permissionMixin';
import { isClosed } from '@/helpers/exerciseHelper';
import LateApplicationRequest from '@/components/ModalViews/LateApplication/Request.vue';
import LateApplicationConfirmation from '@/components/ModalViews/LateApplication/RequestConfirmation.vue';
import Modal from '@jac-uk/jac-kit/components/Modal/Modal.vue';
import ModalInner from '@jac-uk/jac-kit/components/Modal/ModalInner.vue';
import ActionButton from '@jac-uk/jac-kit/draftComponents/ActionButton.vue';

export default {
  name: 'ApplicationsList',
  components: {
    Table,
    TableCell,
    Modal,
    ModalInner,
    LateApplicationRequest,
    LateApplicationConfirmation,
    ActionButton,
  },
  mixins: [permissionMixin],
  props: {
    status: {
      type: String,
      required: true,
    },
  },
  computed: {
    tableColumns() {
      const cols = [];
      cols.push({ title: 'Reference number' });
      cols.push({ title: 'Name', sort: '_sort.fullNameUC', default: true });
      cols.push({ title: 'Applied in Welsh' });
      cols.push({ title: 'Status' });
      return cols;
    },
    tableStatus() {
      return this.status;
    },
    pageItemType() {
      if (
        this.exercise && 
        this.exercise._applications && 
        this.exercise._applications[this.status] && 
        this.exercise._applications[this.status] > 500
      ) {
        return 'uppercase-letter';
      }
      return '';
    },
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    applications() {
      return this.$store.state.applications.records;
    },
    isClosed() {
      return isClosed(this.exercise);
    },
  },
  methods: {
    openModal() {
      this.$refs.lateApplicationRequestModal.openModal();
    },
    closeModal() {
      this.$refs.lateApplicationRequestModal.closeModal();
    },
    openConfirmationModal() {
      this.closeModal();
      this.$refs.lateApplicationRequestConfirmModal.openModal();
    },
    closeConfirmationModal() {
      this.$refs.lateApplicationRequestConfirmModal.closeModal();
    },
    getTableData(params) {
      this.$store.dispatch(
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
      const { headers, rows } = response.data;

      // Add headers as the first row
      const headerRow = Object.values(headers);
      reportData.push(headerRow);

      // Iterate over each row and add data
      rows.forEach((row) => {
        const rowData = [];
        for (const key in headers) {
          if (row.hasOwnProperty(key)) {
            if (row[key] !== '') {
              rowData.push(row[key]);
            } else {
              rowData.push('No answer provided');
            }
          } else {
            rowData.push('Question not asked');
          }
        }
        reportData.push(rowData);
      });

      return reportData;
    },
    async sendApplicationReminders() {
      if (this.applications && this.applications.length) {
        try {
          await functions.httpsCallable('sendApplicationReminders')({ exerciseId: this.exercise.id });
        } catch (error) {
          console.error(error);
        }
      }
      this.closeApplicationReminderModal();
    },
    async exportContacts() {
      try {
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
        return true;
      } catch (error) {
        return;
      }
    },
    async candidateSearch(searchTerm) {
      return await this.$store.dispatch('candidates/search', { searchTerm: searchTerm, exerciseId: this.exercise.id });
    },
    openApplicationReminderModal() {
      this.$refs.applicationReminderModal.openModal();
    },
    closeApplicationReminderModal() {
      this.$refs.applicationReminderModal.closeModal();
    },
  },
};
</script>
