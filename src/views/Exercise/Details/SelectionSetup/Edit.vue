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

        <div class="govuk-inset-text">
          <p class="govuk-body">This exercise is using the new Judicial Skills and Abilities Framework (JSAF).</p>
          <button class="govuk-button govuk-button--secondary">Switch to Old framework</button>
        </div>
<!--
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
        </RadioGroup> -->

        <template v-if="formData.assessmentFramework">
          <CheckboxGroup
            id="capabilities"
            v-model="formData.capabilities"
            required
            label="Competencies"
            :messages="{required: 'Please choose at least one capability'}"
          >
            <CheckboxItem
              v-for="capability in capabilities"
              :key="capability.ref"
              :value="capability.ref"
              :label="capability.title"
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

const JSAF_COMPETENCY = {
  LS: {
    ref: 'LS',
    title: 'Legal Skills'
  },
  DWI: {
    ref: 'DWI',
    title: 'Dealing with information'
  },
  CS: {
    ref: 'CS',
    title: 'Communication Skills'
  },
  PQ: {
    ref: 'PQ',
    title: 'Personal Qualities'
  },
  EW: {
    ref: 'EW',
    title: 'Effective Working'
  },
  L: {
    ref: 'L',
    title: 'Leadership'
  },
};

const competenciesJSAF = [
  JSAF_COMPETENCY.LS,
  JSAF_COMPETENCY.DWI,
  JSAF_COMPETENCY.CS,
  JSAF_COMPETENCY.PQ,
  JSAF_COMPETENCY.EW,
  JSAF_COMPETENCY.L,
];

const selectionCategoriesJSAF = [
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
      return competenciesJSAF;
    },
    selectionCategories() {
      return selectionCategoriesJSAF;
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
