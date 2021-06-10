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
            field="criminalConvictionDetails"
            @changeField="changeCharacterInfo"
          />
        </dd>
      </div>
    </dl>

    <dl class="govuk-summary-list govuk-!-margin-bottom-0">
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key widerColumn">
          Has been cautioned for a criminal offence
        </dt>
        <dd class="govuk-summary-list__value">
          <InformationReviewSectionRenderer
            :data="characterInformation.criminalCautionDetails"
            field="characterInformation.criminalCautionDetails"
            :user-id="application.userId"
          />
        </dd>
      </div>
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
    application: {
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
    emptyCriminalConvictionDetails() {
      return {
        'details': '',
        'date': '',
        'title': '',
      };
    },
  },
  methods: {
    changeCharacterInfo(obj) {
      // console.log(obj);
      if (obj.extension && obj.field) {
        let changedObj = this.application.characterInformationV2[obj.field];
        changedObj[obj.index][obj.extension] = obj.change;
        changedObj = { [obj.field]: changedObj };
        this.$emit('changeCharacterInfo', changedObj);
      }
    },
  },
};
</script>

<style scoped>
  .widerColumn {
    width: 50%;
  }
</style>

