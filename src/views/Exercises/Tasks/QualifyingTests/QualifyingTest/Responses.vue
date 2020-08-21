<template>
  <div class="govuk-grid-column-full govuk-!-margin-bottom-1">
    <h2 class="govuk-heading-m">
      Qualifying Test  / {{ searchStatus | lookup }}
    </h2>
    <h3 class="govuk-heading-l">
      {{ qualifyingTest.title | showAlternative(qualifyingTest.id) }}
    </h3>

    <Table 
      v-if="!isEmptyResults"
      data-key="id"
      :data="applications"
      :columns="[
        { title: 'Name' },
        { title: 'Status' },
        { title: 'Time Limit' },
        { title: 'Action' },
      ]"
    >
      <template #row="{row}">
        <TableCell>
          <RouterLink
            :to="{ name: 'candidates-view', params: { id: row.candidate.id } }"
          >
            {{ row.candidate.fullName | showAlternative(row.candidate.id) }}
          </RouterLink> 
        </TableCell>
        <TableCell>{{ row.status | lookup }}</TableCell>
        <TableCell>{{ formatTimeLimit(row.duration.testDurationAdjusted) }}</TableCell>
        <TableCell>
          <span v-if="isReasonableAdjustment(row.candidate.reasonableAdjustments)">Reasonable Adjustment</span> 
          <RouterLink
            :to="{ name: 'qualifying-test-response-view', params: { qualifyingTestId: qualifyingTestId, responseId: row.id, status: 'all' } }"
          >
            Response
          </RouterLink>
        </TableCell>
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
      // console.log('responsesList', responsesList);
      return responsesList;
    },
    qualifyingTest() {
      const record = this.$store.state.qualifyingTest.record;
      // eslint-disable-next-line no-console
      // console.log('record', record);
      return record;
    },
    qualifyingTestId() {
      return this.$route.params.qualifyingTestId;
    },
    searchStatus() {
      return this.$route.params.status;
    },
    isEmptyResults() {
      return this.applications.length === 0;
    },
  },
  async created() {
    this.$store.dispatch('qualifyingTestResponses/bind', { qualifyingTestId: this.qualifyingTestId, searchStatus: this.searchStatus });
  },
  methods: {
    isReasonableAdjustment(needAdjustment) {
      return needAdjustment;
    },
    formatTimeLimit(timeLimit) { // TODO
      // Function to format the time limit
      // If activated ...
      // If Started ...
      // If completed
      return `${timeLimit} min`;
    },
    actionReasonableAdjustment() {
      // TODO Action do when reasonable adjustment is clickec:
      // - choose the afjustment to be made in terms of minutes
    },
  },
};
</script>
