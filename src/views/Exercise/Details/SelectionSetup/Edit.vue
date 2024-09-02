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
              :key="capability"
              :value="capability"
              :label="$filters.lookup(capability)"
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
              :key="item"
              :value="item"
              :label="$filters.lookup(item)"
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

const competenciesCapabilities = ['EJ', 'PBK', 'ACI', 'WCO', 'MWE'];
const competenciesSelectionCategories = ['interview', 'situational', 'roleplay'];
const skillsAbilitiesCapabilities = ['L&J', 'PQ', 'L'];
const skillsAbilitiesSelectionCategories = ['interview', 'situational', 'leadership', 'roleplay'];

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
        this.formData.capabilities = competenciesCapabilities;
        this.formData.selectionCategories = competenciesSelectionCategories;
      } else if (newValue === 'skills-abilities') {
        this.formData.capabilities = skillsAbilitiesCapabilities;
        this.formData.selectionCategories = skillsAbilitiesSelectionCategories;
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
