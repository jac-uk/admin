<template>
  <dl
    v-if="characterInformation && Object.keys(characterInformation).length || edit"
    class="govuk-summary-list"
  >
    <div class="govuk-summary-list__row">
      <dt :class="requiredStyle">
        Has been cautioned or convicted of a criminal offence
      </dt>
      <dd
        class="govuk-summary-list__value"
      >
        <InformationReviewRenderer
          :data="characterInformation.criminalOffences"
          :options="[true, false]"
          :edit="edit"
          type="selection"
          field="criminalOffences"
          @changeField="changeCharacterFlag"
        />
        <InformationReviewSectionRenderer
          v-if="characterInformation.criminalOffences"
          :data="characterInformation.criminalOffenceDetails"
          :data-default="emptyDetailObject"
          :edit="edit"
          field="criminalOffenceDetails"
          @changeField="changeCharacterInfo"
        />
      </dd>
    </div>
    
    <div class="govuk-summary-list__row">
      <dt :class="requiredStyle">
        Has received a non-motoring penalty notice in the last 4 years
      </dt>
      <dd
        class="govuk-summary-list__value"
      >
        <InformationReviewRenderer
          :data="characterInformation.nonMotoringFixedPenaltyNotices"
          :options="[true, false]"
          :edit="edit"
          type="selection"
          field="nonMotoringFixedPenaltyNotices"
          @changeField="changeCharacterFlag"
        />
          
        <InformationReviewSectionRenderer
          v-if="characterInformation.nonMotoringFixedPenaltyNotices"
          :data="characterInformation.nonMotoringFixedPenaltyNoticesDetails"
          :edit="edit"
          :data-default="emptyDetailObject"
          field="nonMotoringFixedPenaltyNoticeDetails"
          @changeField="changeCharacterInfo"
        />
      </dd>
    </div>

    <div class="govuk-summary-list__row">
      <dt :class="requiredStyle">
        Has been disqualified from driving, or convicted for driving under the influence of drink or drugs
      </dt>
      <dd
        class="govuk-summary-list__value"
      >
        <InformationReviewRenderer
          :data="characterInformation.drivingDisqualificationDrinkDrugs"
          :options="[true, false]"
          :edit="edit"
          type="selection"
          field="drivingDisqualificationDrinkDrugs"
          @changeField="changeCharacterFlag"
        />
          
        <InformationReviewSectionRenderer
          v-if="characterInformation.drivingDisqualificationDrinkDrugs"
          :data="characterInformation.drivingDisqualificationDrinkDrugsDetails"
          :data-default="emptyDetailObject"
          :edit="edit"
          field="drivingDisqualificationDrinkDrugsDetails"
          @changeField="changeCharacterInfo"
        />
      </dd>
    </div>

    <div class="govuk-summary-list__row">
      <dt :class="requiredStyle">
        Has endorsements on licence, or received any motoring fixed-penalty notices in the last 4 years
      </dt>
      <dd
        class="govuk-summary-list__value"
      >
        <InformationReviewRenderer
          :data="characterInformation.endorsementsOrMotoringFixedPenalties"
          :options="[true, false]"
          :edit="edit"
          type="selection"
          field="endorsementsOrMotoringFixedPenalties"
          @changeField="changeCharacterFlag"
        />
          
        <InformationReviewSectionRenderer
          v-if="characterInformation.endorsementsOrMotoringFixedPenalties"
          :edit="edit"
          :data="characterInformation.endorsementsOrMotoringFixedPenaltiesDetails"
          :data-default="emptyDetailObject"
          field="endorsementsOrMotoringFixedPenaltiesDetails"
          @changeField="changeCharacterInfo"
        />
      </dd>
    </div>

    <div class="govuk-summary-list__row">
      <dt :class="requiredStyle">
        Has been declared bankrupt or entered into an Individual Voluntary Agreement (IVA)
      </dt>
      <dd
        class="govuk-summary-list__value"
      >
        <InformationReviewRenderer
          :data="characterInformation.declaredBankruptOrIVA"
          :options="[true, false]"
          :edit="edit"
          type="selection"
          field="declaredBankruptOrIVA"
          @changeField="changeCharacterFlag"
        />
          
        <InformationReviewSectionRenderer
          v-if="characterInformation.declaredBankruptOrIVA"
          :edit="edit"
          :data="characterInformation.declaredBankruptOrIVADetails"
          :data-default="emptyDetailObject"
          field="declaredBankruptOrIVADetails"
          @changeField="changeCharacterInfo"
        />
      </dd>
    </div>

    <div class="govuk-summary-list__row">
      <dt :class="requiredStyle">
        Has filed late tax returns or been fined by HMRC
      </dt>
      <dd
        class="govuk-summary-list__value"
      >
        <InformationReviewRenderer
          :data="characterInformation.lateTaxReturnOrFined"
          :options="[true, false]"
          :edit="edit"
          type="selection"
          field="lateTaxReturnOrFined"
          @changeField="changeCharacterFlag"
        />
          
        <InformationReviewSectionRenderer
          v-if="characterInformation.lateTaxReturnOrFined"
          :edit="edit"
          :data="characterInformation.lateTaxReturnOrFinedDetails"
          :data-default="emptyDetailObject"
          field="lateTaxReturnOrFinedDetails"
          @changeField="changeCharacterInfo"
        />
      </dd>
    </div>

    <div class="govuk-summary-list__row">
      <dt :class="requiredStyle">
        Has ever been, or is currently, subject to professional misconduct, negligence, wrongful dismissal, discrimination or harassment proceedings
      </dt>
      <dd
        class="govuk-summary-list__value"
      >
        <InformationReviewRenderer
          :data="characterInformation.involvedInProfessionalMisconduct"
          :options="[true, false]"
          :edit="edit"
          type="selection"
          field="involvedInProfessionalMisconduct"
          @changeField="changeCharacterFlag"
        />
          
        <InformationReviewSectionRenderer
          v-if="characterInformation.involvedInProfessionalMisconduct"
          :data="characterInformation.involvedInProfessionalMisconductDetails"
          :edit="edit"
          :data-default="emptyDetailObject"
          field="involvedInProfessionalMisconductDetails"
          @changeField="changeCharacterInfo"
        />
      </dd>
    </div>
    
    <div class="govuk-summary-list__row">
      <dt :class="requiredStyle">
        Has ever been subject to complaints or disciplinary action, or been asked to resign from a position
      </dt>
      <dd
        class="govuk-summary-list__value"
      >
        <InformationReviewRenderer
          :data="characterInformation.diciplinaryActionOrAskedToResign"
          :options="[true, false]"
          :edit="edit"
          type="selection"
          field="diciplinaryActionOrAskedToResign"
          @changeField="changeCharacterFlag"
        />
          
        <InformationReviewSectionRenderer
          v-if="characterInformation.diciplinaryActionOrAskedToResign"
          :data="characterInformation.diciplinaryActionOrAskedToResignDetails"
          :data-default="emptyDetailObject"
          :edit="edit"
          field="diciplinaryActionOrAskedToResignDetails"
          @changeField="changeCharacterInfo"
        />
      </dd>
    </div>

    <div class="govuk-summary-list__row">
      <dt :class="requiredStyle">
        Has any other character issues
      </dt>
      <dd
        class="govuk-summary-list__value"
      >
        <InformationReviewRenderer
          :data="characterInformation.otherCharacterIssues"
          :options="[true, false]"
          :edit="edit"
          type="selection"
          field="otherCharacterIssues"
          @changeField="changeCharacterFlag"
        />
          
        <InformationReviewSectionRenderer
          v-if="characterInformation.otherCharacterIssues"
          :data="characterInformation.otherCharacterIssuesDetails"
          :edit="edit"
          :data-default="emptyDetailObject"
          field="otherCharacterIssuesDetails"
          @changeField="changeCharacterInfo"
        />
      </dd>
    </div>
  </dl>
  <span
    v-else
    class="govuk-body"
  >
    No information provided
  </span>
</template>

<script>
import InformationReviewRenderer from '@/components/Page/InformationReviewRenderer';
import InformationReviewSectionRenderer from '@/components/Page/InformationReviewSectionRenderer';

export default {
  name: 'CharacterInformationSummaryV1',
  components: {
    InformationReviewRenderer,
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
        'details': '',
        'date': new Date(),
        'title': '',
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
    changeCharacterFlag(obj) {
      this.$emit('changeCharacterInfo', obj);
    },
  },
};
</script>

<style scoped>
  .widerColumn {
    width: 70%;
  }
</style>
