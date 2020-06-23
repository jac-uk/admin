<template>  
  <Table 
    data-key="notes"
    :data="notes"
    :columns="[
      { title: 'Date' },
      { title: 'Note' },
    ]"
  >
    <template #row="{row}">
      <TableCell>
        {{ new Date(row.created) | formatDate('long') }}
      </TableCell>
      <TableCell>
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
import Table from '@/components/Page/Table/Table'; 
import TableCell from '@/components/Page/Table/TableCell'; 

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
