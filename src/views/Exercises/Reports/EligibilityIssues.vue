<template>
  <div>
    <h1 class="govuk-heading-l">
      Eligibility Export
    </h1>

    <table class="govuk-table govuk-!-margin-bottom-9">
      <thead class="govuk-table__head">
        <tr class="govuk-table__row">
          <th
            scope="col"
            class="govuk-table__header"
          >
            Name
          </th>
          <th
            scope="col"
            class="govuk-table__header"
          >
            Nature of issue
          </th>
          <th
            scope="col"
            class="govuk-table__header"
          >
            Age at SCC recommendations
          </th>
          <th
            scope="col"
            class="govuk-table__header"
          >
            ASC comments
          </th>
          <th
            scope="col"
            class="govuk-table__header"
          >
            Candidate comments
          </th>
          <th
            scope="col"
            class="govuk-table__header"
          >
            Comments (Panel or JAC)
          </th>
        </tr>
      </thead>
      <tbody class="govuk-table__body">
        <tr class="govuk-table__row">
          <th
            scope="row"
            class="govuk-table__header border"
          >
            Claire Say
          </th>
          <td class="govuk-table__cell border">
            Doesn't meet PQE
          </td>
          <td class="govuk-table__cell border" />
          <td class="govuk-table__cell border" />
          <td class="govuk-table__cell border" />
          <td class="govuk-table__cell border">
            The candidate will only have 4.5 years PQE at time of appointment.
          </td>
        </tr>

        <tr class="govuk-table__row">
          <th
            scope="row"
            class="govuk-table__header border"
          >
            Jeremy Suarez
          </th>
          <td class="govuk-table__cell border">
            Will be 72
          </td>
          <td class="govuk-table__cell border">
            72
          </td>
          <td class="govuk-table__cell border" />
          <td class="govuk-table__cell border">
            I have applied because I don't see why I can't still contribute
          </td>
          <td class="govuk-table__cell border">
            The candidate cannot provide 3 years service
          </td>
        </tr>
      </tbody>
    </table>

    <button class="govuk-button">
      Export Data to document
    </button>
  </div>
</template>

<script>
export default {
  data() {
    return {
    };
  },
};
</script>

<style>
 .border {
   text-align: center;
   border-style: solid;
   border-width: 2px;
   border-color: black;
 }
</style>
