<template>
  <div class="govuk-grid-row">
    <fieldset class="govuk-fieldset govuk-!-margin-bottom-5">
      <div class="govuk-grid-column-full">
        <CriticalAnalysis 
          v-if="isCriticalAnalysis"
          v-model="row.details"
        />
        <Scenario 
          v-if="isScenario"
          v-model="row.details"
        />
        <SituationalJudgement 
          v-if="isSituationalJudgement"
          v-model="row.details"
        />
      </div>
      <div class="govuk-grid-column-three-quarters">      
        <RepeatableFields
          v-model="row.options"
          :component="repeatableFields.Answer"
          :ident="`questions-input-${id}`"
          :allow-empty="true"
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
    const defaults = {
      question: {
        details: '',
        options: [],
      },
    };
    const question = { ...defaults, ...this.row };
    return {
      repeatableFields: {
        Answer,
      },
      question: question,
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
