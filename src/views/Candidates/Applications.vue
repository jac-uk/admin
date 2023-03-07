<template>
  <div>
    <Table
      data-key="id"
      :data="candidateApplications"
      :columns="tableColumns"
      @change="getTableData"
    >
      <template #row="{row}">
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
        { title: 'Exercise', sort: 'exerciseRef', direction: 'desc', default: true },
        { title: 'Outcome', sort: '_processing.stage', direction: 'desc' },
        { title: 'Action' },
      ],
    };
  },
  computed: {
    candidateApplications() {
      const records = this.$store.state.candidateApplications.records;
      return records;
    },
  },
  methods: {
    getTableData(params) {
      const queryParams = { ...params, candidateId: this.candidateId };
      this.$store.dispatch('candidateApplications/bind', queryParams);
    },
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
