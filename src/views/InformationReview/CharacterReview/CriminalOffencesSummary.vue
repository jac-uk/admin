<template>
  <div>
    <dl class="govuk-summary-list govuk-!-margin-bottom-0">
      <div class="govuk-summary-list__row">
        <dt :class="requiredStyle">
          Has been convicted for a criminal offence
        </dt>
        <dd class="govuk-summary-list__value">
          <InformationReviewSectionRenderer
            :data="characterInformation.criminalConvictionDetails"
            :data-default="emptyDetailObject"
            field="criminalConvictionDetails"
            @changeField="changeCharacterInfo"
          />
        </dd>
      </div>
    </dl>

    <dl class="govuk-summary-list govuk-!-margin-bottom-0">
      <!-- <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key widerColumn">
          Has been cautioned for a criminal offence
        </dt>
        <dd class="govuk-summary-list__value">
          <InformationReviewSectionRenderer
            :data="characterInformation.criminalCautionDetails"
            :data-default="emptyDetailObject"
            field="criminalCautionDetails"
            @changeField="changeCharacterInfo"
          />
        </dd>
      </div> -->
    </dl>
  </div>
</template>

<script>
import InformationReviewSectionRenderer from '@/components/Page/InformationReviewSectionRenderer';

export default {
  name: 'CriminalOffencesSummary',
  components: {
    InformationReviewSectionRenderer,
  },
  props: {
    characterInformation: {
      type: Object,
      required: true,
      default: () => {},
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
    emptyDetailObject() {
      return {
        'details': '',
        'date': new Date(),
        'title': '',
      };
    },
  },
  methods: {
    changeCharacterInfo(obj) {
      let changedObj = this.characterInformation[obj.field];
      if (obj.change && obj.extension && obj.field && obj.index) {
        changedObj[obj.index][obj.extension] = obj.change;
        changedObj = { [obj.field]: changedObj };
      } else if (obj.index && obj.change) {
        changedObj[obj.index] = obj.change;
        changedObj = { [obj.field]: changedObj };
      } else {
        changedObj = obj;
      }
      this.$emit('changeCharacterInfo', changedObj);
    },
  },
};
</script>

<style scoped>
  .widerColumn {
    width: 50%;
  }
</style>

