<template>
  <fieldset class="govuk-fieldset govuk-!-margin-bottom-5">
    <legend class="govuk-fieldset__legend govuk-fieldset__legend--l">
      <h3
        v-if="isScenario"
        class="govuk-fieldset__heading"
      >
        Scenario {{ index + 1 }}
      </h3>
      <h3
        v-else
        class="govuk-fieldset__heading"
      >
        Question {{ index + 1 }}
      </h3>
    </legend>
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

    <h3
      v-if="isSituationalJudgement || isCriticalAnalysis"
      class="govuk-heading-m"
    >
      Options
    </h3>

    <RepeatableFields
      v-model="row.options"
      :component="repeatableFields.Answer"
      :ident="`questions-input-${id}`"
      :type-name="typeName"
      required
    />

    <Select 
      v-if="isSituationalJudgement"
      id="mostAppropriate"
      v-model="row.mostAppropriate"
      label="Most appropriate answer"
      required
    >
      <option>
        Select an answer option
      </option>
      <option 
        v-for="(option, optionIndex) in row.options" 
        :key="optionIndex" 
        :value="optionIndex"
      >
        {{ option.answer }}
      </option>
    </Select>

    <Select
      v-if="isSituationalJudgement"
      id="leastAppropriate"
      v-model="row.leastAppropriate"
      label="Least appropriate answer"
      required
    >
      <option>
        Select an answer option
      </option>
      <option 
        v-for="(option, optionIndex) in row.options" 
        :key="optionIndex" 
        :value="optionIndex"
      >
        {{ option.answer }}
      </option>
    </Select>

    <Select
      v-if="isCriticalAnalysis"
      id="correct"
      v-model="row.correct"
      label="Correct answer"
      required
    >
      <option>
        Select an answer option
      </option>
      <option 
        v-for="(option, optionIndex) in row.options" 
        :key="optionIndex" 
        :value="optionIndex"
      >
        {{ option.answer }}
      </option>
    </Select>

    <slot name="removeButton" />
    <hr class="govuk-section-break govuk-section-break--visible">
  </fieldset>
</template>

<script>
import Select from '@/components/Form/Select';
import RepeatableFields from '@/components/RepeatableFields';
import Answer from '@/components/RepeatableFields/Answer';
import CriticalAnalysis from '@/components/RepeatableFields/QualifyingTests/CriticalAnalysis';
import Scenario from '@/components/RepeatableFields/QualifyingTests/Scenario';
import SituationalJudgement from '@/components/RepeatableFields/QualifyingTests/SituationalJudgement';
import { QUALIFYING_TEST } from '@/helpers/constants';

export default {
  name: 'QualifyingTestQuestion',
  components: {
    Select,
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
    typeName() {
      return this.isScenario ? 'question' : 'answer option';
    },
  },
};
</script>
