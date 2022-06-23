<template>
  <div class="govuk-grid-row">
    <form @submit.prevent="validateAndSave">
      <div class="govuk-grid-column-full">
        <div
          v-if="!hasJourney"
          class="text-right"
        >
          <BackLink class="govuk-!-margin-top-0 govuk-!-margin-bottom-0" />
        </div>

        <h2 class="govuk-heading-l">
          Website listing
        </h2>

        <ErrorSummary
          :errors="errors"
          :show-save-button="true"
          @save="save"
        />

        <TextField
          id="exercise-name"
          v-model="formData.name"
          label="Exercise name"
          required
        />

        <Checkbox
          id="invite-only"
          v-model="formData.inviteOnly"
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
          v-model="formData.welshPosts"
          label="Are there Welsh posts?"
          hint="If this exercise has any posts in Wales you should tick this box. You then need to complete the Role Summary (Welsh)."
        />

        <TextareaInput
          id="role-summary"
          v-model="formData.roleSummary"
          label="Role summary"
          hint="Short summary of the role for the vacancies listing page."
          rows="2"
          required
        />

        <TextareaInput
          v-if="formData.welshPosts"
          id="role-summary-welsh"
          v-model="formData.roleSummaryWelsh"
          label="Role summary (Welsh)"
          hint="Fersywn Cymraeg"
          rows="2"
          required
        />

        <TextField
          id="subscriber-alerts-url"
          v-model="formData.subscriberAlertsUrl"
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
  data () {
    const defaults = {
      name: null,
      estimatedLaunchDate: null,
      inviteOnly: false,
      welshPosts: false,
      roleSummary: null,
      roleSummaryWelsh: null,
      subscriberAlertsUrl: null,
    };
    const formData = this.$store.getters['exerciseDocument/data'](defaults);
    return {
      formData: formData,
      setDay: false,
    };
  },
  computed: {
    launchDate: {
      get () {
        return this.parseDate(this.formData.estimatedLaunchDate);
      },
      set (val) {
        if (!val || !(val instanceof Date)) {
          return;
        }

        let dateString = `${val.getUTCFullYear()}-${val.getUTCMonth() + 1}`;
        if (this.setDay) {
          dateString = `${dateString}-${val.getUTCDate()}`;
        }

        this.formData.estimatedLaunchDate = dateString;
      },
    },
    type () {
      if (this.setDay) {
        return 'date';
      }
      return 'month';
    },
    toggleLabel () {
      if (this.setDay) {
        return 'Remove launch day';
      }
      return 'Add launch day';
    },
    hasJourney () {
      return this.$store.getters['exerciseCreateJourney/hasJourney'];
    },
  },
  methods: {
    async save (isValid) {
      this.formData['progress.vacancySummary'] = !!isValid;
      await this.$store.dispatch('exerciseDocument/save', this.formData);
      this.$router.push(this.$store.getters['exerciseCreateJourney/nextPage']('exercise-details-summary'));
    },
    toggleDay () {
      this.setDay = !this.setDay;
    },
    parseDate (value) {
      if (value instanceof Date) {
        return value;
      }

      if (typeof value !== 'string') {
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
