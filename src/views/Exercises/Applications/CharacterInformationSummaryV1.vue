<template>
  <dl
    v-if="characterInformation"
    class="govuk-summary-list"
  >
    <div class="govuk-summary-list__row">
      <dt class="govuk-summary-list__key widerColumn">
        Has been cautioned or convicted of a criminal offence
      </dt>
      <dd
        class="govuk-summary-list__value"
      >
        {{ characterInformation.criminalOffences | toYesNo }}
        <EventRenderer
          v-if="characterInformation.criminalOffences"
          :events="characterInformation.criminalOffenceDetails"
        />
      </dd>
    </div>
    <div class="govuk-summary-list__row">
      <dt class="govuk-summary-list__key">
        Has received a non-motoring penalty notice in the last 4 years
      </dt>
      <dd
        class="govuk-summary-list__value"
      >
        {{ characterInformation.nonMotoringFixedPenaltyNotices | toYesNo }}
        <EventRenderer
          v-if="characterInformation.nonMotoringFixedPenaltyNotices"
          :events="characterInformation.nonMotoringFixedPenaltyNoticesDetails"
        />
      </dd>
    </div>
    <div class="govuk-summary-list__row">
      <dt class="govuk-summary-list__key">
        Has been disqualified from driving, or convicted for driving under the influence of drink or drugs
      </dt>
      <dd
        class="govuk-summary-list__value"
      >
        {{ characterInformation.drivingDisqualificationDrinkDrugs | toYesNo }}
        <EventRenderer
          v-if="characterInformation.drivingDisqualificationDrinkDrugs"
          :events="characterInformation.drivingDisqualificationDrinkDrugsDetails"
        />
      </dd>
    </div>
    <div class="govuk-summary-list__row">
      <dt class="govuk-summary-list__key">
        Has endorsements on licence, or received any motoring fixed-penalty notices in the last 4 years
      </dt>
      <dd
        class="govuk-summary-list__value"
      >
        {{ characterInformation.endorsementsOrMotoringFixedPenalties | toYesNo }}
        <EventRenderer
          v-if="characterInformation.endorsementsOrMotoringFixedPenalties"
          :events="characterInformation.endorsementsOrMotoringFixedPenaltiesDetails"
        />
      </dd>
    </div>
    <div class="govuk-summary-list__row">
      <dt class="govuk-summary-list__key">
        Has been declared bankrupt or entered into an Individual Voluntary Agreement (IVA)
      </dt>
      <dd
        class="govuk-summary-list__value"
      >
        {{ characterInformation.declaredBankruptOrIVA | toYesNo }}
        <EventRenderer
          v-if="characterInformation.declaredBankruptOrIVA"
          :events="characterInformation.declaredBankruptOrIVADetails"
        />
      </dd>
    </div>
    <div class="govuk-summary-list__row">
      <dt class="govuk-summary-list__key">
        Has filed late tax returns or been fined by HMRC
      </dt>
      <dd
        class="govuk-summary-list__value"
      >
        {{ characterInformation.lateTaxReturnOrFined | toYesNo }}
        <EventRenderer
          v-if="characterInformation.lateTaxReturnOrFined"
          :events="characterInformation.lateTaxReturnOrFinedDetails"
        />
      </dd>
    </div>
    <div class="govuk-summary-list__row">
      <dt class="govuk-summary-list__key">
        Has ever been, or is currently, subject to professional misconduct, negligence, wrongful dismissal, discrimination or harassment proceedings
      </dt>
      <dd
        class="govuk-summary-list__value"
      >
        {{ characterInformation.involvedInProfessionalMisconduct | toYesNo }}
        <EventRenderer
          v-if="characterInformation.involvedInProfessionalMisconduct"
          :events="characterInformation.involvedInProfessionalMisconductDetails"
        />
      </dd>
    </div>
    <div class="govuk-summary-list__row">
      <dt class="govuk-summary-list__key">
        Has ever been subject to complaints or disciplinary action, or been asked to resign from a position
      </dt>
      <dd
        class="govuk-summary-list__value"
      >
        {{ characterInformation.diciplinaryActionOrAskedToResign | toYesNo }}
        <EventRenderer
          v-if="characterInformation.diciplinaryActionOrAskedToResign"
          :events="characterInformation.diciplinaryActionOrAskedToResignDetails"
        />
      </dd>
    </div>
    <div class="govuk-summary-list__row">
      <dt class="govuk-summary-list__key">
        Has any other character issues
      </dt>
      <dd
        class="govuk-summary-list__value"
      >
        {{ characterInformation.otherCharacterIssues | toYesNo }}
        <EventRenderer
          v-if="characterInformation.otherCharacterIssues"
          :events="characterInformation.otherCharacterIssuesDetails"
        />
      </dd>
    </div>
  </dl>
  <span
    v-else
    class="govuk-body"
  >No information provided
  </span>
</template>

<script>
import EventRenderer from '@jac-uk/jac-kit/draftComponents/EventRenderer';

export default {
  name: 'CharacterInformationSummaryV1',
  components: {
    EventRenderer,
  },
  props: {
    characterInformation: {
      type: Object,
      required: true,
      default: new Object({}),
    },
  },
};
</script>

<style scoped>
  .widerColumn {
    width: 70%;
  }
</style>
