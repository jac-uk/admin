<template>
  <div class="govuk-grid-column-full">
    <div class="moj-page-header-actions">
      <div class="moj-page-header-actions__title">
        <h2 class="govuk-heading-l">
          Handover
        </h2>
      </div>

      <div
        class="moj-page-header-actions__actions float-right"
      >
        <div class="moj-button-menu">
          <div class="moj-button-menu__wrapper">
            <button
              class="govuk-button govuk-button--secondary moj-button-menu__item moj-page-header-actions__action"
              data-module="govuk-button"
              @click="exportData()"
            >
              Export data
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="govuk-grid-row">
      <div class="govuk-grid-column-one-half">
        <div class="panel govuk-!-margin-bottom-9">
          <span class="govuk-caption-m">
            Approved for immediate appointment
          </span>
          <h2 class="govuk-heading-m govuk-!-margin-bottom-0">
            {{ totalApplicationRecords }}
          </h2>
        </div>
      </div>
      <div class="govuk-grid-column-one-half">
        <div class="panel govuk-!-margin-bottom-9">
          <span class="govuk-caption-m">Type of exercise</span>
          <h2 class="govuk-heading-m govuk-!-margin-bottom-0">
            {{ exercise.typeOfExercise | lookup }}
          </h2>
        </div>
      </div>
    </div>

    <Table
      data-key="id"
      :data="getPaginated"
      :columns="[
        {
          title:'Reference number',
          class: ['govuk-!-width-one-third'],
        },
        { title: 'Name' },
      ]"
    >
      <template #row="{row}">
        <TableCell>
          <RouterLink
            :to="{ name: 'exercise-application', params: { applicationId: row.id } }"
          >
            {{ row.application.referenceNumber }}
          </RouterLink>
        </TableCell>
        <TableCell>
          <RouterLink
            :to="{ name: 'candidates-view', params: { id: row.candidate.id } }"
          >
            {{ row.candidate.fullName }}
          </RouterLink>
        </TableCell>
      </template>
    </Table>
    <Pagination
      :high-index="numberOfPages"
      @pageChanged="updatePage($event)"
    />
  </div>
</template>

<script>
import Table from '@/components/Page/Table/Table';
import TableCell from '@/components/Page/Table/TableCell';
import Pagination from '@/components/Page/Pagination';
import { APPLICATION_STATUS } from '@/helpers/constants';

export default {
  components: {
    Table,
    TableCell,
    Pagination,
  },
  data() {
    return {
      page: 1,
      pageSize: 25,
    };
  },
  computed: {
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    applicationRecords() {
      return this.$store.state.stageHandover.records;
    },
    totalApplicationRecords() {
      return this.applicationRecords.length;
    },
    numberOfPages() {
      return Math.ceil(this.totalApplicationRecords / this.pageSize);
    },
    getPaginated() {
      if (this.numberOfPages){
        if (this.page > this.numberOfPages) throw `Page ${this.page} exceeds page size of ${this.numberOfPages}`;

        const sliceFrom = ((this.page - 1) * this.pageSize);
        const sliceTo = sliceFrom + this.pageSize;
        const sliced = this.applicationRecords.slice(sliceFrom, sliceTo);

        return sliced;
      } else {
        return this.applicationRecords;
      }
    },
  },
  async created() {
    this.$store.dispatch('stageHandover/bind', {
      exerciseId: this.exercise.id,
      status: APPLICATION_STATUS.APPROVED_FOR_IMMEDIATE_APPOINTMENT,
    });
  },
  methods: {
    updatePage(pageChanged){
      this.page = pageChanged;
    },
    exportData() {
    },
  },
};
</script>
