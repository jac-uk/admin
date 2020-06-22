<template>
  <div>
    <div class="moj-page-header-actions">
      <div class="moj-page-header-actions__title">
        <h2 class="govuk-heading-l">
          Open
        </h2>
      </div>
    </div>
    <Table 
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
          {{ row.stage }}
        </TableCell>
        <TableCell>
          <RouterLink :to="{ name: 'exercise-application', params: { id: row.exercise.id, applicationId: row.id } }">
            View Application
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
  props: {
    candidateId: {
      type: String,
      default: '',
    },
  },
  computed: {
    applicationRecords() {
      const records = this.$store.state.applicationRecords.records;
      // eslint-disable-next-line no-console
      console.log('applicationRecords', records);
      return records;
    },
  },
  async created() {
    this.$store.dispatch('applicationRecords/bind', { candidateId: this.candidateId });
  },
  methods: {
  },
};
</script>
