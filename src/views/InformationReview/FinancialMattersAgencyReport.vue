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
            :is-asked="'bankruptcyDetails' in characterInformation"
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
          <span class="govuk-!-font-weight-bold">
            {{ version === 3 ? 'Has entered into an Individual Voluntary Agreement (IVA) or other similar arrangement' : 'Has entered into an Individual Voluntary Agreement (IVA)' }}
          </span>
          <InformationReviewRenderer
            :data="characterInformation.ivaDetails"
            :display-month-year-only="false"
            :is-asked="'ivaDetails' in characterInformation"
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
          <span class="govuk-!-font-weight-bold">
            {{ version === 3 ? 'Has filed late tax returns and/or made late tax payments' : 'Has filed late tax returns' }}
          </span>
          <InformationReviewRenderer
            :data="characterInformation.lateTaxReturnDetails"
            :display-month-year-only="false"
            :is-asked="'lateTaxReturnDetails' in characterInformation"
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
          <span class="govuk-!-font-weight-bold">
            {{ version === 3 ? 'Has filed late VAT returns and/or made late VAT payments' : 'Has filed late VAT returns' }}
          </span>
          <InformationReviewRenderer
            :data="characterInformation.lateVatReturnDetails"
            :display-month-year-only="false"
            :is-asked="'lateVatReturnDetails' in characterInformation"
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
            :is-asked="'hmrcFineDetails' in characterInformation"
          />
        </dd>
      </div>
    </dl>

    <dl
      v-if="version === 3 && characterInformation.hmrcTaxDetails"
      class="govuk-summary-list govuk-!-margin-bottom-0"
    >
      <div class="govuk-summary-list__row">
        <dd class="govuk-summary-list__value">
          <span class="govuk-!-font-weight-bold">Is aware of any open HMRC enquiries into their tax affairs</span>
          <InformationReviewRenderer
            :data="characterInformation.hmrcTaxDetails"
            :is-asked="'hmrcTaxDetails' in characterInformation"
          />
        </dd>
      </div>
    </dl>
  </div>
</template>

<script>
import InformationReviewRenderer from '@/components/Page/InformationReviewRenderer.vue';

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
    version: {
      type: Number,
      required: false,
      default: 2,
    },
  },
};
</script>
