<template>
  <div>
    <h1 class="govuk-heading-l">
      Independent Assessments - Record of returns
    </h1>

    <div>
      <input
        id="search-bar"
        class="govuk-input govuk-input--width-10 govuk-!-margin-right-2"
      >

      <h3
        class="govuk-heading-m"
        style="text-align: right"
      >
        Due date {{ dueDate }}
      </h3>
    </div>

    <table class="govuk-table">
      <caption class="govuk-table__caption" />
      <thead class="govuk-table__head">
        <tr class="govuk-table__row">
          <th
            scope="col"
            class="govuk-table__header app-custom-class"
          >
            <div class="govuk-checkboxes govuk-checkboxes--small">
              <div class="govuk-checkboxes__item">
                <input
                  id="checkboxes"
                  class="govuk-checkboxes__input"
                  type="checkbox"
                >
                <label
                  class="govuk-label govuk-checkboxes__label"
                  for="organisation"
                />
              </div>
            </div>
          </th>
          <th
            scope="col"
            class="govuk-table__header app-custom-class"
          >
            Applicant Ref
          </th>
          <th
            scope="col"
            class="govuk-table__header app-custom-class"
          >
            Name
          </th>
          <th
            scope="col"
            class="govuk-table__header app-custom-class"
          >
            Assessors
          </th>
          <th
            scope="col"
            class="govuk-table__header app-custom-class"
          >
            Status
          </th>
          <th
            scope="col"
            class="govuk-table__header app-custom-class"
          >
            Date submitted
          </th>
          <th
            scope="col"
            class="govuk-table__header app-custom-class"
          >
            Action
          </th>
          <th
            scope="col"
            class="govuk-table__header app-custom-class"
          />
        </tr>
      </thead>
      <tbody class="govuk-table__body">
        <tr
          v-for="applicant in applicants"
          :key="applicant.name"
          class="govuk-table__row"
        >
          <td class="govuk-table__cell">
            <div class="govuk-checkboxes govuk-checkboxes--small">
              <div class="govuk-checkboxes__item">
                <input
                  id="checkbox-applicant"
                  class="govuk-checkboxes__input"
                  type="checkbox"
                >
                <label
                  class="govuk-label govuk-checkboxes__label"
                />
              </div>
            </div>
          </td>
          <th
            scope="row"
            class="govuk-table__header"
          >
            {{ applicant.ref }}
          </th>
          <td class="govuk-table__cell">
            {{ applicant.name }}
          </td>
          <td class="govuk-table__cell">
            {{ applicant.assessor1 }}
            {{ applicant.assessor2 }}
          </td>
          <td class="govuk-table__cell">
            {{ applicant.status }}
          </td>
          <td class="govuk-table__cell">
            {{ applicant.dateSubmitted }}
          </td>
          <td class="govuk-table__cell">
            <Button class="govuk-button govuk-!-margin-bottom-2">
              Send reminder or resend email
            </Button>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="govuk-grid-column-full">
      <div
        class="govuk-grid-column-one-half"
        style="float:left"
      >
        <fieldset class="govuk-fieldset">
          <button class="govuk-button govuk-button--secondary govuk-!-margin-right-2">
            Apply Filter view
          </button>
          <button class="govuk-button govuk-button--secondary">
            clear filters
          </button>
          <div class="govuk-checkboxes govuk-checkboxes--small">
            <div class="govuk-checkboxes__item">
              <input class="govuk-checkboxes__input">
              <label class="govuk-label govuk-checkboxes__label">
                Candidate Name
              </label>
            </div>
            <div class="govuk-checkboxes__item">
              <input class="govuk-checkboxes__input">
              <label class="govuk-label govuk-checkboxes__label">
                Assessors
              </label>
            </div>
            <div class="govuk-checkboxes__item">
              <input class="govuk-checkboxes__input">
              <label class="govuk-label govuk-checkboxes__label">
                status
              </label>
            </div>
            <div class="govuk-checkboxes__item">
              <input class="govuk-checkboxes__input">
              <label class="govuk-label govuk-checkboxes__label">
                date submitted
              </label>
            </div>
          </div>
        </fieldset>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      applicants: [
        { ref: '001',
          name: 'Lauren 1',
          assessor1: 'Assessor 1',
          assessor2: 'Assessor 2',
          status: 'pending',
          dateSubmitted: '06/11/2019',
        },
        { ref: '002',
          name: 'Lauren 2',
          assessor1: 'Assessor 1b',
          assessor2: 'Assessor 2b',
          status: 'pending',
          dateSubmitted: '06/11/2019',
        },
        { ref: '003',
          name: 'Lauren 3',
          assessor1: 'Assessor 1c',
          assessor2: 'Assessor 2c',
          status: 'pending',
          dateSubmitted: '06/11/2019',
        },
      ],
      dueDate: '25/10/2020',
    };
  },
};
</script>

<style lang="scss" scoped>
  .govuk-summary-list__value,
  .govuk-summary-list__value:last-child,
  .govuk-summary-list__key {
    @include govuk-media-query($from: tablet) {
      width: auto;
    }
  }
  .update-status {
    border-style: solid;
    border-width: medium;
    border-color: black;
  }
  .govuk-checkboxes__input {
    border-style: solid;
    border-width: medium;
    border-color: black;
  }
</style>
