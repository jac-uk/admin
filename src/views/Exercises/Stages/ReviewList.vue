<template>
  <div>
    <Banner
      :message="message"
      status="success"
    />
    <form @submit.prevent="checkForm">
      <div class="moj-page-header-actions">
        <div class="moj-page-header-actions__title">
          <h1 class="govuk-heading-l">
            Review ({{ totalApplicationRecords }})
          </h1>
        </div>
      </div>
      <Table
        data-key="id"
        :data="applicationRecords"
        :columns="tableColumns"
        multi-select
        :selection.sync="selectedItems"
        :page-size="50"
        :search="['candidate.fullName']"
        :filters="[
          {
            title: 'Status',
            field: 'status',
            type: 'checkbox',
            options: availableStatuses.concat(['']),
          },
        ]"
        @change="getTableData"
      >
        <template #actions>
          <button
            class="govuk-button moj-button-menu__item moj-page-header-actions__action govuk-!-margin-right-2"
            :disabled="isButtonDisabled"
          >
            Set status
          </button>
        </template>

        <template #row="{row}">
          <TableCell :title="tableColumns[0].title">
            <RouterLink
              :to="{ name: 'exercise-application', params: { applicationId: row.id } }"
            >
              {{ row.application.referenceNumber }}
            </RouterLink>
          </TableCell>
          <TableCell :title="tableColumns[1].title">
            <RouterLink
              :to="{ name: 'candidates-view', params: { id: row.candidate.id } }"
            >
              {{ row.candidate.fullName }}
            </RouterLink>
          </TableCell>
          <TableCell :title="tableColumns[2].title">
            {{ row.status | lookup }}
          </TableCell>
          <TableCell :title="tableColumns[3].title">
            {{ row | candidateHasIssues }}
          </TableCell>
          <TableCell :title="tableColumns[4].title">
            {{ row.flags.empApplied | toYesNo }}
          </TableCell>
        </template>
      </Table>
    </form>
  </div>
</template>

<script>
import Banner from '@jac-uk/jac-kit/draftComponents/Banner';
import Table from '@jac-uk/jac-kit/components/Table/Table';
import TableCell from '@jac-uk/jac-kit/components/Table/TableCell';

export default {
  components: {
    Banner,
    Table,
    TableCell,
  },
  data() {
    return {
      message: null,
      selectedItems: [],
      tableColumns: [
        { title: 'Reference number' },
        { title: 'Name', sort: 'candidate.fullName', default: true },
        { title: 'Issues' },
        { title: 'Status' },
        { title: 'EMP' },
      ],
    };
  },
  computed: {
    applicationRecords() {
      return this.$store.state.stageReview.records;
    },
    totalApplicationRecords() {
      if (this.exercise && this.exercise.applicationRecords && this.exercise.applicationRecords.review){
        return this.exercise.applicationRecords.review;
      } else {
        return 0;
      }
    },
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    isButtonDisabled() {
      const isDisabled = this.selectedItems && this.selectedItems.length;
      return !isDisabled;
    },
    availableStatuses() {
      const shortlistingMethods = this.exercise.shortlistingMethods;
      const otherShortlistingMethod = this.exercise.otherShortlistingMethod || [];
      return this.$store.getters['stageReview/availableStatuses'](shortlistingMethods, otherShortlistingMethod) ;
    },
  },
  async created() {
    this.message = await this.$store.dispatch('stageReview/getMessages');
    this.selectedItems = this.$store.state.stageReview.selectedItems;
  },
  methods: {
    checkForm() {
      this.$store.dispatch('stageReview/storeItems', { items: this.selectedItems });
      this.$router.push({ name: 'exercise-stages-review-edit' });
    },
    getTableData(params) {
      this.$store.dispatch(
        'stageReview/bind',
        {
          exerciseId: this.exercise.id,
          ...params,
        }
      );
    },

  },
};
</script>
