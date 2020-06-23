<template>
  <div
    class="govuk-!-margin-top-9 notes"
  > 
    <NotesNew
      v-if="isNew || isUpdate"
      :note="noteSelectedObj"
      @changeAction="changeAction"
    />
    <NotesDelete
      v-if="isDelete"
      :note="noteSelectedObj"
      @changeAction="changeAction"
    />
    <div v-if="isList">
      <h2
        class="govuk-heading-l"
      >
        {{ title }}
      </h2>

      <button 
        class="govuk-button"
        @click="btnClickAddNote"
      >
        Add a note
      </button>   
      <NotesList 
        :notes="notesList"
        @deleteNote="deleteNoteAction"
        @editNote="editNoteAction"
      />
    </div>
  </div>
</template>

<script>
import NotesNew from '@/components/Notes/NotesNew';
import NotesList from '@/components/Notes/NotesList';
import NotesDelete from '@/components/Notes/NotesDelete';

const STEPS = {
  list: 'list',
  new: 'new',
  update: 'update',
  delete: 'delete',
};

export default {
  components: {
    NotesNew,
    NotesList,
    NotesDelete,
  },
  props: {
    candidateId: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: 'Notes',
    },
  },
  data() {
    return {
      notesAction: null,
      noteSelectedObj: null,
    };
  },
  computed: {
    isList() {
      return this.notesAction === STEPS.list || this.notesAction === null;
    },
    isNew() {
      return this.notesAction === STEPS.new;
    },
    isUpdate() {
      return this.notesAction === STEPS.update;
    },
    isDelete() {
      return this.notesAction === STEPS.delete;
    },
    notesList() {
      const localNotes = this.$store.state.notes.records;
      return localNotes || {};
    },
  },
  created() {
    const data = {};
    data.candidateId = this.candidateId || null;
    this.$store.dispatch('notes/bind', data );
  },
  methods: {
    btnClickAddNote() {
      const data = {};
      if (this.candidateId) {
        data.candidate = {
          id: this.candidateId || null,
        };
      }
      this.noteSelectedObj = data;
      this.notesAction = STEPS.new;
    },
    changeAction(action) {
      this.notesAction = action;
      this.noteSelectedObj = null;
    },
    deleteNoteAction(item) {
      this.noteSelectedObj = this.notesList.filter(note => note.id === item.id)[0];
      this.notesAction = STEPS.delete;
    },
    editNoteAction(item) {
      this.noteSelectedObj = this.notesList.filter(note => note.id === item.id)[0];
      this.notesAction = STEPS.update;
    },
  },
};
</script>
