<template>
  <div class="feedback">
    <h1 class="govuk-heading-l">
      Feedback
    </h1>
    <TabsList
      :tabs="tabs"
      :active-tab.sync="activeTab"
    />
    <div v-show="activeTab == TABS.REQUESTED">
      <button
        class="govuk-button govuk-!-margin-right-3"
        @click="btnRequestFeeback"
      >
        Request Feedback
      </button>
    </div>
    <Modal
      ref="modalFeedback"
    >
      <div class="modal__title govuk-!-padding-2 govuk-heading-m">
        Request Feedback
      </div>
      <div class="modal__content govuk-!-margin-6">
        <div class="govuk-grid-row" v-if="!selectedItem">
          <p>
            <span class="govuk-!-font-size-19 govuk-!-font-weight-bold"></span>Search Candidates<br>
            <span class="govuk-body-s">Start typing the name of the candidate and choose from below</span>
          </p>
          <Table
            data-key="id"
            :data="tableData"
            :page-size="5"
            :total="5"
            :columns="tableColumns"
            :custom-search="{
              placeholder: 'Search candidate names',
              handler: candidateSearch,
              field: 'id',
            }"
            show-next=false
            show-paging=false
            @change="getTableData"
          >
            <template #row="{row}">
              <TableCell :title="tableColumns[0].title">
                <a href="#" class="govuk-link" @click.prevent="selectCandidate(row.id)">
                  {{ row.fullName | showAlternative(row.id) }}
                </a>
              </TableCell>
              <TableCell :title="tableColumns[1].title">
                {{ new Date(row.lastUpdated) | formatDate('long') }}
              </TableCell>
              <TableCell :title="tableColumns[2].title">
                {{ countApplications(row) | formatNumber }}
              </TableCell>
            </template>
          </Table>
        </div>
        <div class="govuk-grid-row" v-if="selectedItem">
          <p>
            <span class="govuk-!-font-size-19 govuk-!-font-weight-bold">{{ this.selectedItem.fullName }}</span><br>
            <span class="">{{ this.selectedItem.email }}</span>
          </p>
          <form @submit.prevent="validateAndSave">
            <DateInput
              id="feedback-date"
              v-model="formData.feedbackDate"
              label="Date feedback was requested"
            />
            <DateInput
              id="feedback-date-after"
              v-model="formData.feedbackDateAfter"
              label="Target date 20 working days after feedback requested"
            />
            <Select
              id="feedback-grade"
              v-model="formData.feedbackGrade"
              required
            >
              <option
                v-for="fg in feedbackGradeTypes"
                :key="fg"
                :value="fg"
              >
                {{ fg | lookup }}
              </option>
            </Select>
          </form>
        </div>
        <div>
          <button
            v-if="selectedItem"
            class="govuk-button govuk-!-margin-right-3"
            @click="btnModalRequestFeeback"
          >
            Request Feedback
          </button>
          <button 
            class="govuk-button govuk-button--secondary" 
            @click.prevent="closeModal('modalFeedback')"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>

import TabsList from '@jac-uk/jac-kit/draftComponents/TabsList';
import Modal from '@jac-uk/jac-kit/components/Modal/Modal';
import Table from '@jac-uk/jac-kit/components/Table/Table';
import TableCell from '@jac-uk/jac-kit/components/Table/TableCell';
import DateInput from '@jac-uk/jac-kit/draftComponents/Form/DateInput';
import Select from '@jac-uk/jac-kit/draftComponents/Form/Select';

export default {
  name: 'Feedback',
  components: {
    Table,
    TableCell,
    TabsList,
    Modal,
    DateInput,
    Select,
  },
  data() {
    return {
      activeTab: 'requested',
      TABS: {
        REQUESTED: 'requested',
        READY: 'ready',
        REVIEWING: 'reviewing',
        APPROVED: 'approved',
        SENT: 'sent',
      },
      selectedItem: null,
      filters: [
      ],
      feedbackGradeTypes: [
        'A - Outstanding',
        'B - Strong',
        'C - Selectable',
        'D - Not Present Selectable',
      ],
      formData: {
        feedbackDate: new Date(),
        feedbackGrade: 'D - Not Present Selectable',
      },
    };
  },
  created() {
    
  },
  computed: {
    tableData() {
      return this.$store.state.candidates.records;
    },
    tabs(){
      return Object.values(this.TABS).map(title => {
        return {
          ref: title,
          title: `${title.charAt(0).toUpperCase()}${title.slice(1)}`,
        };
      });
    },
    records() {
      return this.$store.getters['applications/data'];
      // return [];
    },
    tableColumns() {
      const tableColumns = [
        { title: 'Name' },
        { title: 'Updated' },
        { title: 'Number of Applications' },
      ];
      return tableColumns;
    },
  },
  methods: {
    // preview(label, item) {
    //   console.log(label, item);
    // },
    btnRequestFeeback() {
      this.openModal('modalFeedback');
    },
    btnModalRequestFeeback() {
      // actions when requesting feedback

    },
    closeModal(modalId) {
      this.selectedItem = null;
      this.$refs[modalId].closeModal();
    },
    openModal(modalId) {
      this.$refs[modalId].openModal();
    },
    getTableData(params) {
      this.$store.dispatch('candidates/bind', params);
    },
    async candidateSearch(searchTerm) {
      return await this.$store.dispatch('candidates/search', { searchTerm: searchTerm });
    },
    countApplications(candidate) {
      if (candidate && candidate.computed && candidate.computed.totalApplications) {
        return candidate.computed.totalApplications;
      } else {
        return 0;
      }
    },
    selectCandidate(id) {
      const selectedCandidate = this.tableData.filter(item => {
        return item.id === id;
      });
      this.selectedItem = selectedCandidate[0];
      // this.formData.feedbackDate = new Date();
      this.formData.feedbackDateAfter = this.calculateWorkingDaysAhead();
      // console.log('candidate: ', this.formData.feedbackDate, this.formData.feedbackDateAfter);
    },
    calculateWorkingDaysAhead() {
      const daysAhead = this.calculateDaysWithWorkingDays(20);
      const newStartDate = new Date();
      const newWorkingDaysAhead = newStartDate.setDate(newStartDate.getDate() + daysAhead);
      return new Date(newWorkingDaysAhead);
    },
    calculateDaysWithWorkingDays(numWorkingDays) {
      // method to add weekend days into the working days
      return numWorkingDays + 6;
    },
  },
};
</script>

<style scoped>
  .feedback .modal__content {
    text-align: left;
  }
</style>

<style>
  .feedback .modal {
    min-width: 60%;
    max-width: 70%;
  }
  .feedback .modal .govuk-grid-column-one-half {
    width: 100%;
  }
  .feedback .modal legend {
    font-size: 19px;
    color: #505A5F;
    font-style: normal;
    font-weight: 400;
  }
</style>
