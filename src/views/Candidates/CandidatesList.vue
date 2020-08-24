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
      :columns="[
        { title: 'Name', sort: 'fullName' },
        { title: 'Account created on', sort: 'created', direction: 'desc', default: true },
        { title: 'Number of Applications', sort: 'applications.applied', direction: 'desc' },
      ]"
      :search="['fullName']"
      @change="getTableData"
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

export default {
  components: {
    Table,
    TableCell,
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
