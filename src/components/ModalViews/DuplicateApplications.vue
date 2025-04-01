<template>
  <div>
    <div class="modal__title govuk-!-padding-2 govuk-heading-m">
      Duplicate Applications By NI Numnber
    </div>
    <div class="modal__content govuk-!-margin-6">
      <div class="govuk-grid-row">
        <div
          v-if="applications.length === 0"
          class="govuk-!-margin-bottom-5"
        >
          <span class="govuk-body-m">There are no applications with the same NI Nmber.</span>
        </div>

        <div v-else>
          <div
            class="govuk-!-margin-bottom-5"
          >
            <span class="govuk-body-m">See the list of applications below that have duplicate NI Numbers.</span>
          </div>
          <Table
            data-key="referenceNumber"
            :data="applications"
            :columns="tableColumns"
            local-data
          >
            <template #row="{row}">
              <TableCell :title="tableColumns[0].title">
                {{ row.referenceNumber }}
              </TableCell>
              <TableCell :title="tableColumns[1].title">
                {{ row.name }}
              </TableCell>
              <TableCell :title="tableColumns[2].title">
                {{ row.niNumber }}
              </TableCell>
            </template>
          </Table>
        </div>
        <button
          class="govuk-button govuk-button--secondary govuk-!-margin-right-3"
          @click.prevent="closeModal"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import Table from '@jac-uk/jac-kit/components/Table/Table.vue';
import TableCell from '@jac-uk/jac-kit/components/Table/TableCell.vue';
export default {
  name: 'DuplicateApplications',
  components: {
    Table,
    TableCell,
  },
  props: {
    applications: {
      type: Array,
      required: false,
      default: () => [],
    },
  },
  emits: ['close'],
  computed: {
    tableColumns() {
      const cols = [];
      cols.push({ title: 'Reference number' });
      cols.push({ title: 'Name' });
      cols.push({ title: 'NI Number' });
      return cols;
    },
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
  },
};
</script>
