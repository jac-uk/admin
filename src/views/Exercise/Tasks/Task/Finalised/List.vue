<template>
  <div>
    Ranked by {{ $filters.lookup(scoreType) }}
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
            :to="{ name: 'exercise-task-finalised-score', params: { id: exercise.id, type: type, score: row.score } }"
            class="govuk-link"
          >
            {{ $filters.formatNumber(row.score, 2) }}
          </RouterLink>
        </TableCell>
        <TableCell :title="tableColumns[3].title">
          {{ $filters.formatNumber(100 * (row.cumulativeDiversity.female / (row.rank + row.count - 1)), 2) }}%
        </TableCell>
        <TableCell :title="tableColumns[4].title">
          {{ $filters.formatNumber(100 * (row.cumulativeDiversity.bame / (row.rank + row.count - 1)), 2) }}%
        </TableCell>
        <TableCell :title="tableColumns[5].title">
          {{ $filters.formatNumber(100 * (row.cumulativeDiversity.solicitor / (row.rank + row.count - 1)), 2) }}%
        </TableCell>
        <TableCell :title="tableColumns[6].title">
          {{ $filters.formatNumber(100 * (row.cumulativeDiversity.disability / (row.rank + row.count - 1)), 2) }}%
        </TableCell>
        <TableCell :title="tableColumns[7].title">
          <div
            v-if="row.outcome.pass"
            :class="{'govuk-!-margin-bottom-2': row.outcome.fail}"
          >
            <strong
              class="govuk-tag govuk-tag--green"
            >PASS</strong>
            <span v-if="row.outcome.fail"> x {{ row.outcome.pass }}</span>
          </div>
          <div v-if="row.outcome.fail">
            <strong
              class="govuk-tag govuk-tag--red"
            >FAIL</strong>
            <span v-if="row.outcome.pass"> x {{ row.outcome.fail }}</span>
          </div>
        </TableCell>
      </template>
    </Table>
  </div>
</template>

<script>
import Table from '@jac-uk/jac-kit/components/Table/Table.vue';
import TableCell from '@jac-uk/jac-kit/components/Table/TableCell.vue';

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
    scoreType: {
      required: true,
      type: String,
    },
  },
  data() {

    return {
      tableColumns: [
        { title: 'Rank' },
        { title: 'Count' },
        { title: this.$filters.lookup(this.scoreType) },
        { title: 'Female' },
        { title: 'Ethnic Minority' },
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
