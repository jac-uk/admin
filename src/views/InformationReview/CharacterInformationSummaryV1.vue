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
          :is-asked="isAsked"
          @change-field="changeCharacterFlag"
        />
        <div
          v-if="formData.criminalOffences === true"
        >
          <hr>
          <InformationReviewSectionRenderer
            :data="formData.criminalOffenceDetails"
            :data-default="emptyObject(['details', 'date', 'title'])"
            :edit="edit"
            field="criminalOffenceDetails"
            :is-asked="isAsked"
            @change-field="changeInfo"
            @remove-field="removeInfo"
            @add-field="addInfo"
          />
        </div>
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
          :is-asked="isAsked"
          @change-field="changeCharacterFlag"
        />
        <div
          v-if="formData.nonMotoringFixedPenaltyNotices === true"
        >
          <hr>
          <InformationReviewSectionRenderer
            :data="formData.nonMotoringFixedPenaltyNoticesDetails"
            :data-default="emptyObject(['details', 'date', 'title'])"
            :edit="edit"
            field="nonMotoringFixedPenaltyNoticesDetails"
            :is-asked="isAsked"
            @change-field="changeInfo"
            @remove-field="removeInfo"
            @add-field="addInfo"
          />
        </div>
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
          :is-asked="isAsked"
          @change-field="changeCharacterFlag"
        />
        <div
          v-if="formData.drivingDisqualificationDrinkDrugs === true"
        >
          <hr>
          <InformationReviewSectionRenderer
            :data="formData.drivingDisqualificationDrinkDrugsDetails"
            :data-default="emptyObject(['details', 'date', 'title'])"
            :edit="edit"
            field="drivingDisqualificationDrinkDrugsDetails"
            :is-asked="isAsked"
            @change-field="changeInfo"
            @remove-field="removeInfo"
            @add-field="addInfo"
          />
        </div>
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
          :is-asked="isAsked"
          @change-field="changeCharacterFlag"
        />
        <div
          v-if="formData.endorsementsOrMotoringFixedPenalties === true"
        >
          <hr>
          <InformationReviewSectionRenderer
            :edit="edit"
            :data="formData.endorsementsOrMotoringFixedPenaltiesDetails"
            :data-default="emptyObject(['details', 'date', 'title'])"
            field="endorsementsOrMotoringFixedPenaltiesDetails"
            :is-asked="isAsked"
            @change-field="changeInfo"
            @remove-field="removeInfo"
            @add-field="addInfo"
          />
        </div>
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
          :is-asked="isAsked"
          @change-field="changeCharacterFlag"
        />
        <div
          v-if="formData.declaredBankruptOrIVA === true"
        >
          <hr>
          <InformationReviewSectionRenderer
            :edit="edit"
            :data="formData.declaredBankruptOrIVADetails"
            :data-default="emptyObject(['details', 'date', 'title'])"
            field="declaredBankruptOrIVADetails"
            :is-asked="isAsked"
            @change-field="changeInfo"
            @remove-field="removeInfo"
            @add-field="addInfo"
          />
        </div>
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
          :is-asked="isAsked"
          @change-field="changeCharacterFlag"
        />
        <div
          v-if="formData.lateTaxReturnOrFined === true"
        >
          <hr>
          <InformationReviewSectionRenderer
            :edit="edit"
            :data="formData.lateTaxReturnOrFinedDetails"
            :data-default="emptyObject(['details', 'date', 'title'])"
            field="lateTaxReturnOrFinedDetails"
            :is-asked="isAsked"
            @change-field="changeInfo"
            @remove-field="removeInfo"
            @add-field="addInfo"
          />
        </div>
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
          :is-asked="isAsked"
          @change-field="changeCharacterFlag"
        />
        <div
          v-if="formData.involvedInProfessionalMisconduct === true"
        >
          <hr>
          <InformationReviewSectionRenderer
            :data="formData.involvedInProfessionalMisconductDetails"
            :edit="edit"
            :data-default="emptyObject(['details', 'date', 'title'])"
            field="involvedInProfessionalMisconductDetails"
            :is-asked="isAsked"
            @change-field="changeInfo"
            @remove-field="removeInfo"
            @add-field="addInfo"
          />
        </div>
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
          :is-asked="isAsked"
          @change-field="changeCharacterFlag"
        />
        <div
          v-if="formData.diciplinaryActionOrAskedToResign === true"
        >
          <hr>
          <InformationReviewSectionRenderer
            :data="formData.diciplinaryActionOrAskedToResignDetails"
            :data-default="emptyObject(['details', 'date', 'title'])"
            :edit="edit"
            field="diciplinaryActionOrAskedToResignDetails"
            :is-asked="isAsked"
            @change-field="changeInfo"
            @remove-field="removeInfo"
            @add-field="addInfo"
          />
        </div>
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
          :is-asked="isAsked"
          @change-field="changeCharacterFlag"
        />
        <div
          v-if="formData.otherCharacterIssues === true"
        >
          <hr>
          <InformationReviewSectionRenderer
            :data="formData.otherCharacterIssuesDetails"
            :edit="edit"
            :data-default="emptyObject(['details', 'date', 'title'])"
            field="otherCharacterIssuesDetails"
            :is-asked="isAsked"
            @change-field="changeInfo"
            @remove-field="removeInfo"
            @add-field="addInfo"
          />
        </div>
      </dd>
    </div>
  </dl>
</template>

<script>
import InformationReviewRenderer from '@/components/Page/InformationReviewRenderer.vue';
import InformationReviewSectionRenderer from '@/components/Page/InformationReviewSectionRenderer.vue';
import CharacterSummary from '@/views/InformationReview/CharacterSummary.vue';

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
