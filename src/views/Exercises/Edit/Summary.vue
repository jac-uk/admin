<template>
  <div class="govuk-grid-row">
    <form @submit.prevent="validateAndSave">
      <div class="govuk-grid-column-two-thirds">
        <BackLink />
        <h1 class="govuk-heading-xl">
          Website listing
        </h1>

        <ErrorSummary
          :errors="errors"
          :show-save-button="true"
          @save="save"
        />

        <TextField
          id="exercise-name"
          v-model="exercise.name"
          label="Exercise name"
          required
        />

        <Checkbox
          id="invite-only"
          v-model="exercise.inviteOnly"
          label="Invite only exercise"
          hint="When this is checked, only invited candidates will be able to apply to this exercise."
        />

        <DateInput
          id="estimated-launch-date"
          v-model="launchDate"
          label="Estimated launch date"
          :type="type"
          required
        />

        <button
          class="govuk-button govuk-button--secondary govuk-!-margin-left-1"
          @click.prevent="toggleDay"
        >
          {{ toggleLabel }}
        </button>

        <Checkbox
          id="welsh-posts"
          v-model="exercise.welshPosts"
          label="Are there Welsh posts?"
          hint="If this exercise has any posts in Wales you should tick this box. You then need to complete the Role Summary (Welsh)."
        />

        <TextareaInput
          id="role-summary"
          v-model="exercise.roleSummary"
          label="Role summary"
          hint="Short summary of the role for the vacancies listing page."
          rows="2"
          required
        />

        <TextareaInput
          v-if="exercise.welshPosts"
          id="role-summary-welsh"
          v-model="exercise.roleSummaryWelsh"
          label="Role summary (Welsh)"
          hint="Fersywn Cymraeg"
          rows="2"
          required
        />

        <TextField
          id="subscriber-alerts-url"
          v-model="exercise.subscriberAlertsUrl"
          label="Subscriber alerts url"
          type="url"
        />

        <button class="govuk-button">
          Save and continue
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import Form from '@jac-uk/jac-kit/draftComponents/Form/Form';
import ErrorSummary from '@jac-uk/jac-kit/draftComponents/Form/ErrorSummary';
import TextField from '@jac-uk/jac-kit/draftComponents/Form/TextField';
import TextareaInput from '@jac-uk/jac-kit/draftComponents/Form/TextareaInput';
import DateInput from '@jac-uk/jac-kit/draftComponents/Form/DateInput';
import BackLink from '@jac-uk/jac-kit/draftComponents/BackLink';
import Checkbox from '@jac-uk/jac-kit/draftComponents/Form/Checkbox';

export default {
  components: {
    ErrorSummary,
    TextField,
    TextareaInput,
    DateInput,
    BackLink,
    Checkbox,
  },
  extends: Form,
  data() {
    const defaults = {
      name: null,
      estimatedLaunchDate: null,
      roleSummary: null,
      subscriberAlertsUrl: null,
    };
    const data = this.$store.getters['exerciseDocument/data']();
    const exercise = { ...defaults, ...data };
    return {
      exercise: exercise,
      setDay: false,
    };
  },
  computed: {
    launchDate: {
      get() {
        return this.parseDate(this.exercise.estimatedLaunchDate);
      },
      set(val) {
        if (!val || !(val instanceof Date)){
          return;
        }

        let dateString = `${val.getUTCFullYear()}-${val.getUTCMonth() + 1}`;
        if (this.setDay) {
          dateString = `${dateString}-${val.getUTCDate()}`;
        }

        this.exercise.estimatedLaunchDate = dateString;
      },
    },
    type() {
      if (this.setDay) {
        return 'date';
      }
      return 'month';
    },
    toggleLabel() {
      if (this.setDay) {
        return 'Remove launch day';
      }
      return 'Add launch day';
    },
  },
  methods: {
    async save(isValid) {
      this.exercise.progress.vacancySummary = isValid ? true : false;
      await this.$store.dispatch('exerciseDocument/save', this.exercise);
      this.$router.push(this.$store.getters['exerciseCreateJourney/nextPage']('exercise-show-summary'));
    },
    toggleDay() {
      this.setDay = !this.setDay;
    },
    parseDate(value) {
      if (value instanceof Date) {
        return value;
      }

      if (typeof value != 'string') {
        return;
      }
      const parts = value.split('-');
      if (parts.length === 3) {
        this.setDay = true;
      }
      const [year, month, day] = [...parts, 1];
      const date = new Date(Date.UTC(year, month - 1, day));

      return date;
    },
  },
};
</script>
