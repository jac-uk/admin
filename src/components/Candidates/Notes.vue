<template>
  <div
    class="govuk-!-margin-top-9 "
  > 
    <NotesNew
      v-if="notesNew"
      :noteId="notesId"
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
import NotesNew from '@/components/Candidates/NotesNew';
import NotesList from '@/components/Candidates/NotesList';

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
    },
    deleteNoteAction(item) {
      this.$store.dispatch('candidates/deletePersonalNotes', { id: item });
    },
    editNoteAction(item) {
      this.notesNew = true;
      this.notesId = item.id;
    },
  },
};
</script>
