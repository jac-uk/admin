<template>
  <div class="govuk-grid-row">
    <form @submit.prevent="validateAndSave">
      <div class="govuk-grid-column-full">
        <h2 class="govuk-heading-l">
          Selection set-up
        </h2>

        <ErrorSummary
          :errors="errors"
          :show-save-button="true"
          @save="save"
        />

        <RadioGroup
          id="assessment-framework"
          v-model="formData.assessmentFramework"
          label="The assessment framework used in this exercise is:"
        >
          <RadioItem
            label="Competencies"
            value="competencies"
          />
          <RadioItem
            label="Skills & Abilities"
            value="skills-abilities"
          />
        </RadioGroup>

        <template v-if="formData.assessmentFramework">
          <CheckboxGroup
            id="capabilities"
            v-model="formData.capabilities"
            required
            label="Selection Criteria"
            :messages="{required: 'Please choose at least one capability'}"
          >
            <CheckboxItem
              v-for="capability in capabilities"
              :key="capability.value"
              :value="capability.value"
              :label="capability.description"
            />
          </CheckboxGroup>

          <CheckboxGroup
            id="selectionCategories"
            v-model="formData.selectionCategories"
            required
            label="Selection Tools"
            :messages="{required: 'Please choose at least one'}"
          >
            <CheckboxItem
              v-for="item in selectionCategories"
              :key="item.value"
              :value="item.value"
              :label="item.description"
            />
          </CheckboxGroup>
        </template>

        <button class="govuk-button">
          Save and continue
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import Form from '@jac-uk/jac-kit/draftComponents/Form/Form.vue';
import ErrorSummary from '@jac-uk/jac-kit/draftComponents/Form/ErrorSummary.vue';
import RadioGroup from '@jac-uk/jac-kit/draftComponents/Form/RadioGroup.vue';
import RadioItem from '@jac-uk/jac-kit/draftComponents/Form/RadioItem.vue';
import CheckboxGroup from '@jac-uk/jac-kit/draftComponents/Form/CheckboxGroup.vue';
import CheckboxItem from '@jac-uk/jac-kit/draftComponents/Form/CheckboxItem.vue';
import { CAPABILITIES, SELECTION_CATEGORIES } from '../../../../helpers/exerciseHelper';

const competenciesCapabilities = [
  CAPABILITIES.L,
  CAPABILITIES.EJ,
  CAPABILITIES.PBK,
  CAPABILITIES.ACI,
  CAPABILITIES.WCO,
  CAPABILITIES.MWE,
];
const competenciesSelectionCategories = [
  SELECTION_CATEGORIES.INTERVIEW,
  SELECTION_CATEGORIES.SITUATIONAL,
  SELECTION_CATEGORIES.ROLEPLAY,
];
const skillsAbilitiesCapabilities = [
  CAPABILITIES.LJ,
  CAPABILITIES.PQ,
  CAPABILITIES.L,
  CAPABILITIES.WE,
];
const skillsAbilitiesSelectionCategories = [
  SELECTION_CATEGORIES.INTERVIEW,
  SELECTION_CATEGORIES.SITUATIONAL,
  SELECTION_CATEGORIES.LEADERSHIP,
  SELECTION_CATEGORIES.ROLEPLAY,
];

export default {
  components: {
    ErrorSummary,
    RadioGroup,
    RadioItem,
    CheckboxGroup,
    CheckboxItem,
  },
  extends: Form,
  data(){
    const defaults = {
      assessmentFramework: null,
      capabilities: null,
      selectionCategories: null,
    };
    const formData = this.$store.getters['exerciseDocument/data'](defaults);

    return {
      formData: formData,
    };
  },
  computed: {
    hasJourney() {
      return this.$store.getters['exerciseCreateJourney/hasJourney'];
    },
    capabilities() {
      switch (this.formData.assessmentFramework) {
      case 'competencies':
        return competenciesCapabilities;
      case 'skills-abilities':
        return skillsAbilitiesCapabilities;
      default:
        return [];
      }
    },
    selectionCategories() {
      switch (this.formData.assessmentFramework) {
      case 'competencies':
        return competenciesSelectionCategories;
      case 'skills-abilities':
        return skillsAbilitiesSelectionCategories;
      default:
        return [];
      }
    },
  },
  watch: {
    'formData.assessmentFramework': function (newValue) {
      // set default capabilities and selection categories based on the assessment framework
      if (newValue === 'competencies') {
        this.formData.capabilities = competenciesCapabilities.map(item => item.value).filter(item => item !== CAPABILITIES.L.value);
        this.formData.selectionCategories = competenciesSelectionCategories.map(item => item.value);
      } else if (newValue === 'skills-abilities') {
        this.formData.capabilities = skillsAbilitiesCapabilities.map(item => item.value);
        this.formData.selectionCategories = skillsAbilitiesSelectionCategories.map(item => item.value);
      }
    },
  },
  methods: {
    async save(isValid) {
      this.formData['progress.additionalSettings'] = isValid ? true : false;
      await this.$store.dispatch('exerciseDocument/save', this.formData);
      this.$router.push(this.$store.getters['exerciseCreateJourney/nextPage']('exercise-details-selection-setup'));
    },
  },
};
</script>
