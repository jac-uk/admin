<template>
  <div>
    <dl
      v-if="characterInformation.bankruptcyDetails"
      class="govuk-summary-list govuk-!-margin-bottom-0"
    >
      <div class="govuk-summary-list__row">
        <dd class="govuk-summary-list__value">
          <span class="govuk-!-font-weight-bold">Has been declared bankrupt</span>
          <InformationReviewSectionRenderer
            :data="characterInformation.bankruptcyDetails"
            :data-default="emptyObject(['details', 'date', 'title'])"
            :edit="false"
            field="bankruptcyDetails"
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
          <InformationReviewSectionRenderer
            :data="characterInformation.ivaDetails"
            :data-default="emptyObject(['details', 'date', 'title'])"
            :edit="false"
            field="ivaDetails"
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
          <InformationReviewSectionRenderer
            :data="characterInformation.lateTaxReturnDetails"
            :data-default="emptyObject(['details', 'date', 'title'])"
            :edit="false"
            field="lateTaxReturnDetails"
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
          <InformationReviewSectionRenderer
            :data="characterInformation.lateVatReturnDetails"
            :data-default="emptyObject(['details', 'date', 'title'])"
            :edit="false"
            field="lateVatReturnDetails"
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
          <InformationReviewSectionRenderer
            :data="characterInformation.hmrcFineDetails"
            :data-default="emptyObject(['details', 'date', 'title'])"
            :edit="false"
            field="hmrcFineDetails"
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
          <InformationReviewSectionRenderer
            :data="characterInformation.hmrcTaxDetails"
            :data-default="emptyObject(['details'])"
            :edit="false"
            field="hmrcTaxDetails"
            :is-asked="'hmrcTaxDetails' in characterInformation"
          />
        </dd>
      </div>
    </dl>
  </div>
</template>

<script>
import InformationReviewSectionRenderer from '@/components/Page/InformationReviewSectionRenderer.vue';

export default {
  name: 'FinancialMattersAgencyReport',
  components: {
    InformationReviewSectionRenderer,
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
  methods: {
    emptyObject(items){
      const obj = {};
      if (items.some(item => item === 'title')) {
        obj.title = '';
      }
      if (items.some(item => item === 'date')) {
        obj.date = new Date();
      }
      if (items.some(item => item === 'details')) {
        obj.details = '';
      }
      return obj;
    },
  },
};
</script>
