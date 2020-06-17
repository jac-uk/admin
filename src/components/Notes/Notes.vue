<template>
  <div
    class="govuk-!-margin-top-9 "
  > 
    <NotesNew
      v-if="notesNew"
      :note-id="notesId"
      @createdNote="createdNote"
    />
    <div v-if="!notesNew">
      <h2
        class="govuk-heading-l"
      >
        Notes about the Candidate
      </h2>

      <button 
        v-if="!notesNew"
        class="govuk-button"
        @click="btnClickAddNote"
      >
        Add a note
      </button>   
      <NotesList 
        @deleteNote="deleteNoteAction"
        @editNote="editNoteAction"
      />
    </div>
  </div>
</template>

<script>
import NotesNew from '@/components/Notes/NotesNew';
import NotesList from '@/components/Notes/NotesList';

export default {
  components: {
    NotesNew,
    NotesList,
  },
  data() {
    return {
      notesNew: false,
      notesId: '',
    };
  },
  methods: {
    btnClickAddNote() {
      this.notesNew = true;
    },
    createdNote() {
      this.notesNew = false;
      this.notesId = null;
    },
    deleteNoteAction(item) {
      this.$store.dispatch('notes/deletePersonalNotes', { id: item.id });
    },
    editNoteAction(item) {
      this.notesId = item.id;
      this.notesNew = true;
    },
  },
};
</script>
