<template>
  <div>
    <dl
      v-if="characterInformation.bankruptcyDetails"
      class="govuk-summary-list govuk-!-margin-bottom-0"
    >
      <div class="govuk-summary-list__row">
        <dd class="govuk-summary-list__value">
          <span class="govuk-!-font-weight-bold">Has been declared bankrupt</span>
          <InformationReviewRenderer
            :data="characterInformation.bankruptcyDetails"
            :display-month-year-only="false"
          />
        </dd>
      </div>
    </dl>

    <dl
      v-if="characterInformation.ivaDetails"
      class="govuk-summary-list govuk-!-margin-bottom-0"
    >
      <div class="govuk-summary-list__row">
        <dd class="govuk-summary-list__value">
          <span class="govuk-!-font-weight-bold">Has entered into an Individual Voluntary Agreement (IVA)</span>
          <InformationReviewRenderer
            :data="characterInformation.ivaDetails"
            :display-month-year-only="false"
          />
        </dd>
      </div>
    </dl>

    <dl
      v-if="characterInformation.lateTaxReturnDetails"
      class="govuk-summary-list govuk-!-margin-bottom-0"
    >
      <div class="govuk-summary-list__row">
        <dd class="govuk-summary-list__value">
          <span class="govuk-!-font-weight-bold">Has filed late tax returns</span>
          <InformationReviewRenderer
            :data="characterInformation.lateTaxReturnDetails"
            :display-month-year-only="false"
          />
        </dd>
      </div>
    </dl>

    <dl
      v-if="characterInformation.lateVatReturnDetails"
      class="govuk-summary-list govuk-!-margin-bottom-0"
    >
      <div class="govuk-summary-list__row">
        <dd class="govuk-summary-list__value">
          <span class="govuk-!-font-weight-bold">Has filed late VAT returns</span>
          <InformationReviewRenderer
            :data="characterInformation.lateVatReturnDetails"
            :display-month-year-only="false"
          />
        </dd>
      </div>
    </dl>

    <dl
      v-if="characterInformation.hmrcFineDetails"
      class="govuk-summary-list govuk-!-margin-bottom-0"
    >
      <div class="govuk-summary-list__row">
        <dd class="govuk-summary-list__value">
          <span class="govuk-!-font-weight-bold">Has ever been fined by HMRC</span>
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
  name: 'FinancialMattersAgencyReport',
  components: {
    InformationReviewRenderer,
  },
  props: {
    characterInformation: {
      type: Object,
      required: true,
      default: new Object({}),
    },
  },
};
</script>
