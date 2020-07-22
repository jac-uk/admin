<template>
  <div>
    <h1
      class="govuk-heading-xl govuk-!-margin-bottom-6"
    >
      Candidates
    </h1>
    <Search @search="useSearch" />
    <Table 
      data-key="id"
      :data="candidateRecords"
      :columns="[
        { title: 'Name' },
        { title: 'Account created on' },
        { title: 'Number of Applications' },
      ]"
    >
      <template #row="{row}">
        <TableCell>
          <RouterLink
            :to="{ name: 'candidates-view', params: { id: row.id } }"
          >
            {{ row.fullName | showAlternative(row.id) }}
          </RouterLink>
        </TableCell>
        <TableCell>{{ new Date(row.created) | formatDate('long') }}</TableCell>
        <TableCell>
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
import Table from '@/components/Page/Table/Table'; 
import TableCell from '@/components/Page/Table/TableCell'; 
import Search from '@/components/Search'; 

export default {
  components: {
    Table,
    TableCell,
    Search,
  },
  computed: {
    candidateRecords() {
      const localRecords = this.$store.state.candidates.records;
      return localRecords;
    },
  },
  async created() {
    this.$store.dispatch('candidates/search', '');
  },
  methods: {
    useSearch(searchTem) {
      this.$store.dispatch('candidates/search', searchTem);
    },
  },
};
</script>
