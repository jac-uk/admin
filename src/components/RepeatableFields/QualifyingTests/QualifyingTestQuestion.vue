<template>
  <fieldset class="govuk-fieldset govuk-!-margin-bottom-5">
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

    <h3 class="govuk-heading-m">
      Options
    </h3>

    <RepeatableFields
      v-model="row.options"
      :component="repeatableFields.Answer"
      :ident="`questions-input-${id}`"
      :allow-empty="true"
      required
    />
    <slot name="removeButton" />
  </fieldset>
</template>

<script>
import RepeatableFields from '@/components/RepeatableFields';
import Answer from '@/components/RepeatableFields/Answer';
import CriticalAnalysis from '@/components/RepeatableFields/QualifyingTests/CriticalAnalysis';
import Scenario from '@/components/RepeatableFields/QualifyingTests/Scenario';
import SituationalJudgement from '@/components/RepeatableFields/QualifyingTests/SituationalJudgement';
import { QUALIFYING_TEST } from '@/helpers/constants';

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
      return this.type === QUALIFYING_TEST.TYPE.CRITICAL_ANALYSIS ? true : false;
    },
    isScenario() {
      return this.type === QUALIFYING_TEST.TYPE.SCENARIO ? true : false;
    },
    isSituationalJudgement() {
      return this.type === QUALIFYING_TEST.TYPE.SITUATIONAL_JUDGEMENT ? true : false;
    },
  },
};
</script>
