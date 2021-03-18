<template>
  <div>
    <dl class="govuk-summary-list smallerMargin">
      <div class="govuk-summary-list__row">
        <dt :class="requiredStyle">
          Has received a fixed penalty notice in the last 4 years
        </dt>
        <dd class="govuk-summary-list__value">
          <InformationReviewRenderer
            :data="characterInformation.fixedPenaltyDetails"
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
  name: 'FixedPenaltiesSummary',
  components: {
    InformationReviewRenderer,
  },
  props: {
    characterInformation: {
      type: Object,
      required: false,
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
  .smallerMargin {
    margin-bottom: 0;
  }
</style>
