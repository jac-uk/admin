<template>
  <div>
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <h1
          class="govuk-heading-xl govuk-!-margin-bottom-6"
        >
          Candidates
        </h1>
      </div>
      <div class="govuk-grid-column-one-third govuk-!-text-align-right">
        <router-link
          class="govuk-button govuk-button--secondary govuk-!-margin-right-3 govuk-!-margin-bottom-0"
          :to="{name: 'targeted-outreach-report'}"
        >
          Targeted Outreach Report
        </router-link>
      </div>
    </div>
    <Table
      data-key="id"
      :data="tableData"
      :page-size="50"
      :columns="tableColumns"
      :custom-search="{
        placeholder: 'Search candidate names',
        handler: candidateSearch,
        field: 'id',
      }"
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
          {{ countApplications(row) | formatNumber }}
        </TableCell>
      </template>
    </Table>
  </div>
</template>

<script>
import Table from '@jac-uk/jac-kit/components/Table/Table';
import TableCell from '@jac-uk/jac-kit/components/Table/TableCell';

export default {
  name: 'CandidatesView',
  components: {
    Table,
    TableCell,
  },
  data() {
    return {
      tableColumns: [
        { title: 'Name', sort: 'fullName' },
        { title: 'Account created on', sort: 'created', direction: 'desc', default: true },
        { title: 'Number of Applications', sort: 'computed.totalApplications', direction: 'desc' },
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
    async candidateSearch(searchTerm) {
      return await this.$store.dispatch('candidates/search', { searchTerm: searchTerm });
    },
    countApplications(candidate) {
      if (candidate && candidate.computed && candidate.computed.totalApplications) {
        return candidate.computed.totalApplications;
      } else {
        return 0;
      }
    },
  },
};
</script>
