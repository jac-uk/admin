<template>
  <div>
    Ranked by {{ scoreType | lookup }}
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
            :to="{ name: 'exercise-task-finalised-score', params: { exerciseId: exercise.id, type: type, score: row.score } }"
            class="govuk-link"
          >
            {{ row.score | formatNumber(2) }}
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
        { title: this.$options.filters.lookup(this.scoreType) },
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
