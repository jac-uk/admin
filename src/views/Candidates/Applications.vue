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
      :data="applicationRecords"
      :columns="[
        { title: 'Exercise' },
        { title: 'Outcome' },
        { title: 'Action' },
      ]"
      local-data
    >
      <template #row="{row}">
        <TableCell>
          {{ row.exerciseName }}
        </TableCell>
        <TableCell>
          {{ row.status | lookup }}{{ row.status && row.stage ? ' / ' : '' }}
          <strong>
            {{ row.stage }}
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
  computed: {
    applicationRecords() {
      const records = this.$store.state.candidateApplications.records;
      return records;
    },
    noApplications() {
      return this.applicationRecords.length === 0;
    },
  },
  async created() {
    this.$store.dispatch('candidateApplications/bind', { candidateId: this.candidateId });
  },
  methods: {
  },
};
</script>

<style scoped>
  td {
    text-transform: capitalize;
  }
</style>
