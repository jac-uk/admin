<template>
  <div>
    <h1 class="govuk-heading-l">
      {{ type | lookup }} test
    </h1>
    <p class="govuk-body-l">{{ type | lookup }} was completed on {{ task.statusLog.completed | formatDate }}.</p>
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-one-half">
        <div class="panel govuk-!-margin-bottom-6 govuk-!-padding-4 background-light-grey">
          <p class="govuk-body govuk-!-margin-bottom-0">
            Applications
          </p>
          <h2 class="govuk-heading-l govuk-!-padding-top-0 govuk-!-margin-bottom-0">
            {{ totalApplications }}
          </h2>
        </div>
      </div>
      <div
        v-if="task._stats.totalForEachOutcome"
        class="govuk-grid-column-one-half"
      >
        <div class="panel govuk-!-margin-bottom-6 govuk-!-padding-4 background-light-grey">
          <Table
            data-key="id"
            :data="Object.entries(task._stats.totalForEachOutcome)"
            :columns="[{ title: 'Status' }, { title: 'Total' }]"
            local-data
          >
            <template #row="{row}">
              <TableCell>
                {{ row[0] | lookup }}
              </TableCell>
              <TableCell>
                {{ row[1] }}
              </TableCell>
            </template>
          </Table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { beforeRouteEnter } from './helper';
import Table from '@jac-uk/jac-kit/components/Table/Table';
import TableCell from '@jac-uk/jac-kit/components/Table/TableCell';
export default {
  components: {
    Table,
    TableCell,
  },
  beforeRouteEnter: beforeRouteEnter,
  props: {
    type: {
      required: true,
      type: String,
    },
  },
  computed: {
    task() {
      return this.$store.getters['tasks/getTask'](this.type);
    },
    totalApplications() {
      return this.task.participants.length;
    },
  },
};
</script>
