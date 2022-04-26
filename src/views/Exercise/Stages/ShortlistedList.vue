<template>
  <div>
    <Banner
      :message="message"
      status="success"
    />
    <form>
      <div class="moj-page-header-actions govuk-!-margin-bottom-2">
        <div class="moj-page-header-actions__title">
          <h1 class="govuk-heading-l">
            Shortlisted ({{ totalApplicationRecords }})
          </h1>
        </div>
        <div
          v-if="hasPermission(PERMISSIONS.exercises.permissions.canUpdateExercises.value)"
          class="moj-page-header-actions__actions float-right"
        >
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
      <p
        v-if="!applicationRecords.length"
        class="govuk-body govuk-!-margin-bottom-0"
      >
        No Shortlisted Applications
      </p>
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
            {{ row.flags.empApplied | toYesNo | lookup }}
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
import Permission from '@/components/Permission';

export default {
  components: {
    Banner,
    Table,
    TableCell,
  },
  extends: Permission,
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
      return (this.exercise && this.exercise._applicationRecords && this.exercise._applicationRecords.shortlisted) || 0;
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
