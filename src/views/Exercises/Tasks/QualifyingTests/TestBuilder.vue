<template>
  <div class="govuk-grid-row">
    <fieldset class="govuk-fieldset">         
      <RepeatableFields
        :component="repeatableFields.QualifyingTestQuestion"
        ident="critical-analysis"
        type="critical-analysis"
        required
      />
      <RepeatableFields
        :component="repeatableFields.QualifyingTestQuestion"
        ident="scenario"
        type="scenario"
        required
      />
    </fieldset>
  </div>
</template>
<script>
import RepeatableFields from '@/components/RepeatableFields';
import QualifyingTestQuestion from '@/components/RepeatableFields/QualifyingTestQuestion';

export default {
  components: {
    RepeatableFields,
  },
  data() {
    return {
      repeatableFields: {
        QualifyingTestQuestion,
      },      
    };
  },
};
</script>
