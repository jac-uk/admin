<template>
  <div>
    <h2 class="govuk-heading-l">
      Qualifying tests
    </h2>
    <Table 
      v-if="hasData"
      data-key="id"
      :data="qualifyingTests"
      :columns="[
        { title: 'Title' },
        { title: 'Type' },
        { title: 'Status' },
      ]"
    >
      <template #row="{row}">
        <TableCell>
          <RouterLink
            :to="{ name: 'qualifying-test-view', params: { qualifyingTestId: row.id } }"
          >
            {{ row.title | showAlternative(row.id) }}
          </RouterLink>
        </TableCell>
        <TableCell>{{ row.type | lookup }}</TableCell>
        <TableCell>{{ row.status | lookup }}</TableCell>
      </template>
    </Table>

    <button
      class="govuk-button govuk-!-margin-right-3"
      @click="btnCreate"
    >
      Create New
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
    qualifyingTests() {
      const qtList = this.$store.state.qualifyingTest.records;
      return qtList;
    },
    hasData() {
      return this.qualifyingTests.length > 0;
    },
    exerciseId() {
      return this.$route.params.id;
    },
  },
  async created() {
    this.$store.dispatch('qualifyingTest/bindQTs', this.exerciseId );
  },
  methods: {
    btnCreate() {
      this.$router.push({ name: 'qualifying-test-new' });
    },
  },
};
</script>

<style scoped>
  .separator {
    height: 100px;
  }
</style>
