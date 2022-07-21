<template>
  <div>
    <Table
      data-key="score"
      :data="scores"
      :columns="tableColumns"
      local-data
    >
      <template #row="{row}">
        <TableCell :title="tableColumns[0].title">
          {{ row.rank }}
        </TableCell>
        <TableCell :title="tableColumns[1].title">
          {{ row.count }}
        </TableCell>
        <TableCell :title="tableColumns[2].title">
          <RouterLink
            :to="{ name: 'qt-platform-finalised-score', params: { exerciseId: exercise.id, type: type, score: row.score } }"
            class="govuk-link"
          >
            {{ row.score }}
          </RouterLink>
        </TableCell>
        <TableCell :title="tableColumns[3].title">
          {{ 100 * (row.cumulativeDiversity.female / (row.rank + row.count - 1)) | formatNumber(2) }}%
        </TableCell>
        <TableCell :title="tableColumns[4].title">
          {{ 100 * (row.cumulativeDiversity.bame / (row.rank + row.count - 1)) | formatNumber(2) }}%
        </TableCell>
        <TableCell :title="tableColumns[5].title">
          {{ 100 * (row.cumulativeDiversity.solicitor / (row.rank + row.count - 1)) | formatNumber(2) }}%
        </TableCell>
        <TableCell :title="tableColumns[6].title">
          {{ 100 * (row.cumulativeDiversity.disability / (row.rank + row.count - 1)) | formatNumber(2) }}%
        </TableCell>
        <TableCell :title="tableColumns[7].title">
          <strong
            v-if="task.passMark && task.passMark <= row.score"
            class="govuk-tag govuk-tag--green"
          >PASS</strong>
          <strong
            v-if="task.passMark && task.passMark > row.score"
            class="govuk-tag govuk-tag--red"
          >FAIL</strong>
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
  props: {
    type: {
      required: true,
      type: String,
    },
    scores: {
      required: true,
      type: Array,
    },
  },
  data() {
    return {
      tableColumns: [
        { title: 'Rank' },
        { title: 'Count' },
        { title: 'Score' },
        { title: 'Female' },
        { title: 'BAME' },
        { title: 'Solicitor' },
        { title: 'Disability' },
        { title: 'Outcome' },
      ],
    };
  },
  computed: {
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    task() {
      return this.$store.getters['tasks/getTask'](this.type);
    },
  },
};
</script>
