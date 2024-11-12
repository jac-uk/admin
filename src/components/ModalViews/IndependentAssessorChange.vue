<template>
  <div>
    <div class="modal__title govuk-!-padding-2 govuk-heading-m">
      Independent Assessor Change
    </div>
    <div class="modal__content govuk-!-margin-6">
      <div class="govuk-grid-row">
        <form @submit.prevent="validateAndSave">
          <ErrorSummary :errors="errors" />
          <fieldset>
            <Select
              id="assessor-type"
              v-model="type"
              label="Assessor type"
              required
            >
              <option
                v-for="option in assessorTypes"
                :key="option"
                :value="option"
              >
                {{ $filters.lookup(option) }} Assessor
              </option>
            </Select>
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
              id="assessor-email"
              v-model="email"
              label="Email"
              type="email"
              required
            />
            <TextField
              id="assessor-Phone"
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
import Form from '@jac-uk/jac-kit/draftComponents/Form/Form.vue';
import ErrorSummary from '@jac-uk/jac-kit/draftComponents/Form/ErrorSummary.vue';
import TextField from '@jac-uk/jac-kit/draftComponents/Form/TextField.vue';
import Select from '@jac-uk/jac-kit/draftComponents/Form/Select.vue';
import { ASSESSOR_TYPES } from '@/helpers/constants';

export default {
  name: 'IndependentAssessorChange',
  components: {
    ErrorSummary,
    TextField,
    Select,
  },
  extends: Form,
  props: {
    application: {
      type: Object,
      required: true,
      default: () => {},
    },
    applicationId: {
      type: String,
      required: true,
    },
  },
  emits: ['close', 'confirmed'],
  data() {
    return {
      type: null,
      email: null,
      fullName: null,
      phone: null,
      title: null,
      assessorTypes: Object.values(ASSESSOR_TYPES),
    };
  },
  computed: {
    userId() {
      const assessorId = this.$attrs.assessor.id;
      return assessorId ? assessorId : this.$attrs.uuid;
    },
  },
  created() {
    this.type = this.$attrs.type;
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
      this.$emit('confirmed');
    },
    async save() {
      await this.validate();
      if (this.isValid()) {
        let data = {};
        if (this.$attrs.AssessorNr == 1) {
          data = {
            firstAssessorType: this.type,
            firstAssessorEmail: this.email,
            firstAssessorFullName: this.fullName,
            firstAssessorPhone: this.phone,
            firstAssessorTitle: this.title,
          };
        } else if (this.$attrs.AssessorNr == 2) {
          data = {
            secondAssessorType: this.type,
            secondAssessorEmail: this.email,
            secondAssessorFullName: this.fullName,
            secondAssessorPhone: this.phone,
            secondAssessorTitle: this.title,
          };
        }

        await this.$store.dispatch('application/update', {
          data: data, id: this.applicationId,
        });
        await this.$store.dispatch('assessment/update', {
          data: data, id: this.applicationId,
          AssessorNr: this.$attrs.AssessorNr,
          refNumber: this.application.referenceNumber,
          candidateFullName: this.application.personalDetails.fullName,
        });
        this.closeModal();
      }
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
  .modal__title {
    color: white;
  }
</style>
