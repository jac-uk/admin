<template>  
  <Table 
    data-key="id"
    :data="notesList"
    :columns="[
      { title: 'Date' },
      { title: 'Note' },
    ]"
  >
    <template #row="{row}">
      <TableCell>
        <RouterLink
          :to="{ name: 'candidates-view', params: { id: row.id } }"
        >
          {{ new Date(row.created) | formatDate('long') }}
        </RouterLink>
      </TableCell>
      <TableCell>
        <span>
          {{ row.body }}
        </span>
        <span v-if="false">
          <button
            @click="editNote(row.id)"
          >
            Edit
          </button>
          <button
            @click="deleteNote(row.id)"
          >
            Delete
          </button>
        </span>
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
  data() {
    return {
      userId: null,
    };
  },
  computed: {
    getUserId() {
      return this.$route.params.id || '';
    },
    notesList() {
      const localNotes = this.$store.state.candidates.notes;
      return localNotes || {};
    },
  },
  created() {
    this.userId = this.getUserId;
    this.$store.dispatch('candidates/bindNotes', { candidateId: this.userId });
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
