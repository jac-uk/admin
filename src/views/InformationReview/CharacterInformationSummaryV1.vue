<template>
  <dl
    v-if="formData && Object.keys(formData).length || edit"
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
          :edit="edit"
          :data="formData.criminalOffences"
          :options="[true, false]"
          type="selection"
          field="criminalOffences"
          @changeField="changeCharacterFlag"
        />
        <hr>
        <InformationReviewSectionRenderer
          :data="formData.criminalOffenceDetails"
          :data-default="emptyObject(['details', 'date', 'title'])"
          :edit="edit"
          field="criminalOffenceDetails"
          @changeField="changeInfo"
          @removeField="removeInfo"
          @addField="addInfo"
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
          :data="formData.nonMotoringFixedPenaltyNotices"
          :options="[true, false]"
          :edit="edit"
          type="selection"
          field="nonMotoringFixedPenaltyNotices"
          @changeField="changeCharacterFlag"
        />
        <hr>
        <InformationReviewSectionRenderer
          :data="formData.nonMotoringFixedPenaltyNoticesDetails"
          :data-default="emptyObject(['details', 'date', 'title'])"
          :edit="edit"
          field="nonMotoringFixedPenaltyNoticesDetails"
          @changeField="changeInfo"
          @removeField="removeInfo"
          @addField="addInfo"
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
          :data="formData.drivingDisqualificationDrinkDrugs"
          :options="[true, false]"
          :edit="edit"
          type="selection"
          field="drivingDisqualificationDrinkDrugs"
          @changeField="changeCharacterFlag"
        />
        <hr>
        <InformationReviewSectionRenderer
          :data="formData.drivingDisqualificationDrinkDrugsDetails"
          :data-default="emptyObject(['details', 'date', 'title'])"
          :edit="edit"
          field="drivingDisqualificationDrinkDrugsDetails"
          @changeField="changeInfo"
          @removeField="removeInfo"
          @addField="addInfo"
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
          :data="formData.endorsementsOrMotoringFixedPenalties"
          :options="[true, false]"
          :edit="edit"
          type="selection"
          field="endorsementsOrMotoringFixedPenalties"
          @changeField="changeCharacterFlag"
        />
        <hr>
        <InformationReviewSectionRenderer
          :edit="edit"
          :data="formData.endorsementsOrMotoringFixedPenaltiesDetails"
          :data-default="emptyObject(['details', 'date', 'title'])"
          field="endorsementsOrMotoringFixedPenaltiesDetails"
          @changeField="changeInfo"
          @removeField="removeInfo"
          @addField="addInfo"
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
          :data="formData.declaredBankruptOrIVA"
          :options="[true, false]"
          :edit="edit"
          type="selection"
          field="declaredBankruptOrIVA"
          @changeField="changeCharacterFlag"
        />
        <hr>
        <InformationReviewSectionRenderer
          :edit="edit"
          :data="formData.declaredBankruptOrIVADetails"
          :data-default="emptyObject(['details', 'date', 'title'])"
          field="declaredBankruptOrIVADetails"
          @changeField="changeInfo"
          @removeField="removeInfo"
          @addField="addInfo"
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
          :edit="edit"
          :data="formData.lateTaxReturnOrFined"
          field="lateTaxReturnOrFined"
          :options="[true, false]"
          type="selection"
          @changeField="changeCharacterFlag"
        />

        <hr>
        <InformationReviewSectionRenderer
          :edit="edit"
          :data="formData.lateTaxReturnOrFinedDetails"
          :data-default="emptyObject(['details', 'date', 'title'])"
          field="lateTaxReturnOrFinedDetails"
          @changeField="changeInfo"
          @removeField="removeInfo"
          @addField="addInfo"
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
          :data="formData.involvedInProfessionalMisconduct"
          :options="[true, false]"
          :edit="edit"
          type="selection"
          field="involvedInProfessionalMisconduct"
          @changeField="changeCharacterFlag"
        />
        <hr>
        <InformationReviewSectionRenderer
          :data="formData.involvedInProfessionalMisconductDetails"
          :edit="edit"
          :data-default="emptyObject(['details', 'date', 'title'])"
          field="involvedInProfessionalMisconductDetails"
          @changeField="changeInfo"
          @removeField="removeInfo"
          @addField="addInfo"
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
          :data="formData.diciplinaryActionOrAskedToResign"
          :options="[true, false]"
          :edit="edit"
          type="selection"
          field="diciplinaryActionOrAskedToResign"
          @changeField="changeCharacterFlag"
        />
        <hr>
        <InformationReviewSectionRenderer
          :data="formData.diciplinaryActionOrAskedToResignDetails"
          :data-default="emptyObject(['details', 'date', 'title'])"
          :edit="edit"
          field="diciplinaryActionOrAskedToResignDetails"
          @changeField="changeInfo"
          @removeField="removeInfo"
          @addField="addInfo"
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
          :data="formData.otherCharacterIssues"
          :options="[true, false]"
          :edit="edit"
          type="selection"
          field="otherCharacterIssues"
          @changeField="changeCharacterFlag"
        />
        <hr>
        <InformationReviewSectionRenderer
          :data="formData.otherCharacterIssuesDetails"
          :edit="edit"
          :data-default="emptyObject(['details', 'date', 'title'])"
          field="otherCharacterIssuesDetails"
          @changeField="changeInfo"
          @removeField="removeInfo"
          @addField="addInfo"
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
import CharacterSummary from '@/views/InformationReview/CharacterSummary';

export default {
  name: 'CharacterInformationSummaryV1',
  components: {
    InformationReviewRenderer,
    InformationReviewSectionRenderer,
  },
  extends: CharacterSummary,
};
</script>

<style scoped>
  .widerColumn {
    width: 70%;
  }
</style>
