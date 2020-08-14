<template>
  <div class="govuk-grid-row">
    <fieldset class="govuk-fieldset govuk-!-margin-bottom-5">
      <div class="govuk-grid-column-full">
        <CriticalAnalysis v-if="isCriticalAnalysis" />
        <Scenario v-if="isScenario" />
        <SituationalJudgement v-if="isSituationalJudgement" />
      </div>
      <div class="govuk-grid-column-three-quarters">      
        <RepeatableFields
          :component="repeatableFields.Answer"
          ident="questions-input"
          required
        />
      </div>
    </fieldset>
  </div>
</template>

<script>
import RepeatableFields from '@/components/RepeatableFields';
import Answer from '@/components/RepeatableFields/Answer';
import CriticalAnalysis from '@/components/RepeatableFields/QualifyingTests/CriticalAnalysis';
import Scenario from '@/components/RepeatableFields/QualifyingTests/Scenario';
import SituationalJudgement from '@/components/RepeatableFields/QualifyingTests/SituationalJudgement';

export default {
  name: 'QualifyingTestQuestion',
  components: {
    CriticalAnalysis,
    Scenario,
    RepeatableFields,
    SituationalJudgement,
  },
  props: {
    row: {
      required: true,
      type: Object,
    },
    index: {
      required: true,
      type: Number,
    },
    type: {
      required: true,
      type: String,
    },
    id: {
      required: false,
      type: String,
      default: '',
    },        
  },
  data() {
    return {
      repeatableFields: {
        Answer,
      },      
    };
  },
  computed: {
    isCriticalAnalysis() {
      return this.type === 'critical-analysis' ? true : false;
    },
    isScenario() {
      return this.type === 'scenario' ? true : false;
    },
    isSituationalJudgement() {
      return this.type === 'situational-judgement' ? true : false;
    },
  },
};
</script>
