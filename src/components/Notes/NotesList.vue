<template>
  <Table
    data-key="notes"
    :data="notes"
    :columns="tableColumns"
  >
    <template #row="{row}">
      <TableCell :title="tableColumns[0].title">
        {{ new Date(row.created) | formatDate('long') }}
      </TableCell>
      <TableCell :title="tableColumns[1].title">
        <div class="notes__editable">
          <span>
            {{ row.body }}
          </span>
          <span class="edit-links">
            <a
              href="#"
              class="govuk-link"
              @click.prevent="editNote(row.id)"
            >
              Edit
            </a>
            <a
              href="#"
              class="govuk-link"
              @click.prevent="deleteNote(row.id)"
            >
              Delete
            </a>
          </span>
        </div>
      </TableCell>
    </template>
  </Table>
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
    notes: {
      type: Array,
      default: null,
    },
  },
  data(){
    return {
      tableColumns: [
        { title: 'Date' },
        { title: 'Note' },
      ],
    };
  },
  methods: {
    editNote(id) {
      this.$emit('editNote', { id: id });
    },
    deleteNote(id) {
      this.$emit('deleteNote', { id: id });
    },
  },
};
</script>

<style scoped>
  .notes__editable {
    display: flex;
    flex-direction: row;
  }

  .notes__editable .edit-links {
    margin-left: auto;
  }

  .notes__editable .edit-links a {
    margin-left: 5px;
  }
</style>
