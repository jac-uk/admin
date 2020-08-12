<template>
  <div class="govuk-grid-row">
    <form>
      <div class="govuk-grid-column-two-thirds">
        <BackLink />

        <h1 class="govuk-heading-xl">
          Add questions to the test
        </h1>

        <ErrorSummary 
          :errors="errors" 
          :show-save-button="true" 
        />
        <fieldset class="govuk-fieldset govuk-!-margin-bottom-5">
          <legend class="govuk-fieldset__legend govuk-fieldset__legend--l">
            <h3 class="govuk-fieldset__heading">
              Critical Analysis
            </h3>
          </legend>
          <TextField
            id="qt-critical-analysis"
            label="Question X"
          />      
          <RepeatableFields
            :component="repeatableFields.Answer"
            ident="qt-critical-analysis"
            required
          />
        </fieldset>

        <button class="govuk-button">
          Save question
        </button>
      </div>
    </form>
  </div>
</template>
<script>
import Form from '@/components/Form/Form';
import ErrorSummary from '@/components/Form/ErrorSummary';
import TextField from '@/components/Form/TextField';
import RepeatableFields from '@/components/RepeatableFields';
import Answer from '@/components/RepeatableFields/Answer';
import BackLink from '@/components/BackLink';

export default {
  components: {
    ErrorSummary,
    BackLink,
    TextField,
    RepeatableFields,
  },
  extends: Form,
  data () {
    return {
      repeatableFields: {
        Answer,
      },
    };
  },
};
</script>
