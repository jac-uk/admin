<template>
  <div>
    <!-- <div class="moj-page-header">
      <div class="moj-page-header-actions__title">
        <h2 class="govuk-heading-l">
          Open
        </h2>
      </div>
    </div> -->

    <Table
      v-if="!noApplications"
      data-key="id"
      :data="candidateApplications"
      :columns="tableColumns"
      local-data
    >
      <template #row="{row}">
        <!-- {{ Object.keys(row) }} -->
        <TableCell>
          <strong>
            {{ row.exerciseRef }}
          </strong>
          - {{ row.exerciseName }}
        </TableCell>
        <TableCell>
          {{ getStatus(row) | lookup }}{{ getStatus(row) && getStage(row) ? ' / ' : '' }}
          <strong>
            {{ getStage(row) }}
          </strong>
        </TableCell>
        <TableCell>
          <RouterLink
            :to="{ name: 'exercise-application', params: { id: row.exerciseId, applicationId: row.id } }"
            target="_blank"
          >
            View Application
          </RouterLink>
        </TableCell>
      </template>
    </Table>
    <p v-if="noApplications">
      There are no applications
    </p>
  </div>
</template>

<script>
import Table from '@jac-uk/jac-kit/components/Table/Table';
import TableCell from '@jac-uk/jac-kit/components/Table/TableCell';

export default {
  components: {
    Table,
    TableCell,
  },
  props: {
    candidateId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      tableColumns: [
        { title: 'Exercise', sort: 'exerciseRef', direction: 'desc' },
        { title: 'Outcome', sort: '_processing.status', direction: 'desc', default: true },
        { title: 'Action' },
      ],
    };
  },
  computed: {
    candidateApplications() {
      const records = this.$store.state.candidateApplications.records;
      return records;
    },
    noApplications() {
      return this.candidateApplications.length === 0;
    },
  },
  async created() {
    this.$store.dispatch('candidateApplications/bind', { candidateId: this.candidateId });
  },
  methods: {
    getStage(application) {
      return application._processing ? application._processing.stage : null;
    },
    getStatus(application) {
      return application._processing ? application._processing.status : application.status;
    },
  },
};
</script>

<style scoped>
  td {
    text-transform: capitalize;
  }
</style>
