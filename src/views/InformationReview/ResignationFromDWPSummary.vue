<template>
  <div>
    <div class="govuk-!-margin-top-9">
      <h2 class="govuk-heading-l govuk-!-margin-bottom-4">
        Resignation from the Department for Work and Pensions (DWP)
      </h2>

      <dl class="govuk-summary-list govuk-!-margin-bottom-0">
        <div class="govuk-summary-list__row">
          <dt class="govuk-summary-list__key widerColumn">
            Do you currently work at the Department for Work and Pensions (DWP)?
          </dt>
          <dd class="govuk-summary-list__value">
            <InformationReviewRenderer
              :edit="editable"
              :options="[true, false]"
              type="selection"
              :data="workingAtDWP"
              field="resignationFromDWP"
              extension="workingAtDWP"
              @change-field="changeInfo"
            />
          </dd>
        </div>
      </dl>
    </div>
  </div>
</template>

<script>
import InformationReviewRenderer from '@/components/Page/InformationReviewRenderer.vue';

export default {
  name: 'ResignationFromDWPSummary',
  components: {
    InformationReviewRenderer,
  },
  props: {
    application: {
      type: Object,
      required: true,
      default: () => {},
    },
    editable: {
      type: [Boolean, Function, Promise],
      required: true,
      default: false,
    },
  },
  emits: ['updateApplication'],
  computed: {
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    resignationFromDWP() {
      return this.application.resignationFromDWP;
    },
    workingAtDWP() {
      return this.resignationFromDWP?.workingAtDWP;
    },
  },
  methods: {
    changeInfo(obj) {
      const changedObj = this.application[obj.field] || {};
      if (obj.hasOwnProperty('change') && obj.hasOwnProperty('extension')) {
        changedObj[obj.extension] = obj.change;
        const updatedApplication = {
          ...this.application,
          [obj.field]: changedObj,
        };
        this.$emit('updateApplication', updatedApplication);
      }
    },
  },
};
</script>

<style scoped>
  .widerColumn {
    width: 70%;
  }
</style>
