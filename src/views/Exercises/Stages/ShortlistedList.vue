<template>
  <div>
    <Banner
      :message="message"
      status="success"
    />
    <form>
      <div class="moj-page-header-actions">
        <div class="moj-page-header-actions__title">
          <h1 class="govuk-heading-l">
            Shortlisted ({{ totalApplicationRecords }})
          </h1>
        </div>
        <div class="moj-page-header-actions__actions">
          <div class="moj-button-menu">
            <div class="moj-button-menu__wrapper">
              <button
                class="govuk-button govuk-button--secondary moj-button-menu__item moj-page-header-actions__action govuk-!-margin-right-2"
                :disabled="isButtonDisabled"
                @click.prevent="moveBack()"
              >
                Move back to ...
              </button>
              <button
                class="govuk-button moj-button-menu__item moj-page-header-actions__action govuk-!-margin-right-2"
                :disabled="isButtonDisabled"
                @click.prevent="setStatus()"
              >
                Set status
              </button>
            </div>
          </div>
        </div>
      </div>
      <Table
        data-key="id"
        :data="applicationRecords"
        :columns="tableColumns"
        multi-select
        :selection.sync="selectedItems"
        :page-size="50"
        @change="getTableData"
      >
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
            {{ row | candidateHasIssues }}
          </TableCell>
          <TableCell :title="tableColumns[3].title">
            {{ row.status | lookup }}
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
      return this.$store.state.stageShortlisted.records;
    },
    totalApplicationRecords() {
      if (this.exercise && this.exercise.applicationRecords && this.exercise.applicationRecords.shortlisted){
        return this.exercise.applicationRecords.shortlisted;
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
    selectAll: {
      get: function () {
        return this.applicationRecords ? this.selectedItems.length == this.applicationRecords.length : false;
      },
      set: function (value) {
        const selectedItems = [];
        if (value) {
          this.applicationRecords.forEach((item) => {
            selectedItems.push(item.id);
          });
        }
        this.selectedItems = selectedItems;
      },
    },
  },
  async created() {
    this.message = await this.$store.dispatch('stageShortlisted/getMessages');
    this.selectedItems = this.$store.state.stageShortlisted.selectedItems;
  },
  methods: {
    moveBack() {
      this.$store.dispatch('stageShortlisted/storeItems', { items: this.selectedItems });
      this.$router.push({ name: 'exercise-stages-shortlisted-back' });
    },
    setStatus() {
      this.$store.dispatch('stageShortlisted/storeItems', { items: this.selectedItems });
      this.$router.push({ name: 'exercise-stages-shortlisted-edit' });
    },
    getTableData(params) {
      this.$store.dispatch(
        'stageShortlisted/bind',
        {
          exerciseId: this.exercise.id,
          ...params,
        }
      );
    },
  },
};
</script>
