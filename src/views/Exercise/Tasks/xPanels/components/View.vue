<template>
  <dl class="govuk-summary-list">
    <div class="govuk-summary-list__row">
      <dt class="govuk-summary-list__key">
        Panel name
      </dt>
      <dd class="govuk-summary-list__value">
        {{ data.name }}
      </dd>
    </div>
    <div class="govuk-summary-list__row">
      <dt class="govuk-summary-list__key">
        Date from
      </dt>
      <dd class="govuk-summary-list__value">
        {{ data.dateFrom }}
      </dd>
    </div>
    <div class="govuk-summary-list__row">
      <dt class="govuk-summary-list__key">
        Date to
      </dt>
      <dd class="govuk-summary-list__value">
        {{ data.dateTo }}
      </dd>
    </div>
  </dl>
</template>

<script>

export default {
  props: {
    data: {
      type: Object,
      required: false,
      default: () => {},
    },
  },
};
</script>
