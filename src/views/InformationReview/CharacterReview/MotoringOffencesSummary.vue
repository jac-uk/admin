<template>
  <div>
    <dl class="govuk-summary-list govuk-!-margin-bottom-0">
      <div class="govuk-summary-list__row">
        <dt :class="requiredStyle">
          Has been disqualified from driving
        </dt>
        <dd class="govuk-summary-list__value">
          <InformationReviewSectionRenderer
            :data="characterInformation.drivingDisqualificationDetails"
            :data-default="emptyDetailObject"
            :edit="edit"
            field="drivingDisqualificationDetails"
            @changeField="changeCharacterInfo"
          />
        </dd>
      </div>
    </dl>

    <dl class="govuk-summary-list govuk-!-margin-bottom-0">
      <div class="govuk-summary-list__row">
        <dt :class="requiredStyle">
          Was convicted of any motoring offences in the past 4 years
        </dt>
        <dd class="govuk-summary-list__value">
          <InformationReviewSectionRenderer
            :data="characterInformation.recentDrivingConvictionDetails"
            :data-default="emptyDetailObject"
            :edit="edit"
            field="recentDrivingConvictionDetails"
            @changeField="changeCharacterInfo"
          />
        </dd>
      </div>
    </dl>
  </div>
</template>

<script>
import InformationReviewSectionRenderer from '@/components/Page/InformationReviewSectionRenderer';

export default {
  name: 'MotoringOffencesSummary',
  components: {
    InformationReviewSectionRenderer,
  },
  props: {
    characterInformation: {
      type: Object,
      required: true,
      default: () => {},
    },
    edit: {
      type: [Boolean, Function, Promise],
      required: true,
      default: false,
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
        'title': '',
        'date': new Date(),
        'details': '',
      };
    },
  },
  methods: {
    changeCharacterInfo(obj) {
      let changedObj = this.characterInformation[obj.field] || {};

      if (obj.change && obj.extension && obj.field && obj.hasOwnProperty('index')) { //UPDATE

        changedObj[obj.index][obj.extension] = obj.change;
      } else if (obj.hasOwnProperty('index') && obj.change && !obj.remove) { // ADD

        if (changedObj.length > 0){
          changedObj = [...changedObj, obj.change];
        } else {
          changedObj = [obj.change];
        } 
      } else if (obj.hasOwnProperty('index') && obj.remove) { // REMOVE

        if (changedObj.length > 0){
          changedObj.splice(obj.index, 1);
        } else {
          changedObj = [];
        } 
      } 
      changedObj = { [obj.field]: changedObj };
      this.$emit('changeCharacterInfo', changedObj);
    },
  },
};
</script>

<style scoped>
  .widerColumn {
    width: 70%;
  }
</style>

