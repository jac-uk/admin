<template>
  <div>
    <h1
      class="govuk-heading-xl govuk-!-margin-bottom-6"
    >
      Candidates
    </h1>
    <Table
      data-key="id"
      :data="tableData"
      :page-size="50"
      :columns="tableColumns"
      :search="['fullName']"
      @change="getTableData"
    >
      <template #row="{row}">
        <TableCell :title="tableColumns[0].title">
          <RouterLink
            :to="{ name: 'candidates-view', params: { id: row.id } }"
          >
            {{ row.fullName | showAlternative(row.id) }}
          </RouterLink>
        </TableCell>
        <TableCell :title="tableColumns[1].title">
          {{ new Date(row.created) | formatDate('long') }}
        </TableCell>
        <TableCell :title="tableColumns[2].title">
          <span v-if="row.applications && row.applications.applied">
            {{ row.applications.applied }}
          </span>
          <span v-else>0</span>
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
  data() {
    return {
      tableColumns: [
        { title: 'Name', sort: 'fullName' },
        { title: 'Account created on', sort: 'created', direction: 'desc', default: true },
        { title: 'Number of Applications', sort: 'applications.applied', direction: 'desc' },
      ],
    };
  },
  computed: {
    tableData() {
      return this.$store.state.candidates.records;
    },
  },
  methods: {
    getTableData(params) {
      this.$store.dispatch('candidates/bind', params);
    },
  },
};
</script>
