<template>
  <Table
    v-if="hasPermissions([PERMISSIONS.notes.permissions.canReadNotes.value])"
    data-key="notes"
    :data="notes"
    :columns="tableColumns"
    local-data
  >
    <template #row="{row}">
      <TableCell :title="tableColumns[0].title">
        {{ $filters.formatDate(new Date(row.created), 'long') }}
      </TableCell>
      <TableCell :title="tableColumns[1].title">
        <div class="notes__editable">
          <span>
            {{ row.body }}
          </span>
          <span class="edit-links">
            <a
              v-if="hasPermissions([PERMISSIONS.notes.permissions.canUpdateNotes.value])"
              href="#"
              class="govuk-link"
              @click.prevent="editNote(row.id)"
            >
              Edit
            </a>
            <a
              v-if="hasPermissions([PERMISSIONS.notes.permissions.canDeleteNotes.value])"
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
import Table from '@jac-uk/jac-kit/components/Table/Table.vue';
import TableCell from '@jac-uk/jac-kit/components/Table/TableCell.vue';
import permissionMixin from '@/permissionMixin';

export default {
  name: 'NotesList',
  components: {
    Table,
    TableCell,
  },
  mixins: [permissionMixin],
  props: {
    notes: {
      type: Array,
      default: null,
    },
  },
  emits: ['editNote', 'deleteNote'],
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
