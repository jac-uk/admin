<template>
  <div class="govuk-grid-row">
    <form @submit.prevent="validateAndSave">
      <div class="govuk-grid-column-two-thirds">
        <BackLink />

        <div
          v-if="hasClipboardData"
          class="govuk-notification-banner"
          role="region"
          aria-labelledby="govuk-notification-banner-title"
          data-module="govuk-notification-banner"
        >
          <div class="govuk-notification-banner__header">
            <h2
              id="govuk-notification-banner-title"
              class="govuk-notification-banner__title"
            >
              Clipboard
            </h2>
          </div>
          <div class="govuk-notification-banner__content">
            <p class="govuk-notification-banner__heading">
              You have an exercise on your clipboard. Use the button below to create a copy.
            </p>
            <button
              type="button"
              class="govuk-button"
              @click="copyFromClipboard"
            >
              Create exercise from clipboard
            </button>
            <button
              type="button"
              class="govuk-button govuk-button--secondary govuk-!-margin-left-3"
              @click.prevent="openOverrideExerciseModal"
            >
              Override an exercise
            </button>
          </div>
        </div>

        <h1 class="govuk-heading-xl">
          Create an exercise
        </h1>

        <ErrorSummary
          :errors="errors"
          :show-save-button="false"
          @save="save"
        />

        <label class="govuk-heading-m">
          Reference number
        </label>
        <span class="govuk-hint">
          This will be generated automatically when you save.
        </span>

        <TextField
          id="exercise-name"
          v-model="exerciseName"
          label="Exercise name"
          required
        />

        <RadioGroup
          id="is-more-info-needed"
          v-model="addMoreInfo"
          label="Do you want to add more information about this exercise now?"
          hint="You can add exercise contacts, shortlisting methods, timeline dates, or information from HMCTS. You can also do this later"
          required
          :messages="{
            required: 'Please specify whether you\'d like to add more information'
          }"
        >
          <RadioItem
            :value="true"
            label="Yes"
          >
            <CheckboxGroup
              id="select-more-info"
              v-model="addMoreInfoSelection"
              label="What do you want to add?"
              hint="Select all that apply."
              required
            >
              <CheckboxItem
                value="summary"
                label="Website listing"
              />
              <CheckboxItem
                value="contacts"
                label="Exercise contacts"
              />
              <CheckboxItem
                value="shortlisting"
                label="Shortlisting methods"
              />
              <CheckboxItem
                value="timeline"
                label="Timeline"
              />
              <CheckboxItem
                value="vacancy"
                label="Vacancy information"
              />
              <CheckboxItem
                value="eligibility"
                label="Eligibility Information"
              />
              <CheckboxItem
                value="preferences"
                label="Working Preferences"
              />
              <CheckboxItem
                value="assessments"
                label="Assessment Options"
              />
              <CheckboxItem
                value="downloads"
                label="Exercise Downloads"
              />
            </CheckboxGroup>
          </RadioItem>

          <RadioItem
            :value="false"
            label="No - I'll do this later"
          />
        </RadioGroup>
        <button class="govuk-button">
          Save and continue
        </button>
      </div>
    </form>

    <Modal ref="modalOverrideExercise">
      <OverrideExercise
        @close="closeOverrideExerciseModal"
        @confirmed="overrideExercise"
      />
    </Modal>
  </div>
</template>

<script>
import Form from '@jac-uk/jac-kit/draftComponents/Form/Form.vue';
import ErrorSummary from '@jac-uk/jac-kit/draftComponents/Form/ErrorSummary.vue';
import TextField from '@jac-uk/jac-kit/draftComponents/Form/TextField.vue';
import RadioGroup from '@jac-uk/jac-kit/draftComponents/Form/RadioGroup.vue';
import RadioItem from '@jac-uk/jac-kit/draftComponents/Form/RadioItem.vue';
import CheckboxGroup from '@jac-uk/jac-kit/draftComponents/Form/CheckboxGroup.vue';
import CheckboxItem from '@jac-uk/jac-kit/draftComponents/Form/CheckboxItem.vue';
import BackLink from '@jac-uk/jac-kit/draftComponents/BackLink.vue';
import Modal from '@jac-uk/jac-kit/components/Modal/Modal.vue';
import OverrideExercise from '@/components/ModalViews/OverrideExercise.vue';
import { cloneDeep } from 'lodash';

export default {
  name: 'CreateExercise',
  components: {
    ErrorSummary,
    TextField,
    RadioGroup,
    RadioItem,
    CheckboxGroup,
    CheckboxItem,
    BackLink,
    Modal,
    OverrideExercise,
  },
  extends: Form,
  data() {
    return {
      exerciseName: null,
      addMoreInfo: null,
      addMoreInfoSelection: null,
    };
  },
  computed: {
    hasClipboardData() {
      return this.$store.state.clipboard.hasData;
    },
  },
  methods: {
    async save() {
      this.validate();
      if (this.isValid()) {
        const data = {
          name: this.exerciseName,
          exerciseMailbox: this.$store.state.auth.currentUser.email,
          characterChecksEnabled: true,
        };
        await this.$store.dispatch('exerciseDocument/create', data);
        const selectedPages = this.addMoreInfo ? this.addMoreInfoSelection : [];
        this.$store.dispatch('exerciseCreateJourney/start', selectedPages);
        this.$router.push(this.$store.getters['exerciseCreateJourney/nextPage']());
      }
    },
    openOverrideExerciseModal() {
      this.$refs.modalOverrideExercise.openModal();
    },
    closeOverrideExerciseModal() {
      this.$refs.modalOverrideExercise.closeModal();
    },
    async overrideExercise({ exerciseId, referenceNumber }) {
      const content = cloneDeep(this.$store.state.clipboard.data.content);
      // keep reference number
      content.referenceNumber = referenceNumber;
      content.state = 'draft';
      // ignore fields that do not need to override
      const ignoredFields = ['_applicationContent', '_applicationRecords', '_applications', '_approval', '_lateApplicationRequests'];
      for (const field of ignoredFields) {
        delete content[field];
      }

      await this.$store.dispatch('exerciseDocument/override', { exerciseId, data: content });
      await this.$store.dispatch('clipboard/empty');
      this.$store.dispatch('exerciseCreateJourney/start', []);
      this.$router.push(`/exercise/${exerciseId}/dashboard`);
      this.closeOverrideExerciseModal();
    },
    async copyFromClipboard() {
      try {
        const content = { ...this.$store.state.clipboard.data.content };
        content.name = `${content.name} COPY`;
        await this.$store.dispatch('exerciseDocument/create', content);
        await this.$store.dispatch('clipboard/empty');
        this.$store.dispatch('exerciseCreateJourney/start', []);
        this.$router.push(this.$store.getters['exerciseCreateJourney/nextPage']());
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
  },
};
</script>
