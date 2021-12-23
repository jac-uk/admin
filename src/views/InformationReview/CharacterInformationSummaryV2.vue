<template>
  <div>
    <!-- CriminalOffencesSummary -->
    <dl class="govuk-summary-list govuk-!-margin-bottom-0">
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key widerColumn">
          Has been convicted for a criminal offence
        </dt>
        <dd
          class="govuk-summary-list__value"
        >
          <InformationReviewRenderer
            :data="formData.criminalConvictions"
            :edit="edit"
            :options="[true, false]"
            type="selection"
            field="criminalConvictions"
            @changeField="changeCharacterFlag"
          />

          <hr>
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

    <!-- CriminalCautionsSummary -->
    <dl class="govuk-summary-list govuk-!-margin-bottom-0">
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key widerColumn">
          Has been cautioned for a criminal offence
        </dt>

        <dd
          class="govuk-summary-list__value"
        >
          <InformationReviewRenderer
            :data="formData.criminalCautions"
            :edit="edit"
            :options="[true, false]"
            type="selection"
            field="criminalCautions"
            @changeField="changeCharacterFlag"
          />
          <hr>
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
    <dl class="govuk-summary-list govuk-!-margin-bottom-0">
      <div class="govuk-summary-list__row">
        <dt :class="requiredStyle">
          Has received a fixed penalty notice in the last 4 years
        </dt>
        <dd
          class="govuk-summary-list__value"
        >
          <InformationReviewRenderer
            :data="formData.fixedPenalties"
            :edit="edit"
            :options="[true, false]"
            type="selection"
            field="fixedPenalties"
            @changeField="changeCharacterFlag"
          />
          <hr>
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

    <!-- DrivingDisqualificationDetails -->
    <dl class="govuk-summary-list govuk-!-margin-bottom-0">
      <div class="govuk-summary-list__row">
        <dt :class="requiredStyle">
          Has been disqualified from driving
        </dt>
        <dd
          class="govuk-summary-list__value"
        >
          <InformationReviewRenderer
            :data="formData.drivingDisqualifications || !formData.drivingDisqualificationDetails"
            :edit="edit"
            :options="[true, false]"
            type="selection"
            field="drivingDisqualifications"
            @changeField="changeCharacterFlag"
          />
          <hr>
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

    <!-- RecentDrivingConvictionDetails -->
    <dl class="govuk-summary-list govuk-!-margin-bottom-0">
      <div class="govuk-summary-list__row">
        <dt :class="requiredStyle">
          Was convicted of any motoring offences in the past 4 years
        </dt>
        <dd
          class="govuk-summary-list__value"
        >
          <InformationReviewRenderer
            :data="formData.recentDrivingConvictions"
            :edit="edit"
            :options="[true, false]"
            type="selection"
            field="recentDrivingConvictions"
            @changeField="changeCharacterFlag"
          />
          <hr>
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

    <!-- bankruptcyDetails -->
    <dl class="govuk-summary-list govuk-!-margin-bottom-0">
      <div class="govuk-summary-list__row">
        <dt :class="requiredStyle">
          Has been declared bankrupt
        </dt>
        <dd
          class="govuk-summary-list__value"
        >
          <InformationReviewRenderer
            :data="formData.bankruptcies"
            :edit="edit"
            :options="[true, false]"
            type="selection"
            field="bankruptcies"
            @changeField="changeCharacterFlag"
          />
          <hr>
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

    <!-- ivas -->
    <dl class="govuk-summary-list govuk-!-margin-bottom-0">
      <div class="govuk-summary-list__row">
        <dt :class="requiredStyle">
          Has entered into an Individual Voluntary Agreement (IVA)
        </dt>
        <dd
          class="govuk-summary-list__value"
        >
          <InformationReviewRenderer
            :data="formData.ivas"
            :edit="edit"
            :options="[true, false]"
            type="selection"
            field="ivas"
            @changeField="changeCharacterFlag"
          />
          <hr>
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

    <!-- LateTaxReturnSummary -->
    <dl class="govuk-summary-list govuk-!-margin-bottom-0">
      <div class="govuk-summary-list__row">
        <dt :class="requiredStyle">
          Has filed late tax returns
        </dt>
        <dd
          class="govuk-summary-list__value"
        >
          <InformationReviewRenderer
            :data="formData.lateTaxReturns"
            :edit="edit"
            :options="[true, false]"
            type="selection"
            field="lateTaxReturns"
            @changeField="changeCharacterFlag"
          />
          <hr>
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

    <!-- LateVatReturnSummary -->
    <dl class="govuk-summary-list govuk-!-margin-bottom-0">
      <div class="govuk-summary-list__row">
        <dt :class="requiredStyle">
          Has filed late VAT returns
        </dt>
        <dd
          class="govuk-summary-list__value"
        >
          <InformationReviewRenderer
            :data="formData.lateVatReturns"
            :edit="edit"
            :options="[true, false]"
            type="selection"
            field="lateVatReturns"
            @changeField="changeCharacterFlag"
          />
          <hr>
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

    <!-- hmrcFineDetails -->
    <dl class="govuk-summary-list govuk-!-margin-bottom-0">
      <div class="govuk-summary-list__row">
        <dt :class="requiredStyle">
          Has ever been fined by HMRC
        </dt>
        <dd
          class="govuk-summary-list__value"
        >
          <InformationReviewRenderer
            :data="formData.hmrcFines"
            :edit="edit"
            :options="[true, false]"
            type="selection"
            field="hmrcFines"
            @changeField="changeCharacterFlag"
          />
          <hr>
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
        <dd
          class="govuk-summary-list__value"
        >
          <InformationReviewRenderer
            :data="formData.subjectOfAllegationOrClaimOfProfessionalMisconduct"
            :edit="edit"
            :options="[true, false]"
            type="selection"
            field="subjectOfAllegationOrClaimOfProfessionalMisconduct"
            @changeField="changeCharacterFlag"
          />
          <hr>
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

    <!--SubjectOfAllegationOrClaimOfNegligenceSummary-->
    <dl class="govuk-summary-list govuk-!-margin-bottom-0">
      <div class="govuk-summary-list__row">
        <dt :class="requiredStyle">
          A subject of an allegation or claim of negligence
        </dt>
        <dd
          class="govuk-summary-list__value"
        >
          <InformationReviewRenderer
            :data="formData.subjectOfAllegationOrClaimOfNegligence"
            :edit="edit"
            :options="[true, false]"
            type="selection"
            field="subjectOfAllegationOrClaimOfNegligence"
            @changeField="changeCharacterFlag"
          />
          <hr>
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

    <!-- SubjectOfAllegationOrClaimOfWrongfulDismissalDetails -->
    <dl class="govuk-summary-list govuk-!-margin-bottom-0">
      <div class="govuk-summary-list__row">
        <dt :class="requiredStyle">
          A subject of an allegation or claim of wrongful dismissal
        </dt>
        <dd
          class="govuk-summary-list__value"
        >
          <InformationReviewRenderer
            :data="formData.subjectOfAllegationOrClaimOfWrongfulDismissal"
            :edit="edit"
            :options="[true, false]"
            type="selection"
            field="subjectOfAllegationOrClaimOfWrongfulDismissal"
            @changeField="changeCharacterFlag"
          />
          <hr>
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
    
    <!-- subjectOfAllegationOrClaimOfDiscriminationProceedingDetails -->
    <dl class="govuk-summary-list govuk-!-margin-bottom-0">
      <div class="govuk-summary-list__row">
        <dt :class="requiredStyle">
          A subject of an allegation or claim of discrimination proceedings
        </dt>
        <dd
          class="govuk-summary-list__value"
        >
          <InformationReviewRenderer
            :data="formData.subjectOfAllegationOrClaimOfDiscriminationProceeding"
            :edit="edit"
            :options="[true, false]"
            type="selection"
            field="subjectOfAllegationOrClaimOfDiscriminationProceeding"
            @changeField="changeCharacterFlag"
          />
          <hr>
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

    <!-- subjectOfAllegationOrClaimOfHarassmentProceedingDetails -->
    <dl class="govuk-summary-list govuk-!-margin-bottom-0">
      <div class="govuk-summary-list__row">
        <dt :class="requiredStyle">
          A subject of an allegation or claim of harassment proceedings
        </dt>
        <dd
          class="govuk-summary-list__value"
        >
          <InformationReviewRenderer
            :data="formData.subjectOfAllegationOrClaimOfHarassmentProceeding"
            :edit="edit"
            :options="[true, false]"
            type="selection"
            field="subjectOfAllegationOrClaimOfHarassmentProceeding"
            @changeField="changeCharacterFlag"
          />
          <hr>
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

    <!-- complaintOrDisciplinaryActionDetails -->
    <dl class="govuk-summary-list govuk-!-margin-bottom-0">
      <div class="govuk-summary-list__row">
        <dt :class="requiredStyle">
          A subject of complaints or disciplinary action
        </dt>
        <dd
          class="govuk-summary-list__value"
        >
          <InformationReviewRenderer
            :data="formData.complaintOrDisciplinaryAction"
            :edit="edit"
            :options="[true, false]"
            type="selection"
            field="complaintOrDisciplinaryAction"
            @changeField="changeCharacterFlag"
          />
          <hr>
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

    <!-- requestedToResignDetails -->
    <dl class="govuk-summary-list govuk-!-margin-bottom-0">
      <div class="govuk-summary-list__row">
        <dt :class="requiredStyle">
          Has been asked to resign from a position
        </dt>
        <dd
          class="govuk-summary-list__value"
        >
          <InformationReviewRenderer
            :data="formData.requestedToResign"
            :edit="edit"
            :options="[true, false]"
            type="selection"
            field="requestedToResign"
            @changeField="changeCharacterFlag"
          />
          <hr>
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
        <dd
          class="govuk-summary-list__value"
        >
          <InformationReviewRenderer
            :data="formData.furtherInformationDetails"
            :edit="edit"
            :options="[true, false]"
            type="selection"
            field="furtherInformationDetails"
            @changeField="changeCharacterFlag"
          />
          <hr>
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

    <!-- DeclarationsSummary -->
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
import InformationReviewRenderer from '@/components/Page/InformationReviewRenderer';
import CharacterSummary from '@/views/InformationReview/CharacterSummary';

export default {
  name: 'CharacterInformationSummaryV2',
  components: {
    InformationReviewRenderer,
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
