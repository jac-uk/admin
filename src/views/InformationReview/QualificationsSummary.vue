<template>
  <div>
    <div v-if="application.qualifications">
      <dl
        v-for="item in application.qualifications"
        :key="item.name"
        class="govuk-summary-list govuk-!-margin-bottom-0"
      >
        <div class="govuk-summary-list__row">
          <dt class="govuk-summary-list__key">
            Qualification
          </dt>
          <dd class="govuk-summary-list__value">
            <ul class="govuk-list">
              <li>{{ item.type | lookup }}</li>
            </ul>
          </dd>
        </div>

        <div class="govuk-summary-list__row">
          <dt class="govuk-summary-list__key">
            Location
          </dt>
          <dd class="govuk-summary-list__value">
            <ul class="govuk-list">
              <li>{{ item.location | lookup }}</li>
            </ul>
          </dd>
        </div>

        <div
          v-if="item.date"
          class="govuk-summary-list__row"
        >
          <dt
            v-if="item.type === 'barrister'"
            class="govuk-summary-list__key"
          >
            Date completed pupillage
          </dt>
          <dt
            v-else
            class="govuk-summary-list__key"
          >
            Date qualified
          </dt>
          <dd class="govuk-summary-list__value">
            <ul class="govuk-list">
              <li> {{ item.date | formatDate }}</li>
            </ul>
          </dd>
        </div>

        <template
          v-if="item.qualificationNotComplete && item.details"
        >
          <div
            class="govuk-summary-list__row"
          >
            <dt class="govuk-summary-list__key">
              Completed pupillage
            </dt>
            <dd class="govuk-summary-list__value">
              <ul class="govuk-list">
                <li>
                  No
                </li>
              </ul>
            </dd>
          </div>

          <div
            class="govuk-summary-list__row"
          >
            <dt class="govuk-summary-list__key">
              Did not complete pupillage notes
            </dt>
            <dd class="govuk-summary-list__value">
              <ul class="govuk-list">
                <li>
                  {{ item.details }}
                </li>
              </ul>
            </dd>
          </div>
        </template>
      </dl>
    </div>

    <div
      v-else
      class="govuk-body"
    >
      No information provided
    </div>

    <dl
      v-if="exercise.schedule2Apply"
      class="govuk-summary-list"
    >
      <div
        v-if="exercise.appliedSchedule == 'schedule-2-3'"
        class="govuk-summary-list__row"
      >
        <dt class="govuk-summary-list__key">
          Are you applying under Schedule 2(3)?
        </dt>
        <dd class="govuk-summary-list__value">
          <ul class="govuk-list">
            <li> {{ application.applyingUnderSchedule2Three | toYesNo | showAlternative('Answer not provided') }}</li>
          </ul>
        </dd>
      </div>
    </dl>

    <dl
      v-if="(exercise.appliedSchedule=='schedule-2-3' && application.applyingUnderSchedule2Three)
        || (exercise.appliedSchedule=='schedule-2-d' && application.applyingUnderSchedule2d)"
      class="govuk-summary-list  govuk-!-margin-bottom-8"
    >
      <dt
        class="govuk-summary-list__key"
      >
        Explain how you've gained experience in law.
      </dt>
      <dd class="govuk-summary-list__value">
        <ul class="govuk-list">
          <li v-if="exercise.appliedSchedule=='schedule-2-3'">
            {{ application.experienceUnderSchedule2Three }}
          </li>
          <li v-if="exercise.appliedSchedule=='schedule-2-d'">
            {{ application.experienceUnderSchedule2D }}
          </li>
        </ul>
      </dd>
    </dl>
  </div>
</template>
