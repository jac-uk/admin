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
          {{ isUpdate ? `Update note` : `Add note` }}
        </h2>
      </legend>
      <ErrorSummary :errors="errors" />
      <DateInput 
        id="date"
        v-model="date"
        label="Date"
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
      isUpdate: false,
      dateNow: null,
    };
  },
  computed: {
    getUserId() {
      return this.$route.params.id || '';
    },
    oneNote() {
      const localNote = this.$store.state.notes.records ;
      return localNote;
    },
  },
  async created() {
    this.userId = this.getUserId;
    this.isUpdate = this.noteId ? true : false;
    this.dateNow = Date.now();
    let localNote;
    if (this.isUpdate) {
      // this.$store.dispatch('notes/bind', { id: this.noteId });
      localNote = this.$store.state.notes.records ;
      localNote = localNote.filter(item => {
        return item.id === this.noteId;
      });
      this.date = localNote[0].date;
      this.body = localNote[0].body;
    }
  },
  methods: {
    async save() {
      const data = {
        body: this.body,
        candidate: {
          id: this.userId,
        },
      };
      if (this.isUpdate) {
        data.lastUpdated = this.date;
      } else {
        data.created = this.date;
      }
      this.validate();
      if (this.isValid()) {
        await this.$store.dispatch('notes/savePersonalNotes', { data, id: this.noteId });
        this.$emit('createdNote');
      }
    },
  },
};
</script>
