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
            class="govuk-link"
            :to="{ name: getViewName(row), params: { qualifyingTestId: row.id } }"
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
import { QUALIFYING_TEST } from '@/helpers/constants';

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
    getViewName(qualifyingTest) {
      if (
        qualifyingTest.status === QUALIFYING_TEST.STATUS.CREATED
        || qualifyingTest.status === QUALIFYING_TEST.STATUS.SUBMITTED
        || qualifyingTest.status === QUALIFYING_TEST.STATUS.APPROVED
      ) {
        return 'qualifying-test-review';
      } else {
        return 'qualifying-test-view';
      }
      // 
    },
  },
};
</script>

<style scoped>
  .separator {
    height: 100px;
  }
</style>
