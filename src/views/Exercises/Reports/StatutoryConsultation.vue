<template>
  <div>
    <h1 class="govuk-heading-m">
      Statutory Consultation - need to check if the non legal exercises stat can be waived
    </h1>

    <table class="govuk-table govuk-!-margin-bottom-9">
      <thead class="govuk-table__head">
        <tr class="govuk-table__row">
          <th
            scope="col"
            class="govuk-table__header border"
          >
            Candidate
          </th>
          <th
            scope="col"
            class="govuk-table__header border"
          >
            Home post code
          </th>
          <th
            scope="col"
            class="govuk-table__header border"
          >
            Current circuit / location
          </th>
          <th
            scope="col"
            class="govuk-table__header border"
          >
            Jurisdiction preference(s)
          </th>
          <th
            scope="col"
            class="govuk-table__header border"
          >
            Location preference(s)
          </th>
          <th
            scope="col"
            class="govuk-table__header border"
          >
            Suitable for Wales
          </th>
          <th
            scope="col"
            class="govuk-table__header border"
          >
            Practising role
          </th>
          <th
            scope="col"
            class="govuk-table__header border"
          >
            Do they hold a judicial appointment(s)
          </th>
          <th
            scope="col"
            class="govuk-table__header border"
          >
            Details of Judicial appointment(s)
          </th>
        </tr>
      </thead>
      <tbody class="govuk-table__body">
        <tr class="govuk-table__row">
          <th
            scope="row"
            class="govuk-table__header border"
          >
            Claire Troughton
          </th>
          <td class="govuk-table__cell border">
            DA11 5ET
          </td>
          <td class="govuk-table__cell border">
            London and South East
          </td>
          <td class="govuk-table__cell border">
            (1) Criminal, (2) Civil,
          </td>
          <td class="govuk-table__cell border">
            London and South East (1), South Western (2)
          </td>
          <td class="govuk-table__cell border">
            No
          </td>
          <td class="govuk-table__cell border">
            Solicitor
          </td>
          <td class="govuk-table__cell border">
            Yes
          </td>
          <td class="govuk-table__cell border">
            Fee Paid Tribunal Judge, Recorder
          </td>
        </tr>
        <tr class="govuk-table__row">
          <th
            scope="row"
            class="govuk-table__header border"
          >
            Rebecca McKnight
          </th>
          <td class="govuk-table__cell border">
            TR12 5RZ
          </td>
          <td class="govuk-table__cell border">
            South Western
          </td>
          <td class="govuk-table__cell border">
            (1) Family, (2) Crime,
          </td>
          <td class="govuk-table__cell border">
            Midlands (1), South Western (2)
          </td>
          <td class="govuk-table__cell border">
            No
          </td>
          <td class="govuk-table__cell border">
            Barrister
          </td>
          <td class="govuk-table__cell border">
            Yes
          </td>
          <td class="govuk-table__cell border">
            Deputy District Judge, Recorder
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
