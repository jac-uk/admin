<template>
  <div>
    <div class="govuk-grid-row">
      <h1 class="govuk-heading-l">
        Diversity Checkpoint Dashboard (Report)
      </h1>
      <div class="govuk-grid-column-one-half">
        <table class="govuk-table">
          <thead class="govuk-table__head">
            <tr class="govuk-table__row">
              <th
                scope="col"
                class="govuk-table__header govuk-!-width-one-third border"
              >
                Exercise title
              </th>
              <th
                scope="col"
                class="govuk-table__header govuk-!-width-one-third border"
              >
                Type
              </th>
              <th
                scope="col"
                class="govuk-table__header govuk-!-width-one-third border"
              >
                Total applications
              </th>
            </tr>
          </thead>
          <tbody class="govuk-table__body">
            <tr class="govuk-table__row">
              <td class="govuk-table__cell border">
                Title
              </td>
              <td class="govuk-table__cell border">
                type
              </td>
              <td class="govuk-table__cell border">
                entries
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="govuk-form-group govuk-grid-column-one-quarter govuk-!-padding-left-0">
        <select class="govuk-select govuk-!-margin-top-6 govuk-!-margin-left-1">
          <option>Team Checks</option>
          <option value="e-and-d-post-application">
            E&D Post Application
          </option>
          <option value="e-and-d-post-sift-shortlisting">
            E&D Post Sift/Shortlisting
          </option>
          <option value="e-and-d-post-selection-day">
            E&D Post Selection Day
          </option>
          <option value="selection-team-check">
            Selection Team Check
          </option>
          <option value="statistician-check">
            Statistician Check
          </option>
        </select>
      </div>

      <div class="govuk-grid-row">
        <DateInput
          id="team-checks-date"
          v-model="teamChecksDate"
          label="Filter by date"
        />
      </div>

      <div class="govuk-grid-row">
        <table class="govuk-table">
          <thead class="govuk-table__head">
            <tr class="govuk-table__row">
              <th
                scope="col"
                class="govuk-table__header govuk-!-width-one-third border"
              >
                Name
              </th>
              <th
                scope="col"
                class="govuk-table__header govuk-!-width-one-third border"
              >
                Exercise Stage
              </th>
            </tr>
          </thead>

          <tbody class="govuk-table__body">
            <tr class="govuk-table__row">
              <td class="govuk-table__cell border">
                Exercise 1
              </td>
              <td class="govuk-table__cell border">
                Stage 1
              </td>
            </tr>

            <tr class="govuk-table__row">
              <th
                scope="row"
                class="govuk-table__header border"
              >
                Protected Groups
              </th>
              <td class="govuk-table__cell border">
                Post application
              </td>
              <td class="govuk-table__cell border">
                (Number %)
              </td>
              <td class="govuk-table__cell border">
                Post Sift/Shortlisting
              </td>
              <td class="govuk-table__cell border">
                (Number %)
              </td>
              <td class="govuk-table__cell border">
                Post Selection day
              </td>
              <td class="govuk-table__cell border">
                (Number %)
              </td>
              <td class="govuk-table__cell border">
                Comparator Exercise Post-app
              </td>
              <td class="govuk-table__cell border">
                %
              </td>
              <td class="govuk-table__cell border">
                Eligible Pool
              </td>
              <td class="govuk-table__cell border">
                %
              </td>
            </tr>

            <tr class="govuk-table__row">
              <th class="govuk-table__header border">
                Gender:
              </th>
              <td class="govuk-table__cell" />
            </tr>
            <tr class="govuk-table__row">
              <th class="govuk-table__header border">
                Male
              </th>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
            </tr>
            <tr class="govuk-table__row">
              <th class="govuk-table__header border">
                Female
              </th>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
            </tr>
            <tr class="govuk-table__row">
              <th class="govuk-table__header border">
                Other
              </th>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
            </tr>
            <tr class="govuk-table__row">
              <th class="govuk-table__header border">
                Prefer not to say
              </th>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
            </tr>
            <tr class="govuk-table__row">
              <th class="govuk-table__header border">
                Ethnicity:
              </th>
            </tr>
            <tr class="govuk-table__row">
              <th class="govuk-table__header border">
                BAME
              </th>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
            </tr>
            <tr class="govuk-table__row">
              <th class="govuk-table__header border">
                White
              </th>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
            </tr>
            <tr class="govuk-table__row">
              <th class="govuk-table__header border">
                Prefer not to say
              </th>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
            </tr>
            <tr class="govuk-table__row">
              <th class="govuk-table__header border">
                Disability:
              </th>
            </tr>
            <tr class="govuk-table__row">
              <th class="govuk-table__header border">
                Disabled
              </th>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
            </tr>
            <tr class="govuk-table__row">
              <th class="govuk-table__header border">
                Professional Background:
              </th>
            </tr>
            <tr class="govuk-table__row">
              <th class="govuk-table__header border">
                Solicitor
              </th>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
            </tr>
            <tr class="govuk-table__row">
              <th class="govuk-table__header border">
                Barrister
              </th>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
            </tr>
            <tr class="govuk-table__row">
              <th class="govuk-table__header border">
                CILEx
              </th>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
            </tr>
            <tr class="govuk-table__row">
              <th class="govuk-table__header border">
                Other
              </th>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
            </tr>
            <tr class="govuk-table__row">
              <th class="govuk-table__header border">
                Social Mobility:
              </th>
            </tr>
            <tr class="govuk-table__row">
              <th class="govuk-table__header border">
                Attended a UK State School
              </th>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
            </tr>
            <tr class="govuk-table__row">
              <th class="govuk-table__header border">
                First Generation to Attend University
              </th>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="govuk-grid-row">
        <table class="govuk-table">
          <thead class="govuk-table__head">
            <tr class="govuk-table__row">
              <th
                scope="col"
                class="govuk-table__header govuk-!-width-one-third border"
              >
                Differences between stages
              </th>
            </tr>
          </thead>

          <tbody class="govuk-table__body">
            <tr class="govuk-table__row">
              <th
                scope="row"
                class="govuk-table__header border"
              >
                Name
              </th>
              <td class="govuk-table__cell border">
                From post-app to post-sift
              </td>
              <td class="govuk-table__cell border">
                (Number %)
              </td>
              <td class="govuk-table__cell border">
                From post-shortlisting to post-SD
              </td>
              <td class="govuk-table__cell border">
                (Number %)
              </td>
              <td class="govuk-table__cell border">
                Overall: post-app to post-SD
              </td>
              <td class="govuk-table__cell border">
                (Number %)
              </td>
            </tr>

            <tr class="govuk-table__row">
              <th class="govuk-table__header border">
                Gender:
              </th>
              <td class="govuk-table__cell" />
            </tr>
            <tr class="govuk-table__row">
              <th class="govuk-table__header border">
                Male
              </th>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
            </tr>
            <tr class="govuk-table__row">
              <th class="govuk-table__header border">
                Female
              </th>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
            </tr>
            <tr class="govuk-table__row">
              <th class="govuk-table__header border">
                Other
              </th>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
            </tr>
            <tr class="govuk-table__row">
              <th class="govuk-table__header border">
                Prefer not to say
              </th>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
            </tr>
            <tr class="govuk-table__row">
              <th class="govuk-table__header border">
                Ethnicity:
              </th>
            </tr>
            <tr class="govuk-table__row">
              <th class="govuk-table__header border">
                BAME
              </th>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
            </tr>
            <tr class="govuk-table__row">
              <th class="govuk-table__header border">
                White
              </th>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
            </tr>
            <tr class="govuk-table__row">
              <th class="govuk-table__header border">
                Prefer not to say
              </th>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
            </tr>
            <tr class="govuk-table__row">
              <th class="govuk-table__header border">
                Disability:
              </th>
            </tr>
            <tr class="govuk-table__row">
              <th class="govuk-table__header border">
                Disabled
              </th>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
            </tr>
            <tr class="govuk-table__row">
              <th class="govuk-table__header border">
                Professional Background:
              </th>
            </tr>
            <tr class="govuk-table__row">
              <th class="govuk-table__header border">
                Solicitor
              </th>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
            </tr>
            <tr class="govuk-table__row">
              <th class="govuk-table__header border">
                Barrister
              </th>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
            </tr>
            <tr class="govuk-table__row">
              <th class="govuk-table__header border">
                CILEx
              </th>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
            </tr>
            <tr class="govuk-table__row">
              <th class="govuk-table__header border">
                Other
              </th>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
            </tr>
            <tr class="govuk-table__row">
              <th class="govuk-table__header border">
                Social Mobility:
              </th>
            </tr>
            <tr class="govuk-table__row">
              <th class="govuk-table__header border">
                Attended a UK State School
              </th>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
            </tr>
            <tr class="govuk-table__row">
              <th class="govuk-table__header border">
                First Generation to Attend University
              </th>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
              <td class="govuk-table__cell border" />
              <td class="govuk-table__cell border">
                %
              </td>
            </tr>
          </tbody>
        </table>

        <button class="govuk-button">
          Export Data to document
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import DateInput from '@jac-uk/jac-kit/draftComponents/Form/DateInput';

export default {
  components: {
    DateInput,
  },
};
</script>

<style>

  .border {
  border-collapse:collapse;
  border:2px solid black;
  text-align: center;
  padding: 4px;
  }

</style>
