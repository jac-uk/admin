<template>
  <dl class="govuk-summary-list">
    <div class="govuk-summary-list__row">
      <dt class="govuk-summary-list__key">
        Full name
      </dt>
      <dd class="govuk-summary-list__value">
        {{ data.fullName }}
      </dd>
    </div>
    <div class="govuk-summary-list__row">
      <dt class="govuk-summary-list__key">
        Email
      </dt>
      <dd class="govuk-summary-list__value">
        {{ data.email }}
      </dd>
    </div>
    <div class="govuk-summary-list__row">
      <dt class="govuk-summary-list__key">
        Phone
      </dt>
      <dd class="govuk-summary-list__value">
        {{ data.phone }}
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
