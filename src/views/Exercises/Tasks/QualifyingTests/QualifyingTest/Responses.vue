<template>
  <div class="govuk-grid-column-full govuk-!-margin-bottom-1">
    <h3 
      class="govuk-heading-m"
    >
      Qualifying Test: Recorder 2020 Qualifying Test [{{ qualifyingTestId }} / {{ searchStatus }}] 
    </h3>

    <Table 
      data-key="id"
      :data="applications"
      :columns="[
        { title: 'Reference number' },
        { title: 'Name' },
        { title: 'Status' },
      ]"
    >
      <template #row="{row}">
        <TableCell>
          <RouterLink
            :to="{ name: 'exercise-application', params: { applicationId: row.id } }"
          >
            {{ row.id }}
          </RouterLink> 
        </TableCell>
        <TableCell>
          <RouterLink
            :to="{ name: 'candidates-view', params: { id: row.candidate.id } }"
          >
            {{ row.candidate.id }}
          </RouterLink> 
        </TableCell>
        <TableCell>{{ row.status}}</TableCell>
      </template>
    </Table>
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
  computed: {
    applications() {
      const responsesList = this.$store.state.qualifyingTestResponses.records;
      // eslint-disable-next-line no-console
      console.log('responsesList', responsesList);
      return responsesList;
    },
    qualifyingTestId() {
      return this.$route.params.qualifyingTestId;
    },
    searchStatus() {
      return this.$route.params.status;
    },
  },
  async created() {
    this.$store.dispatch('qualifyingTestResponses/bind', { qualifyingTestId: this.qualifyingTestId, searchStatus: this.searchStatus });
  },
};
</script>
