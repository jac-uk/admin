<template>
  <div>
    <!-- CriminalOffencesSummary -->
    <dl class="govuk-summary-list govuk-!-margin-bottom-0">
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key widerColumn">
          Has been convicted for a criminal offence
        </dt>
        <dd class="govuk-summary-list__value">
          <InformationReviewSectionRenderer
            :data="characterInformation.criminalConvictionDetails"
            :data-default="emptyObject(['details', 'date', 'title'])"
            :edit="edit"
            field="criminalConvictionDetails"
            @changeField="changeInfo"
            @removeField="removeInfo"
            @addField="addInfo"
          />
        </dd>
      </div>
    </dl>

    <dl class="govuk-summary-list  govuk-!-margin-bottom-0">
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key widerColumn">
          Has been cautioned for a criminal offence
        </dt>
        <dd class="govuk-summary-list__value">
          <InformationReviewSectionRenderer
            :data="characterInformation.criminalCautionDetails"
            :edit="edit"
            :data-default="emptyObject(['details', 'date', 'title'])"
            field="criminalCautionDetails"
            @changeField="changeInfo"
            @removeField="removeInfo"
            @addField="addInfo"
          />
        </dd>
      </div>
    </dl>

    <!-- FixedPenaltiesSummary -->
    <dl class="govuk-summary-list smallerMargin">
      <div class="govuk-summary-list__row">
        <dt :class="requiredStyle">
          Has received a fixed penalty notice in the last 4 years
        </dt>
        <dd class="govuk-summary-list__value">
          <InformationReviewSectionRenderer
            :data="characterInformation.fixedPenaltyDetails"
            :display-month-year-only="false"
            :data-default="emptyObject(['details', 'date', 'title'])"
            :edit="edit"
            field="fixedPenaltyDetails"
            @changeField="changeInfo"
            @removeField="removeInfo"
            @addField="addInfo"
          />
        </dd>
      </div>
    </dl>

    <!-- FinancialMattersSummary -->
    <dl class="govuk-summary-list govuk-!-margin-bottom-0">
      <div class="govuk-summary-list__row">
        <dt :class="requiredStyle">
          Has been disqualified from driving
        </dt>
        <dd class="govuk-summary-list__value">
          <InformationReviewSectionRenderer
            :data="characterInformation.drivingDisqualificationDetails"
            :data-default="emptyObject(['details', 'date', 'title'])"
            :edit="edit"
            field="drivingDisqualificationDetails"
            @changeField="changeInfo"
            @removeField="removeInfo"
            @addField="addInfo"
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
            :data-default="emptyObject(['details', 'date', 'title'])"
            :edit="edit"
            field="recentDrivingConvictionDetails"
            @changeField="changeInfo"
            @removeField="removeInfo"
            @addField="addInfo"
          />
        </dd>
      </div>
    </dl>

    <dl class="govuk-summary-list govuk-!-margin-bottom-0">
      <div class="govuk-summary-list__row">
        <dt :class="requiredStyle">
          Has been declared bankrupt
        </dt>
        <dd class="govuk-summary-list__value">
          <InformationReviewSectionRenderer
            :data="characterInformation.bankruptcyDetails"
            :data-default="emptyObject(['details', 'date', 'title'])"
            :edit="edit"
            field="bankruptcyDetails"
            @changeField="changeInfo"
            @removeField="removeInfo"
            @addField="addInfo"
          />
        </dd>
      </div>
    </dl>

    <dl class="govuk-summary-list govuk-!-margin-bottom-0">
      <div class="govuk-summary-list__row">
        <dt :class="requiredStyle">
          Has entered into an Individual Voluntary Agreement (IVA)
        </dt>
        <dd class="govuk-summary-list__value">
          <InformationReviewSectionRenderer
            :data="characterInformation.ivaDetails"
            :data-default="emptyObject(['details', 'date', 'title'])"
            :edit="edit"
            field="ivaDetails"
            @changeField="changeInfo"
            @removeField="removeInfo"
            @addField="addInfo"
          />
        </dd>
      </div>
    </dl>

    <dl class="govuk-summary-list govuk-!-margin-bottom-0">
      <div class="govuk-summary-list__row">
        <dt :class="requiredStyle">
          Has filed late tax returns
        </dt>
        <dd class="govuk-summary-list__value">
          <InformationReviewSectionRenderer
            :data="characterInformation.lateTaxReturnDetails"
            :data-default="emptyObject(['details', 'date', 'title'])"
            :edit="edit"
            field="lateTaxReturnDetails"
            @changeField="changeInfo"
            @removeField="removeInfo"
            @addField="addInfo"
          />
        </dd>
      </div>
    </dl>

    <dl class="govuk-summary-list govuk-!-margin-bottom-0">
      <div class="govuk-summary-list__row">
        <dt :class="requiredStyle">
          Has filed late VAT returns
        </dt>
        <dd class="govuk-summary-list__value">
          <InformationReviewSectionRenderer
            :data="characterInformation.lateVatReturnDetails"
            :data-default="emptyObject(['details', 'date', 'title'])"
            :edit="edit"
            field="lateVatReturnDetails"
            @changeField="changeInfo"
            @removeField="removeInfo"
            @addField="addInfo"
          />
        </dd>
      </div>
    </dl>

    <dl class="govuk-summary-list govuk-!-margin-bottom-0">
      <div class="govuk-summary-list__row">
        <dt :class="requiredStyle">
          Has ever been fined by HMRC
        </dt>
        <dd class="govuk-summary-list__value">
          <InformationReviewSectionRenderer
            :data="characterInformation.hmrcFineDetails"
            :data-default="emptyObject(['details', 'date', 'title'])"
            field="hmrcFineDetails"
            :edit="edit"
            @changeField="changeInfo"
            @removeField="removeInfo"
            @addField="addInfo"
          />
        </dd>
      </div>
    </dl>
    
    <!-- ProfessionalConductSummary -->
    <dl class="govuk-summary-list govuk-!-margin-bottom-0">
      <div class="govuk-summary-list__row">
        <dt :class="requiredStyle">
          A subject of an allegation or claim of professional misconduct
        </dt>
        <dd class="govuk-summary-list__value">
          <InformationReviewSectionRenderer
            :data="characterInformation.subjectOfAllegationOrClaimOfProfessionalMisconductDetails"
            :data-default="emptyObject(['details','date','investigationConclusionDate','investigations'])"
            :edit="edit"
            field="subjectOfAllegationOrClaimOfProfessionalMisconductDetails"
            @changeField="changeInfo"
            @removeField="removeInfo"
            @addField="addInfo"
          />
        </dd>
      </div>
    </dl>

    <dl class="govuk-summary-list govuk-!-margin-bottom-0">
      <div class="govuk-summary-list__row">
        <dt :class="requiredStyle">
          A subject of an allegation or claim of negligence
        </dt>
        <dd class="govuk-summary-list__value">
          <InformationReviewSectionRenderer
            :data="characterInformation.subjectOfAllegationOrClaimOfNegligenceDetails"
            :data-default="emptyObject(['details','date','investigationConclusionDate','investigations'])"
            :edit="edit"
            field="subjectOfAllegationOrClaimOfNegligenceDetails"
            @changeField="changeInfo"
            @removeField="removeInfo"
            @addField="addInfo"
          />
        </dd>
      </div>
    </dl>

    <dl class="govuk-summary-list govuk-!-margin-bottom-0">
      <div class="govuk-summary-list__row">
        <dt :class="requiredStyle">
          A subject of an allegation or claim of wrongful dismissal
        </dt>
        <dd class="govuk-summary-list__value">
          <InformationReviewSectionRenderer
            :data="characterInformation.subjectOfAllegationOrClaimOfWrongfulDismissalDetails"
            :data-default="emptyObject(['details','date','investigationConclusionDate','investigations'])"
            :edit="edit"
            field="subjectOfAllegationOrClaimOfWrongfulDismissalDetails"
            @changeField="changeInfo"
            @removeField="removeInfo"
            @addField="addInfo"
          />
        </dd>
      </div>
    </dl>

    <dl class="govuk-summary-list govuk-!-margin-bottom-0">
      <div class="govuk-summary-list__row">
        <dt :class="requiredStyle">
          A subject of an allegation or claim of discrimination proceedings
        </dt>
        <dd class="govuk-summary-list__value">
          <InformationReviewSectionRenderer
            :data="characterInformation.subjectOfAllegationOrClaimOfDiscriminationProceedingDetails"
            :data-default="emptyObject(['details','date','investigationConclusionDate','investigations'])"
            :edit="edit"
            field="subjectOfAllegationOrClaimOfDiscriminationProceedingDetails"
            @changeField="changeInfo"
            @removeField="removeInfo"
            @addField="addInfo"
          />
        </dd>
      </div>
    </dl>

    <dl class="govuk-summary-list govuk-!-margin-bottom-0">
      <div class="govuk-summary-list__row">
        <dt :class="requiredStyle">
          A subject of an allegation or claim of harassment proceedings
        </dt>
        <dd class="govuk-summary-list__value">
          <InformationReviewSectionRenderer
            :data="characterInformation.subjectOfAllegationOrClaimOfHarassmentProceedingDetails"
            :data-default="emptyObject(['details','date','investigationConclusionDate','investigations'])"
            :edit="edit"
            field="subjectOfAllegationOrClaimOfHarassmentProceedingDetails"
            @changeField="changeInfo"
            @removeField="removeInfo"
            @addField="addInfo"
          />
        </dd>
      </div>
    </dl>

    <dl class="govuk-summary-list govuk-!-margin-bottom-0">
      <div class="govuk-summary-list__row">
        <dt :class="requiredStyle">
          A subject of complaints or disciplinary action
        </dt>
        <dd class="govuk-summary-list__value">
          <InformationReviewSectionRenderer
            :data="characterInformation.complaintOrDisciplinaryActionDetails"
            :data-default="emptyObject(['details','date','investigationConclusionDate','investigations'])"
            :edit="edit"
            field="complaintOrDisciplinaryActionDetails"
            @changeField="changeInfo"
            @removeField="removeInfo"
            @addField="addInfo"
          />
        </dd>
      </div>
    </dl>

    <dl class="govuk-summary-list govuk-!-margin-bottom-0">
      <div class="govuk-summary-list__row">
        <dt :class="requiredStyle">
          Has been asked to resign from a position
        </dt>
        <dd class="govuk-summary-list__value">
          <InformationReviewSectionRenderer
            :data="characterInformation.requestedToResignDetails"
            :data-default="emptyObject(['details', 'date' ])"
            :edit="edit"
            field="requestedToResignDetails"
            @changeField="changeInfo"
            @removeField="removeInfo"
            @addField="addInfo"
          />
        </dd>
      </div>
    </dl>

    <!-- FurtherInformationSummary -->
    <dl class="govuk-summary-list govuk-!-margin-bottom-0">
      <div class="govuk-summary-list__row">
        <dt :class="requiredStyle">
          Has any other character issues
        </dt>
        <dd class="govuk-summary-list__value">
          <InformationReviewSectionRenderer
            :data="characterInformation.furtherInformationDetails"
            :data-default="emptyObject(['details', 'date'])"
            :edit="edit"
            field="furtherInformationDetails"
            @changeField="changeInfo"
            @removeField="removeInfo"
            @addField="addInfo"
          />
        </dd>
      </div>
    </dl>

    <dl class="govuk-summary-list govuk-!-margin-bottom-0">
      <div class="govuk-summary-list__row">
        <dt :class="requiredStyle">
          Signed character information declaration
        </dt>
        <dd class="govuk-summary-list__value">
          {{ signedDeclaration | toYesNo }}
        </dd>
      </div>
    </dl>
  </div>
</template>

<script>
// import InformationReviewRenderer from '@/components/Page/InformationReviewRenderer';
import InformationReviewSectionRenderer from '@/components/Page/InformationReviewSectionRenderer';

export default {
  name: 'CharacterInformationV2Summary',
  components: {
    // InformationReviewRenderer,
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
    signedDeclaration() {
      if (this.characterInformation.declaration1 === true &&
        this.characterInformation.declaration2 === true &&
        this.characterInformation.declaration3 === true) {
        return true;
      }
      return false;
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
      if (items.some(item => item === 'investigationConclusionDate')) {
        obj.investigationConclusionDate = new Date();
      }
      if (items.some(item => item === 'investigations')) {
        obj.investigations = '';
      }
      if (items.some(item => item === 'details')) {
        obj.details = '';
      }
      return obj;
    },
    changeInfo(obj) {
      let changedObj = this.characterInformation[obj.field] || {};

      changedObj[obj.index][obj.extension] = obj.change;

      changedObj = { [obj.field]: changedObj };

      this.$emit('changeInfo', changedObj);

    },
    addInfo(obj) {
      let changedObj = this.characterInformation[obj.field] || {};
      
      if (changedObj.length > 0){
        changedObj = [...changedObj, obj.change];
      } else {
        changedObj = [obj.change];
      }

      changedObj = { [obj.field]: changedObj };

      this.$emit('changeInfo', changedObj);
    },
    removeInfo(obj) {
      let changedObj = this.characterInformation[obj.field] || {};

      if (changedObj.length > 0){
        changedObj.splice(obj.index, 1);
      } else {
        changedObj = [];
      } 

      changedObj = { [obj.field]: changedObj };

      this.$emit('changeInfo', changedObj);

    },
    changeCharacterFlag(obj) {
      this.$emit('changeInfo', obj);
    },
  },
};
</script>

<style scoped>
  .widerColumn {
    width: 70%;
  }
</style>
