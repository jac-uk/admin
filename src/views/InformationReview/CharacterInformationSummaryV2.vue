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
            :data="formData.criminalConvictionDetails"
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
            :data="formData.criminalCautionDetails"
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
            :data="formData.fixedPenaltyDetails"
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
            :data="formData.drivingDisqualificationDetails"
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
            :data="formData.recentDrivingConvictionDetails"
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
            :data="formData.bankruptcyDetails"
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
            :data="formData.ivaDetails"
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
            :data="formData.lateTaxReturnDetails"
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
            :data="formData.lateVatReturnDetails"
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
            :data="formData.hmrcFineDetails"
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
            :data="formData.subjectOfAllegationOrClaimOfProfessionalMisconductDetails"
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
            :data="formData.subjectOfAllegationOrClaimOfNegligenceDetails"
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
            :data="formData.subjectOfAllegationOrClaimOfWrongfulDismissalDetails"
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
            :data="formData.subjectOfAllegationOrClaimOfDiscriminationProceedingDetails"
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
            :data="formData.subjectOfAllegationOrClaimOfHarassmentProceedingDetails"
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
            :data="formData.complaintOrDisciplinaryActionDetails"
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
            :data="formData.requestedToResignDetails"
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
            :data="formData.furtherInformationDetails"
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
import InformationReviewSectionRenderer from '@/components/Page/InformationReviewSectionRenderer';
import CharacterSummary from '@/views/InformationReview/CharacterSummary';

export default {
  name: 'CharacterInformationSummaryV2',
  components: {
    InformationReviewSectionRenderer,
  },
  extends: CharacterSummary,
  computed: {
    signedDeclaration() {
      if (this.formData.declaration1 === true &&
        this.formData.declaration2 === true &&
        this.formData.declaration3 === true) {
        return true;
      }
      return false;
    },
  },
};
</script>

<style scoped>
  .widerColumn {
    width: 70%;
  }
</style>
