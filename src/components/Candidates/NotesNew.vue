<template>
  <form
    class="govuk-form-group"
    @submit.prevent="save"
  >
    <fieldset
      class="govuk-fieldset"
      role="group"
    >
      <legend class="govuk-fieldset__legend govuk-fieldset__legend--l">
        <h2 class="govuk-fieldset__heading">
          Add note
        </h2>
      </legend>
      <ErrorSummary :errors="errors" />
      <DateInput 
        id="date"
        v-model="date"
        label="Date"
        :value="date"
        hint="For example, 12 11 2007"
        required
      />
      <TextArea 
        id="body" 
        v-model="body"
        class="govuk-!-margin-top-7"
        label="Note"
        :value="body"
        required
      />
      <button 
        class="govuk-button"
      >
        Save and return
      </button>
    </fieldset>
  </form>
</template>

<script>
import TextArea from '@/components/Form/TextareaInput';
import DateInput from '@/components/Form/DateInput';
import Form from '@/components/Form/Form';
import ErrorSummary from '@/components/Form/ErrorSummary';
// import { formatDate } from '@/filters';

export default {
  components: {
    TextArea,
    DateInput,
    ErrorSummary,
  },
  extends: Form,
  props: {
    noteId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      date: null,
      body: null,
      userId: null,
    };
  },
  computed: {
    getUserId() {
      return this.$route.params.id || '';
    },
    oneNote() {
      // const localNote = this.$store.state.candidates.notes ;
      // eslint-disable-next-line
      // console.log('oneNote() localNote: ', localNote);
      // return localNote;
      return true;
    },
  },
  created() {
    this.userId = this.getUserId;
    if (this.noteId) {
      // this.$store.dispatch('candidates/bindNotes', { id: this.noteId });
      // const localNote = this.$store.state.candidates.notes ;
      // this.date = this.oneNote.date;
      // this.body = this.oneNote.body;
    }
  },
  destroyed() {
    // eslint-disable-next-line
    // console.log('/NotesNew destroyed');
  },
  methods: {
    async save() {
      const data = {
        body: this.body,
        candidate: {
          id: this.userId,
        },
      };
      if (this.noteId) {
        data.lastUpdated = this.date;
      } else {
        data.created = this.date;
      }
      this.validate();
      if (this.isValid()) {
        await this.$store.dispatch('candidates/savePersonalNotes', { data, id: this.noteId });
        this.$emit('createdNote');
      }
    },
  },
};
</script>
