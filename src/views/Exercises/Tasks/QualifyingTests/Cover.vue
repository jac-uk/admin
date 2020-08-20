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

    <div class="separator">
      <br>
    </div>
    QTs Cover Page [{{ exerciseId }}]
    <ul>
      <li>
        <RouterLink
          :to="{ name: 'qualifying-test-view', params: { qualifyingTestId: 'l0w8PeHoi06IpAXjFdEC' } }"
        >
          QT Dash
        </RouterLink>
      </li>
      <li>
        <RouterLink
          :to="{ name: 'qualifying-test-new' }"
        >
          Create QT
        </RouterLink>
      </li>
      <li>
        <RouterLink
          :to="{ name: 'qualifying-test-edit', params: { qualifyingTestId: '12345' } }"
        >
          QT Edit
        </RouterLink>
      </li>
      <li>
        <RouterLink
          :to="{ name: 'qualifying-test-review', params: { qualifyingTestId: '12345' } }"
        >
          QT Review
        </RouterLink>
      </li>
      <li>
        <RouterLink
          :to="{ name: 'qualifying-test-responses', params: { qualifyingTestId: '12345', status: 'all' } }"
        >
          QT Responses all
        </RouterLink>
      </li>
      <li>
        <RouterLink
          :to="{ name: 'qualifying-test-responses', params: { qualifyingTestId: '12345', status: 'in-progress' } }"
        >
          QT Responses in progress
        </RouterLink>
      </li>
      <li>
        <RouterLink
          :to="{ name: 'qualifying-test-responses', params: { qualifyingTestId: '12345', status: 'completed' } }"
        >
          QT Responses completed
        </RouterLink>
      </li>
      <li>
        <RouterLink
          :to="{ name: 'qualifying-test-responses', params: { qualifyingTestId: '12345', status: 'adjustments' } }"
        >
          QT Responses adjustments 
        </RouterLink>
      </li>
      <li>
        <RouterLink
          :to="{ name: 'qualifying-test-response-view', params: { qualifyingTestId: '12345', responseId: '54321', status: 'all' } }"
        >
          QT Response
        </RouterLink>
      </li>
    </ul>
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
