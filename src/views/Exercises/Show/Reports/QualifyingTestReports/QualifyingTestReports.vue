<template>
  <div>
    <h2 class="govuk-heading-l">
      Qualifying test reports
    </h2>
    <Table
      v-if="hasData"
      data-key="id"
      :data="qualifyingTestReports"
      :columns="[
        { title: 'Title' },
      ]"
    >
      <template #row="{row}">
        <TableCell>
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
import Table from '@/components/Page/Table/Table';
import TableCell from '@/components/Page/Table/TableCell';

export default {
  components: {
    Table,
    TableCell,
  },
  computed: {
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    qualifyingTestReports() {
      const qtList = this.$store.getters['qualifyingTestReports/data'];
      return qtList;
    },
    hasData() {
      return this.qualifyingTestReports && this.qualifyingTestReports.length > 0;
    },
    exerciseId() {
      return this.$route.params.id;
    },
  },
  async created() {
    this.$store.dispatch('qualifyingTestReports/bind', { exerciseId: this.exerciseId } );
  },
  methods: {
    btnCreate() {
      this.$router.push({ name: 'qualifying-test-report-create' });
    },
  },
};
</script>
