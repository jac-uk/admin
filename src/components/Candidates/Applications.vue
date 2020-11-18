<template>
  <div>
    <!-- <div class="moj-page-header-actions">
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
    >
      <template #row="{row}">
        <TableCell>
          {{ row.exercise.name }}
        </TableCell>
        <TableCell>
          {{ row.status | lookup }}{{ row.status && row.stage ? ' / ' : '' }}{{ row.stage }} 
        </TableCell>
        <TableCell>
          <RouterLink :to="{ name: 'exercise-application', params: { id: row.exercise.id, applicationId: row.id } }">
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
import Table from '@/components/Page/Table/Table'; 
import TableCell from '@/components/Page/Table/TableCell'; 

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
