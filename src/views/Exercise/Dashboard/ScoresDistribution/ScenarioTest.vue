<template>
  <div
    class="govuk-grid-column-one-third  govuk-!-margin-bottom-9"
  >
    <div class="panel">
      <h3 class="govuk-heading-m">
        Scenario Test
      </h3>
      <div class="govuk-body">
        <span class="govuk-!-font-size-36 color-brand govuk-!-font-weight-bold hard-coded">
          34%
        </span>
        <span class="govuk-caption-s">pass</span>
      </div>
      <div class="flex-line">
        <span>Candidates passed:</span>
        <span class="value-m hard-coded">162</span>
      </div>
      <div class="flex-line">
        <span>Candidates entered:</span>
        <span class="value-m hard-coded">477</span>
      </div>
      <div class="flex-line">
        <div>
          <span>Pass Mark:</span> <span class="value-m hard-coded">34</span>
        </div>
        <div>
          <span>Score out of:</span> <span class="value-m hard-coded">60</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ScenarioTest',
};
</script>
