<template>
  <div>
    <div
      v-if="commissioners"
      class="govuk-!-margin-top-9"
    >
      <h2 class="govuk-heading-l govuk-!-margin-bottom-4">
        Commissioner conflicts
      </h2>

      <dl
        v-if="commissionerConflicts.length || editable"
        class="govuk-summary-list"
      >
        <div
          v-for="(commissionerConflict, index) in commissionerConflicts"
          :key="index"
          class="govuk-summary-list__row"
        >
          <dt class="govuk-summary-list__key widerColumn">
            {{ commissionerConflict.name }}
          </dt>
          <dd class="govuk-summary-list__value">
            <InformationReviewRenderer
              :data="commissionerConflict.hasRelationship"
              field="hasRelationship"
              :edit="editable"
              type="selection"
              :options="[true, false]"
              :is-asked="isApplicationPartAsked('commissionerConflicts')"
              @change-field="(obj) => changeCommissionerConflict(obj, index)"
            />
            <div
              v-if="commissionerConflict.hasRelationship"
              class="govuk-body"
            >
              <dt class="govuk-summary-list__key">
                Details
              </dt>
              <InformationReviewRenderer
                v-if="commissionerConflict.hasRelationship"
                :data="commissionerConflict.details"
                field="details"
                :edit="editable"
                :is-asked="isApplicationPartAsked('commissionerConflicts')"
                @change-field="(obj) => changeCommissionerConflict(obj, index)"
              />
            </div>
          </dd>
        </div>
      </dl>
    </div>
  </div>
</template>

<script>
import InformationReviewRenderer from '@/components/Page/InformationReviewRenderer.vue';
import { isApplicationPartAsked } from '@jac-uk/jac-kit/helpers/exerciseHelper';

export default {
  name: 'CommissionerConflictsSummary',
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
    commissioners() {
      return this.$store.getters['services/getCommissioners']();
    },
    commissionerConflicts() {
      if (Array.isArray(this.commissioners)) {
        return this.commissioners.map((commissioner) => {
          const match = this.application?.additionalInfo?.commissionerConflicts?.find?.((commissionerConflict) => {
            return commissionerConflict.name === commissioner.name;
          });
          return match ? match : {
            name: commissioner.name,
            hasRelationship: null,
            details: null,
          };
        });
      }
      return [];
    },
  },
  methods: {
    getCommissionerConflicts(name) {
      return this.commissionerConflicts.find((commissionerConflict) => {
        return commissionerConflict.name === name;
      });
    },
    isApplicationPartAsked(part) {
      return isApplicationPartAsked(this.exercise, part);
    },
    changeCommissionerConflict(obj, index) {
      const commissionerConflicts = this.commissionerConflicts.map((commissionerConflict, i) => {
        return i === index ? { ...commissionerConflict, ...obj } : commissionerConflict;
      });
      const data = {
        additionalInfo: {
          ...this.application.additionalInfo,
          commissionerConflicts,
        },
      };
      this.$emit('updateApplication', data);
    },
  },
};
</script>

<style scoped>
  .widerColumn {
    width: 70%;
  }
</style>
