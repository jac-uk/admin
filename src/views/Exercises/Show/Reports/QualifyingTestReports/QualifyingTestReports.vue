<template>
  <div>
    <h2 class="govuk-heading-l">
      Qualifying test reports
    </h2>
    <Table
      data-key="id"
      :data="qualifyingTestReports"
      :columns="tableColumns"
      :page-size="50"
      @change="getTableData"
    >
      <template #row="{row}">
        <TableCell :title="tableColumns[0].title">
          <RouterLink
            class="govuk-link"
            :to="{ name: 'qualifying-test-report-view', params: { qualifyingTestReportId: row.id } }"
          >
            {{ row.title | showAlternative(row.id) }}
          </RouterLink>
        </TableCell>
      </template>
    </Table>

    <button
      class="govuk-button govuk-!-margin-right-3"
      @click="btnCreate"
    >
      Create new report
    </button>
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
  data() {
    return {
      tableColumns: [
        { title: 'Title' },
      ],
    };
  },
  computed: {
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    qualifyingTestReports() {
      return this.$store.getters['qualifyingTestReports/data'];
    },
    exerciseId() {
      return this.$route.params.id;
    },
  },
  methods: {
    btnCreate() {
      this.$router.push({ name: 'qualifying-test-report-create' });
    },
    getTableData(params) {
      this.$store.dispatch(
        'qualifyingTestReports/bind',
        {
          exerciseId: this.exercise.id,
          ...params,
        }
      );
    },
  },
};
</script>
