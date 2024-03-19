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
          Working preferences
        </h2>

        <ErrorSummary
          :errors="errors"
          :show-save-button="true"
          @save="save"
        />

        <TabsList
          v-model:active-tab="activeTab"
          :tabs="tabs"
        />

        <div v-show="activeTab == 'location'">
          <RepeatableFields
            v-model="formData.locationPreferences"
            :component="repeatableFields.WorkingPreferenceQuestion"
            ident="location-preferences"
            type-name="question"
            :allow-empty="true"
            type="locationPreference"
            :extra-props="{ linkedQuestions: linkedQuestions }"
          />
        </div>

        <div v-show="activeTab == 'jurisdiction'">
          <RepeatableFields
            v-model="formData.jurisdictionPreferences"
            :component="repeatableFields.WorkingPreferenceQuestion"
            ident="jurisdiction-preferences"
            type-name="question"
            :allow-empty="true"
            type="jurisdictionPreference"
            :extra-props="{ linkedQuestions: linkedQuestions }"
          />
        </div>

        <div v-show="activeTab == 'additional'">
          <RepeatableFields
            v-model="formData.additionalWorkingPreferences"
            :component="repeatableFields.WorkingPreferenceQuestion"
            ident="additional-working-preferences"
            type-name="question"
            :allow-empty="true"
            :extra-props="{ linkedQuestions: linkedQuestions }"
          />
        </div>

        <button class="govuk-button">
          Save and continue
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import TabsList from '@jac-uk/jac-kit/draftComponents/TabsList.vue';
import Form from '@jac-uk/jac-kit/draftComponents/Form/Form.vue';
import ErrorSummary from '@jac-uk/jac-kit/draftComponents/Form/ErrorSummary.vue';
import RepeatableFields from '@jac-uk/jac-kit/draftComponents/RepeatableFields.vue';
import Answer from '@/components/RepeatableFields/Answer.vue';
import WorkingPreferenceQuestion from '@/components/RepeatableFields/WorkingPreferenceQuestion.vue';
import BackLink from '@jac-uk/jac-kit/draftComponents/BackLink.vue';
import { shallowRef } from 'vue';

export default {
  components: {
    TabsList,
    ErrorSummary,
    BackLink,
    RepeatableFields,
  },
  extends: Form,
  data() {
    const defaults = {
      locationPreferences: [],
      jurisdictionPreferences: [],
      additionalWorkingPreferences: [],
    };
    const formData = this.$store.getters['exerciseDocument/data'](defaults);
    return {
      activeTab: 'location',
      formData: formData,
      repeatableFields: shallowRef({
        Answer,
        WorkingPreferenceQuestion,
      }),
    };
  },
  computed: {
    hasJourney() {
      return this.$store.getters['exerciseCreateJourney/hasJourney'];
    },
    tabs() {
      return [
        {
          ref: 'location',
          title: 'Location',
        },
        {
          ref: 'jurisdiction',
          title: 'Jurisdiction',
        },
        {
          ref: 'additional',
          title: 'Additional',
        },
      ];
    },
    linkedQuestions() {
      const linkableQuestions = [];
      this.formData.locationPreferences.forEach(question => {
        if (question.allowLinkedQuestions) linkableQuestions.push(question);
      });
      this.formData.jurisdictionPreferences.forEach(question => {
        if (question.allowLinkedQuestions) linkableQuestions.push(question);
      });
      this.formData.additionalWorkingPreferences.forEach(question => {
        if (question.allowLinkedQuestions) linkableQuestions.push(question);
      });
      return linkableQuestions;
    },
  },
  methods: {
    async save(isValid) {
      this.formData['progress.workingPreferences'] = isValid ? true : false;
      await this.$store.dispatch('exerciseDocument/save', this.formData);
      this.$router.push(this.$store.getters['exerciseCreateJourney/nextPage']('exercise-details-preferences'));
    },
  },
};
</script>
