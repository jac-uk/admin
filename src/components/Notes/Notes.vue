<template>
  <div
    class="govuk-!-margin-top-9 notes"
  >
    <NotesNew
      v-if="isNew || isUpdate"
      :note="noteSelectedObj"
      @change-action="changeAction"
    />
    <NotesDelete
      v-if="isDelete"
      :note="noteSelectedObj"
      @change-action="changeAction"
    />
    <div v-if="isList">
      <h2
        class="govuk-heading-l"
      >
        {{ title }}
      </h2>

      <button
        v-if="canCreate"
        class="govuk-button"
        @click="btnClickAddNote"
      >
        Add a note
      </button>

      <div v-if="notesList.length === 0">
        <p class="govuk-body">
          There are no notes available.
        </p>
      </div>

      <NotesList
        v-else
        :notes="notesList"
        @delete-note="deleteNoteAction"
        @edit-note="editNoteAction"
      />
    </div>
  </div>
</template>

<script>
import NotesNew from '@/components/Notes/NotesNew.vue';
import NotesList from '@/components/Notes/NotesList.vue';
import NotesDelete from '@/components/Notes/NotesDelete.vue';

const STEPS = {
  list: 'list',
  new: 'new',
  update: 'update',
  delete: 'delete',
};

export default {
  name: 'Notes',
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
    applicationId: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: 'Notes',
    },
    canCreate: {
      type: Boolean,
      default: true,
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
      return localNotes || [];
    },
  },
  created() {
    const data = {};
    data.candidateId = this.candidateId || null;
    data.applicationId = this.applicationId || null;
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
      if (this.applicationId) {
        data.applicationId = this.applicationId;
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
