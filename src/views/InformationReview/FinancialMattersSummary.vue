<template>
  <div>
    <dl class="govuk-summary-list govuk-!-margin-bottom-0">
      <div class="govuk-summary-list__row">
        <dt :class="requiredStyle">
          Has been declared bankrupt
        </dt>
        <dd class="govuk-summary-list__value">
          <InformationReviewRenderer
            :data="characterInformation.bankruptcyDetails"
            :display-month-year-only="false"
          />
        </dd>
      </div>
    </dl>

    <dl class="govuk-summary-list govuk-!-margin-bottom-0">
      <div class="govuk-summary-list__row">
        <dt :class="requiredStyle">
          Has entered into an Individual Voluntary Agreement (IVA)
        </dt>
        <dd class="govuk-summary-list__value">
          <InformationReviewRenderer
            :data="characterInformation.ivaDetails"
            :display-month-year-only="false"
          />
        </dd>
      </div>
    </dl>

    <dl class="govuk-summary-list govuk-!-margin-bottom-0">
      <div class="govuk-summary-list__row">
        <dt :class="requiredStyle">
          Has filed late tax returns
        </dt>
        <dd class="govuk-summary-list__value">
          <InformationReviewRenderer
            :data="characterInformation.lateTaxReturnDetails"
            :display-month-year-only="false"
          />
        </dd>
      </div>
    </dl>

    <dl class="govuk-summary-list govuk-!-margin-bottom-0">
      <div class="govuk-summary-list__row">
        <dt :class="requiredStyle">
          Has filed late VAT returns
        </dt>
        <dd class="govuk-summary-list__value">
          <InformationReviewRenderer
            :data="characterInformation.lateVatReturnDetails"
            :display-month-year-only="false"
          />
        </dd>
      </div>
    </dl>

    <dl class="govuk-summary-list govuk-!-margin-bottom-0">
      <div class="govuk-summary-list__row">
        <dt :class="requiredStyle">
          Has ever been fined by HMRC
        </dt>
        <dd class="govuk-summary-list__value">
          <InformationReviewRenderer
            :data="characterInformation.hmrcFineDetails"
            :display-month-year-only="false"
          />
        </dd>
      </div>
    </dl>
  </div>
</template>

<script>
import InformationReviewRenderer from '@/components/Page/InformationReviewRenderer';

export default {
  name: 'FinancialMattersSummary',
  components: {
    InformationReviewRenderer,
  },
  props: {
    characterInformation: {
      type: Object,
      required: true,
      default: new Object({}),
    },
    requiredWiderColumn: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  computed: {
    requiredStyle() {
      return this.requiredWiderColumn ? 'govuk-summary-list__key widerColumn' : 'govuk-summary-list__key';
    },
  },
};
</script>

<style scoped>
  .widerColumn {
    width: 70%;
  }
</style>
