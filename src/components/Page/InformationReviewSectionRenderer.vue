<template>
  <div>
    <div
      v-for="(item, index) in data"
      :key="item.name"
      class="govuk-summary-list govuk-!-margin-bottom-0"
    >
      <div 
        v-if="item.financialYear"
        class="govuk-summary-list govuk-!-margin-top-1"
      >
        <dt class="govuk-summary-list__key">
          Financial year
        </dt>
        <dd class="govuk-summary-list__value">
          <InformationReviewRenderer
            :data="data[index].financialYear"
            :field="field"
            :index="index"
            extension="financialYear"
            @changeField="changeField"
          />
        </dd>
      </div>

      <div
        v-if="item.title"
        class="govuk-summary-list govuk-!-margin-bottom-0"
      >
        <dt class="govuk-summary-list__key">
          <span>
            {{ index + 1 }}:
          </span>
          Title
        </dt>
        <dd class="govuk-summary-list__value">
          <InformationReviewRenderer
            :data="data[index].title"
            :field="field"
            :index="index"
            extension="title"
            @changeField="changeField"
          />
        </dd>
      </div>

      <!-- <div
        v-else
        class="govuk-summary-list govuk-!-margin-bottom-0"
      >
        <dd class="govuk-summary-list__value">
            type="selection"
            :options="[true, false]"
            :value="data[index]"
            :field="field"
            :index="index"
            @changeField="changeField"
          />
        </dd>
      </div>  -->

      <div
        v-if="item.date"
        class="govuk-summary-list govuk-!-margin-bottom-0"
      >
        <dt class="govuk-summary-list__key">
          Date
        </dt>
        <dd class="govuk-summary-list__value">
          <InformationReviewRenderer
            :data="data[index].date"
            :field="field"
            :index="index"
            extension="date"
            type="date"
            @changeField="changeField"
          />
        </dd>
      </div>

      <div
        v-if="item.details"
        class="govuk-summary-list govuk-!-margin-bottom-0"
      >
        <dt class="govuk-summary-list__key">
          Details
        </dt>
        <dd class="govuk-summary-list__value">
          <InformationReviewRenderer
            :data="data[index].details"
            :field="field"
            :index="index"
            extension="details"
            @changeField="changeField"
          />
        </dd>
      </div>

      <div
        v-if="item.investigationConclusionDate" 
        class="govuk-summary-list govuk-!-margin-bottom-0"
      >
        <dt class="govuk-summary-list__key">
          Investigation Conclusion Date
        </dt>
        <dd class="govuk-summary-list__value">
          <InformationReviewRenderer
            :value="data[index].investigationConclusionDate"
            :field="field"
            :index="index"
            extension="investigationConclusionDate"
            type="date"
            @changeField="changeField"
          />
        </dd>
      </div>
    
      <hr>
    </div>
  </div>
</template>

<script>
import InformationReviewRenderer from '@/components/Page/InformationReviewRenderer';
import { formatDate } from '@jac-uk/jac-kit/filters/filters';

export default {
  components: {
    InformationReviewRenderer,
  },
  props: {
    field: {
      type: String,
      required: true,
      default: () => '',
    },
    data: {
      type: [Array, Object],
      required: false,
      default: () => null,
    },
  },
  methods: {
    displayDate(date) {
      return this.displayMonthYearOnly ? formatDate(date, 'month') : formatDate(date);
    },
    changeField(obj) {
      // console.log(obj);
      this.$emit('changeField', obj);
    },
  },
};
</script>
