<template>
  <div>
    <dl class="govuk-summary-list">
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key widerColumn">
          A subject of an allegation or claim of professional misconduct
        </dt>
        <dd class="govuk-summary-list__value">
          <InformationReviewRenderer
            :data="characterInformation.subjectOfAllegationOrClaimOfProfessionalMisconductDetails"
            :display-month-year-only="true"
          />
        </dd>
      </div>
    </dl>

    <dl class="govuk-summary-list">
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key widerColumn">
          A subject of an allegation or claim of negligence
        </dt>
        <dd class="govuk-summary-list__value">
          <InformationReviewRenderer
            :data="characterInformation.subjectOfAllegationOrClaimOfNegligenceDetails"
            :display-month-year-only="true"
          />
        </dd>
      </div>
    </dl>

    <dl class="govuk-summary-list">
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key widerColumn">
          A subject of an allegation or claim of wrongful dismissal
        </dt>
        <dd class="govuk-summary-list__value">
          <InformationReviewRenderer
            :data="characterInformation.subjectOfAllegationOrClaimOfWrongfulDismissalDetails"
            :display-month-year-only="true"
          />
        </dd>
      </div>
    </dl>

    <dl class="govuk-summary-list">
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key widerColumn">
          A subject of an allegation or claim of discrimination proceedings
        </dt>
        <dd class="govuk-summary-list__value">
          <InformationReviewRenderer
            :data="characterInformation.subjectOfAllegationOrClaimOfDiscriminationProceedingDetails"
            :display-month-year-only="true"
          />
        </dd>
      </div>
    </dl>

    <dl class="govuk-summary-list">
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key widerColumn">
          A subject of an allegation or claim of harassment proceedings
        </dt>
        <dd class="govuk-summary-list__value">
          <InformationReviewRenderer
            :data="characterInformation.subjectOfAllegationOrClaimOfHarassmentProceedingDetails"
            :display-month-year-only="true"
          />
        </dd>
      </div>
    </dl>

    <dl class="govuk-summary-list">
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key widerColumn">
          A subject of complaints or disciplinary action
        </dt>
        <dd class="govuk-summary-list__value">
          <InformationReviewRenderer
            :data="characterInformation.complaintOrDisciplinaryActionDetails"
            :display-month-year-only="true"
          />
        </dd>
      </div>
    </dl>

    <dl class="govuk-summary-list">
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key widerColumn">
          Has been asked to resign from a position
        </dt>
        <dd class="govuk-summary-list__value">
          <InformationReviewRenderer
            :data="characterInformation.requestedToResignDetails"
            :display-month-year-only="true"
          />
        </dd>
      </div>
    </dl>
  </div>
</template>

<script>
import InformationReviewRenderer from '@/components/Page/InformationReviewRenderer';

export default {
  name: 'ProfessionalConductSummary',
  components: {
    InformationReviewRenderer,
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
