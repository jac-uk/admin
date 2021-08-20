<template>
  <div>
    <div
      v-if="application.experience && application.experience.length"
    >
      <dl
        v-for="item in application.experience"
        :key="item.name"
        class="govuk-summary-list govuk-!-margin-bottom-8"
      >
        <div class="govuk-summary-list__row">
          <dt class="govuk-summary-list__key">
            Job title
          </dt>
          <dd class="govuk-summary-list__value">
            <ul class="govuk-list">
              <li>{{ item.jobTitle | showAlternative('Answer not provided') }}</li>
            </ul>
          </dd>
        </div>

        <div class="govuk-summary-list__row">
          <dt class="govuk-summary-list__key">
            Organisation or business
          </dt>
          <dd class="govuk-summary-list__value">
            <ul class="govuk-list">
              <li>{{ item.orgBusinessName | showAlternative('Answer not provided') }}</li>
            </ul>
          </dd>
        </div>

        <div class="govuk-summary-list__row">
          <dt class="govuk-summary-list__key">
            Dates worked
          </dt>
          <dd class="govuk-summary-list__value">
            <ul
              v-if="item.startDate"
              class="govuk-list"
            >
              <li v-if="item.endDate">
                {{ item.startDate | formatDate }} to {{ item.endDate | formatDate }}
              </li>
              <li v-else>
                {{ item.startDate | formatDate }} — current
              </li>
            </ul>
            <div v-else>
              No dates provided
            </div>
          </dd>
        </div>

        <div class="govuk-summary-list__row">
          <dt class="govuk-summary-list__key">
            Law-related tasks
          </dt>
          <dd class="govuk-summary-list__value">
            <ul
              v-if="item.tasks && item.tasks.length"
              class="govuk-list"
            >
              <li
                v-for="task in item.tasks"
                :key="task.name"
              >
                <p class="govuk-body govuk-!-margin-bottom-0">
                  {{ task | lookup }}
                </p>
                <p
                  v-if="task == 'other'"
                  class="govuk-body govuk-!-margin-bottom-0"
                >
                  {{ item.otherTasks }}
                </p>
              </li>
            </ul>
            <div v-else>
              No Answers provided
            </div>
          </dd>
        </div>
      </dl>
    </div>
    <div
      v-else
      class="govuk-body"
    >
      No information provided
    </div>
  </div>
</template>
