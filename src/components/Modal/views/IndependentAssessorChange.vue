<template>
  <div>
    <div class="modal__title govuk-!-padding-2 govuk-heading-m">
      Independent Assessor Change
    </div>
    <div class="modal__content govuk-!-margin-6">
      <div class="govuk-grid-row">
        <form
          ref="formRef"
          @submit.prevent="save"
        >
          <fieldset>
            <TextField
              id="full-name"
              v-model="fullName"
              label="Full name"
              required
            />
            <TextField
              id="title"
              v-model="title"
              label="Title or position"
              required
            />
            <TextField
              id="first-assessor-email"
              v-model="email"
              label="Email"
              type="email"
              required
            />
            <TextField
              id="first-assessor-Phone"
              v-model="phone"
              label="Phone"
              type="tel"
              required
            />
          </fieldset>
          <button 
            class="govuk-button govuk-!-margin-right-3"
            @click="save"
          >
            Save
          </button>
          <button 
            class="govuk-button govuk-button--secondary govuk-!-margin-right-3"
            @click="closeModal"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import TextField from '@/components/Form/TextField';

export default {
  name: 'IndependentAssessorChange',
  components: {
    TextField,
  },
  data() {
    return {
      email: null,
      fullName: null,
      phone: null,
      title: null,
    };
  },
  computed: {
    userId() {
      const assessorId = this.$attrs.assessor.id;
      return assessorId ? assessorId : this.$attrs.uuid;
    },
  },
  created() {
    this.email = this.$attrs.email;
    this.fullName = this.$attrs.fullName;
    this.phone = this.$attrs.phone;
    this.title = this.$attrs.title;
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },          
    confirmModal() {
      this.modalOpen = false;
      this.$emit('confirmed');
      document.body.style.overflow = '';
    },  
    async save() {
      let data = {};
      if (this.$attrs.AssessorNr == 1) {
        data = {
          firstAssessorEmail: this.email,
          firstAssessorFullName: this.fullName,
          firstAssessorPhone: this.phone,
          firstAssessorTitle: this.title,
        };
      } else if (this.$attrs.AssessorNr == 2) {
        data = {
          secondAssessorEmail: this.email,
          secondAssessorFullName: this.fullName,
          secondAssessorPhone: this.phone,
          secondAssessorTitle: this.title,
        };
      }
      this.$store.dispatch('application/update', { data: data, id: this.$attrs.applicationId });
      this.$store.dispatch('assessment/update', { data: data, id: this.$attrs.applicationId, AssessorNr: this.$attrs.AssessorNr });
      this.closeModal();
    },     
  },
};
</script>

<style scoped>
  fieldset {
    border: none;
    padding: 0;
    margin: 0;
  }
</style>
