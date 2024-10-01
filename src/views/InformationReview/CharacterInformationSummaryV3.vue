<template>
  <div>
    <!-- CriminalOffencesSummary -->
    <dl class="govuk-summary-list govuk-!-margin-bottom-0">
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key widerColumn">
          Has been convicted of a criminal offence <br>This includes spent convictions, even if they are protected
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
            :is-asked="isAsked"
            @change-field="changeCharacterFlag"
          />

          <div v-if="formData.criminalConvictions">
            <hr>
            <InformationReviewSectionRenderer
              :data="formData.criminalConvictionDetails"
              :data-default="emptyObject(['details', 'date', 'title'])"
              :edit="edit"
              field="criminalConvictionDetails"
              :is-asked="isAsked"
              @change-field="changeInfo"
              @remove-field="removeInfo"
              @add-field="addInfo"
            />
          </div>
        </dd>
      </div>
    </dl>

    <!-- CriminalCautionsSummary -->
    <dl class="govuk-summary-list govuk-!-margin-bottom-0">
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key widerColumn">
          Has been cautioned for a criminal offence
          <br> This includes cautions that are spent, even if they are protected
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
            :is-asked="isAsked"
            @change-field="changeCharacterFlag"
          />
          <div v-if="formData.criminalCautions">
            <hr>
            <InformationReviewSectionRenderer
              :data="formData.criminalCautionDetails"
              :edit="edit"
              :data-default="emptyObject(['details', 'date', 'title'])"
              field="criminalCautionDetails"
              :is-asked="isAsked"
              @change-field="changeInfo"
              @remove-field="removeInfo"
              @add-field="addInfo"
            />
          </div>
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
            :is-asked="isAsked"
            @change-field="changeCharacterFlag"
          />
          <div v-if="formData.fixedPenalties">
            <hr>
            <InformationReviewSectionRenderer
              :data="formData.fixedPenaltyDetails"
              :display-month-year-only="false"
              :data-default="emptyObject(['details', 'date', 'title'])"
              :edit="edit"
              field="fixedPenaltyDetails"
              :is-asked="isAsked"
              @change-field="changeInfo"
              @remove-field="removeInfo"
              @add-field="addInfo"
            />
          </div>
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
            :data="formData.drivingDisqualifications"
            :edit="edit"
            :options="[true, false]"
            type="selection"
            field="drivingDisqualifications"
            :is-asked="isAsked"
            @change-field="changeCharacterFlag"
          />
          <div v-if="formData.drivingDisqualifications">
            <hr>
            <InformationReviewSectionRenderer
              :data="formData.drivingDisqualificationDetails"
              :data-default="emptyObject(['details', 'date' ,'title'])"
              :edit="edit"
              field="drivingDisqualificationDetails"
              :is-asked="isAsked"
              @change-field="changeInfo"
              @remove-field="removeInfo"
              @add-field="addInfo"
            />
          </div>
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
            :is-asked="isAsked"
            @change-field="changeCharacterFlag"
          />
          <div v-if="formData.recentDrivingConvictions">
            <hr>
            <InformationReviewSectionRenderer
              :data="formData.recentDrivingConvictionDetails"
              :data-default="emptyObject(['details', 'date', 'title'])"
              :edit="edit"
              field="recentDrivingConvictionDetails"
              :is-asked="isAsked"
              @change-field="changeInfo"
              @remove-field="removeInfo"
              @add-field="addInfo"
            />
          </div>
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
            :is-asked="isAsked"
            @change-field="changeCharacterFlag"
          />
          <div v-if="formData.bankruptcies">
            <hr>
            <InformationReviewSectionRenderer
              :data="formData.bankruptcyDetails"
              :data-default="emptyObject(['details', 'date', 'title'])"
              :edit="edit"
              field="bankruptcyDetails"
              :is-asked="isAsked"
              @change-field="changeInfo"
              @remove-field="removeInfo"
              @add-field="addInfo"
            />
          </div>
        </dd>
      </div>
    </dl>

    <!-- ivas -->
    <dl class="govuk-summary-list govuk-!-margin-bottom-0">
      <div class="govuk-summary-list__row">
        <dt :class="requiredStyle">
          Has entered into an Individual Voluntary Agreement (IVA)
          <br>or other similar arrangement
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
            :is-asked="isAsked"
            @change-field="changeCharacterFlag"
          />
          <div v-if="formData.ivas">
            <hr>
            <InformationReviewSectionRenderer
              :data="formData.ivaDetails"
              :data-default="emptyObject(['details', 'date', 'title'])"
              :edit="edit"
              field="ivaDetails"
              :is-asked="isAsked"
              @change-field="changeInfo"
              @remove-field="removeInfo"
              @add-field="addInfo"
            />
          </div>
        </dd>
      </div>
    </dl>

    <!-- LateTaxReturnSummary -->
    <dl class="govuk-summary-list govuk-!-margin-bottom-0">
      <div class="govuk-summary-list__row">
        <dt :class="requiredStyle">
          Has filed late tax returns and/or made late tax payments
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
            :is-asked="isAsked"
            @change-field="changeCharacterFlag"
          />
          <div v-if="formData.lateTaxReturns">
            <hr>
            <InformationReviewSectionRenderer
              :data="formData.lateTaxReturnDetails"
              :data-default="emptyObject(['details', 'date', 'title'])"
              :edit="edit"
              field="lateTaxReturnDetails"
              :is-asked="isAsked"
              @change-field="changeInfo"
              @remove-field="removeInfo"
              @add-field="addInfo"
            />
          </div>
        </dd>
      </div>
    </dl>

    <!-- LateVatReturnSummary -->
    <dl class="govuk-summary-list govuk-!-margin-bottom-0">
      <div class="govuk-summary-list__row">
        <dt :class="requiredStyle">
          Has filed late VAT returns and/or made late VAT payments
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
            :is-asked="isAsked"
            @change-field="changeCharacterFlag"
          />
          <div v-if="formData.lateVatReturns">
            <hr>
            <InformationReviewSectionRenderer
              :data="formData.lateVatReturnDetails"
              :data-default="emptyObject(['details', 'date', 'title'])"
              :edit="edit"
              field="lateVatReturnDetails"
              :is-asked="isAsked"
              @change-field="changeInfo"
              @remove-field="removeInfo"
              @add-field="addInfo"
            />
          </div>
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
            :is-asked="isAsked"
            @change-field="changeCharacterFlag"
          />
          <div v-if="formData.hmrcFines">
            <hr>
            <InformationReviewSectionRenderer
              :data="formData.hmrcFineDetails"
              :data-default="emptyObject(['details', 'date', 'title'])"
              field="hmrcFineDetails"
              :edit="edit"
              :is-asked="isAsked"
              @change-field="changeInfo"
              @remove-field="removeInfo"
              @add-field="addInfo"
            />
          </div>
        </dd>
      </div>
    </dl>

    <!-- hmrcTaxEnquiriesDetails -->
    <dl class="govuk-summary-list govuk-!-margin-bottom-0">
      <div class="govuk-summary-list__row">
        <dt :class="requiredStyle">
          Has HMRC enquiries into tax affairs
        </dt>
        <dd
          class="govuk-summary-list__value"
        >
          <InformationReviewRenderer
            :data="formData.hmrcTax"
            :edit="edit"
            :options="[true, false]"
            type="selection"
            field="hmrcTax"
            :is-asked="isAsked"
            @change-field="changeCharacterFlag"
          />
          <div v-if="formData.hmrcTax">
            <hr>
            <InformationReviewSectionRenderer
              :data="formData.hmrcTaxDetails"
              :data-default="emptyObject(['details', 'date', 'title'])"
              field="hmrcTaxDetails"
              :edit="edit"
              :is-asked="isAsked"
              @change-field="changeInfo"
              @remove-field="removeInfo"
              @add-field="addInfo"
            />
          </div>
        </dd>
      </div>
    </dl>

    <!-- ProfessionalConductSummary -->
    <dl class="govuk-summary-list govuk-!-margin-bottom-0">
      <div class="govuk-summary-list__row">
        <dt :class="requiredStyle">
          The subject of a complaint or an allegation of professional misconduct
          <br>(Not including complaints that were dismissed in full)
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
            :is-asked="isAsked"
            @change-field="changeCharacterFlag"
          />
          <div v-if="formData.subjectOfAllegationOrClaimOfProfessionalMisconduct">
            <hr>
            <InformationReviewSectionRenderer
              :data="formData.subjectOfAllegationOrClaimOfProfessionalMisconductDetails"
              :data-default="emptyObject(['details','date','investigationConclusionDate','investigations'])"
              :edit="edit"
              field="subjectOfAllegationOrClaimOfProfessionalMisconductDetails"
              :is-asked="isAsked"
              @change-field="changeInfo"
              @remove-field="removeInfo"
              @add-field="addInfo"
            />
          </div>
        </dd>
      </div>
    </dl>

    <!--SubjectOfAllegationOrClaimOfNegligenceSummary-->
    <dl class="govuk-summary-list govuk-!-margin-bottom-0">
      <div class="govuk-summary-list__row">
        <dt :class="requiredStyle">
          The subject of an allegation or claim of professional negligence
          <br>(Not including claims that were dismissed or withdrawn without a settlement)
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
            :is-asked="isAsked"
            @change-field="changeCharacterFlag"
          />
          <div v-if="formData.subjectOfAllegationOrClaimOfNegligence">
            <hr>
            <InformationReviewSectionRenderer
              :data="formData.subjectOfAllegationOrClaimOfNegligenceDetails"
              :data-default="emptyObject(['details','date','investigationConclusionDate','investigations'])"
              :edit="edit"
              field="subjectOfAllegationOrClaimOfNegligenceDetails"
              :is-asked="isAsked"
              :customised-lookup="{
                investigations: 'Claim Ongoing',
                investigationConclusionDate: 'Claim Conclusion Date'
              }"
              @change-field="changeInfo"
              @remove-field="removeInfo"
              @add-field="addInfo"
            />
          </div>
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
            :is-asked="isAsked"
            @change-field="changeCharacterFlag"
          />
          <div v-if="formData.subjectOfAllegationOrClaimOfWrongfulDismissal">
            <hr>
            <InformationReviewSectionRenderer
              :data="formData.subjectOfAllegationOrClaimOfWrongfulDismissalDetails"
              :data-default="emptyObject(['details','date','investigationConclusionDate','investigations'])"
              :edit="edit"
              field="subjectOfAllegationOrClaimOfWrongfulDismissalDetails"
              :is-asked="isAsked"
              @change-field="changeInfo"
              @remove-field="removeInfo"
              @add-field="addInfo"
            />
          </div>
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
            :is-asked="isAsked"
            @change-field="changeCharacterFlag"
          />
          <div v-if="formData.subjectOfAllegationOrClaimOfDiscriminationProceeding">
            <hr>
            <InformationReviewSectionRenderer
              :data="formData.subjectOfAllegationOrClaimOfDiscriminationProceedingDetails"
              :data-default="emptyObject(['details','date','investigationConclusionDate','investigations'])"
              :edit="edit"
              field="subjectOfAllegationOrClaimOfDiscriminationProceedingDetails"
              :is-asked="isAsked"
              @change-field="changeInfo"
              @remove-field="removeInfo"
              @add-field="addInfo"
            />
          </div>
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
            :is-asked="isAsked"
            @change-field="changeCharacterFlag"
          />
          <div v-if="formData.subjectOfAllegationOrClaimOfHarassmentProceeding">
            <hr>
            <InformationReviewSectionRenderer
              :data="formData.subjectOfAllegationOrClaimOfHarassmentProceedingDetails"
              :data-default="emptyObject(['details','date','investigationConclusionDate','investigations'])"
              :edit="edit"
              field="subjectOfAllegationOrClaimOfHarassmentProceedingDetails"
              :is-asked="isAsked"
              @change-field="changeInfo"
              @remove-field="removeInfo"
              @add-field="addInfo"
            />
          </div>
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
            :is-asked="isAsked"
            @change-field="changeCharacterFlag"
          />
          <div v-if="formData.complaintOrDisciplinaryAction">
            <hr>
            <InformationReviewSectionRenderer
              :data="formData.complaintOrDisciplinaryActionDetails"
              :data-default="emptyObject(['details','date','investigationConclusionDate','investigations'])"
              :edit="edit"
              field="complaintOrDisciplinaryActionDetails"
              :is-asked="isAsked"
              @change-field="changeInfo"
              @remove-field="removeInfo"
              @add-field="addInfo"
            />
          </div>
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
            :is-asked="isAsked"
            @change-field="changeCharacterFlag"
          />
          <div v-if="formData.requestedToResign">
            <hr>
            <InformationReviewSectionRenderer
              :data="formData.requestedToResignDetails"
              :data-default="emptyObject(['details', 'date' ])"
              :edit="edit"
              field="requestedToResignDetails"
              :is-asked="isAsked"
              @change-field="changeInfo"
              @remove-field="removeInfo"
              @add-field="addInfo"
            />
          </div>
        </dd>
      </div>
    </dl>

    <!-- CivilProceedingDetails -->
    <dl class="govuk-summary-list govuk-!-margin-bottom-0">
      <div class="govuk-summary-list__row">
        <dt :class="requiredStyle">
          A subject of civil proceedings
          <br>(Not including proceedings that were dismissed or withdrawn without a settlement)
        </dt>
        <dd
          class="govuk-summary-list__value"
        >
          <InformationReviewRenderer
            :data="formData.civilProceedings"
            :edit="edit"
            :options="[true, false]"
            type="selection"
            field="civilProceedings"
            :is-asked="isAsked"
            @change-field="changeCharacterFlag"
          />
          <div v-if="formData.civilProceedings">
            <hr>
            <InformationReviewSectionRenderer
              :data="formData.civilProceedingsDetails"
              :data-default="emptyObject(['details','date'])"
              :edit="edit"
              field="civilProceedingsDetails"
              :is-asked="isAsked"
              @change-field="changeInfo"
              @remove-field="removeInfo"
              @add-field="addInfo"
            />
          </div>
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
            :data="formData.furtherInformation"
            :edit="edit"
            :options="[true, false]"
            type="selection"
            field="furtherInformation"
            :is-asked="isAsked"
            @change-field="changeCharacterFlag"
          />
          <div v-if="formData.furtherInformation">
            <hr>
            <InformationReviewSectionRenderer
              :data="formData.furtherInformationDetails"
              :data-default="emptyObject(['details', 'date'])"
              :edit="edit"
              field="furtherInformationDetails"
              :is-asked="isAsked"
              @change-field="changeInfo"
              @remove-field="removeInfo"
              @add-field="addInfo"
            />
          </div>
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
          {{ $filters.toYesNo(signedDeclaration) }}
        </dd>
      </div>
    </dl>
  </div>
</template>

<script>
import InformationReviewSectionRenderer from '@/components/Page/InformationReviewSectionRenderer.vue';
import InformationReviewRenderer from '@/components/Page/InformationReviewRenderer.vue';
import CharacterSummary from '@/views/InformationReview/CharacterSummary.vue';

export default {
  name: 'CharacterInformationSummaryV3',
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
