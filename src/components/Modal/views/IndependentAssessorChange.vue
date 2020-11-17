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
          <fieldset v-if="$attrs.AssessorNr == 1">
            <TextField
              id="first-assessor-full-name"
              v-model="firstAssessorFullName"
              label="Full name"
              required
            />
            <TextField
              id="first-assessor-title"
              v-model="firstAssessorTitle"
              label="Title or position"
              required
            />
            <TextField
              id="first-assessor-email"
              v-model="firstAssessorEmail"
              label="Email"
              type="email"
              required
            />
            <TextField
              id="first-assessor-Phone"
              v-model="firstAssessorPhone"
              label="Phone"
              type="tel"
              required
            />
          </fieldset>
          <fieldset v-if="$attrs.AssessorNr == 2">
            <TextField
              id="second-assessor-full-name"
              v-model="secondAssessorFullName"
              label="Full name"
              required
            />
            <TextField
              id="second-assessor-title"
              v-model="secondAssessorTitle"
              label="Title or position"
              required
            />
            <TextField
              id="second-assessor-email"
              v-model="secondAssessorEmail"
              label="Email"
              type="email"
              required
            />
            <TextField
              id="second-assessor-Phone"
              v-model="secondAssessorPhone"
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
      firstAssessorEmail: null,
      firstAssessorFullName: null,
      firstAssessorPhone: null,
      firstAssessorTitle: null,
      secondAssessorEmail: null,
      secondAssessorFullName: null,
      secondAssessorPhone: null,
      secondAssessorTitle: null,
    };
  },
  computed: {
    userId() {
      const assessorId = this.$attrs.assessor.id;
      return assessorId ? assessorId : this.$attrs.uuid;
    },
  },
  created() {
    this.firstAssessorEmail = this.$attrs.firstAssessorEmail;
    this.firstAssessorFullName = this.$attrs.firstAssessorFullName;
    this.firstAssessorPhone = this.$attrs.firstAssessorPhone;
    this.firstAssessorTitle = this.$attrs.firstAssessorTitle;
    this.secondAssessorEmail = this.$attrs.secondAssessorEmail;
    this.secondAssessorFullName = this.$attrs.secondAssessorFullName;
    this.secondAssessorPhone = this.$attrs.secondAssessorPhone;
    this.secondAssessorTitle = this.$attrs.secondAssessorTitle;
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
          firstAssessorEmail: this.firstAssessorEmail,
          firstAssessorFullName: this.firstAssessorFullName,
          firstAssessorPhone: this.firstAssessorPhone,
          firstAssessorTitle: this.firstAssessorTitle,
        };
      } else if (this.$attrs.AssessorNr == 2) {
        data = {
          secondAssessorEmail: this.secondAssessorEmail,
          secondAssessorFullName: this.secondAssessorFullName,
          secondAssessorPhone: this.secondAssessorPhone,
          secondAssessorTitle: this.secondAssessorTitle,
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
