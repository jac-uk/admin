<template>
  <div class="govuk-grid-column-full govuk-!-margin-bottom-1">
    <h2 class="govuk-heading-m">
      Qualifying Test Responses / {{ searchStatus | lookup }}
    </h2>
    <h3 class="govuk-heading-l">
      {{ qualifyingTest.title | showAlternative(qualifyingTest.id) }}
    </h3>

    <Table
      data-key="id"
      :data="responses"
      :page-size="50"
      :columns="[
        { title: 'Name', sort: 'candidate.fullName', default: true },
        { title: 'Status', sort: 'status' },
        { title: 'Time Limit', sort: 'duration.testDurationAdjusted' },
        { title: 'Action' },
      ]"
      :search="['candidate.fullName']"
      @change="getTableData"
    >
      <template #row="{row}">
        <TableCell>
          {{ row.candidate.fullName | showAlternative(row.candidate.id) }}
        </TableCell>
        <TableCell>{{ row.status | lookup }}</TableCell>
        <TableCell>{{ formatTimeLimit(row.duration.testDurationAdjusted) }}</TableCell>
        <TableCell>
          <span v-if="isReasonableAdjustment(row.candidate.reasonableAdjustments)">
            Reasonable Adjustment
            <EditableField 
              :value="row.duration.reasonableAdjustment"
              field="reasonableAdjustment"
              @changefield="(obj) => actionReasonableAdjustment(obj, row.duration, row.id)"
            />
          </span> 
          <RouterLink
            :to="{ name: 'qualifying-test-response-view', params: { qualifyingTestId: qualifyingTestId, responseId: row.id, status: 'all' } }"
          >
            View
          </RouterLink>
        </TableCell>
      </template>
    </Table>
  </div>    
</template>

<script>
import Table from '@/components/Page/Table/Table'; 
import TableCell from '@/components/Page/Table/TableCell'; 
import EditableField from '@/components/EditableField';

export default {
  components: {
    Table,
    TableCell,
    EditableField,
  },
  computed: {
    responses() {
      const responsesList = this.$store.state.qualifyingTestResponses.records;
      return responsesList;
    },
    qualifyingTest() {
      const record = this.$store.state.qualifyingTest.record;
      return record;
    },
    qualifyingTestId() {
      return this.$route.params.qualifyingTestId;
    },
    searchStatus() {
      return this.$route.params.status;
    },
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
    actionReasonableAdjustment(obj, duration, id) {
      const reasonableAdjustment = Number(obj.reasonableAdjustment);
      const calculation = reasonableAdjustment + Number(duration.testDuration);
      const returnObj = { 
        duration: {
          testDuration: duration.testDuration,
          testDurationAdjusted: calculation,
          reasonableAdjustment: reasonableAdjustment,
        },
      };
      // eslint-disable-next-line no-console
      // console.log('changeReasonableAdjustment', id, obj, duration, returnObj);
      this.$store.dispatch('qualifyingTestResponses/updateRA', { data: returnObj, id: id });
    },
    getTableData(params) {
      this.$store.dispatch(
        'qualifyingTestResponses/bind',
        { 
          qualifyingTestId: this.qualifyingTestId, 
          searchStatus: this.searchStatus,
          ...params,
        }
      );
    },
  },
};
</script>
