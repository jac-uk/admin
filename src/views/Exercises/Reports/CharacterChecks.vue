<template>
  <div>
    <h1 class="govuk-heading-s">
      Character checks export
    </h1>

    <div class="govuk-form-group">
      <select
        id="sort"
        class="govuk-select"
      >
        <option value="acro">
          ACRO
        </option>
        <option value="srb">
          SRB
        </option>
        <option value="bsb">
          BSB
        </option>
        <option value="jcio">
          JCIO
        </option>
        <option value="hmrc">
          HRMC
        </option>
        <option value="other">
          Other
        </option>
      </select>
    </div>

    <h1
      class="govuk-heading-m"
      style="float: right"
    >
      Provided by ACRO
    </h1>

    <table class="govuk-table govuk-!-margin-bottom-9">
      <caption class="govuk-table__caption">
        Character Checks Export - ACRO
      </caption>
      <thead class="govuk-table__head">
        <tr class="govuk-table__row">
          <th
            scope="col"
            class="govuk-table__header border"
          >
            Name
          </th>
          <th
            scope="col"
            class="govuk-table__header border"
          >
            Other name
          </th>
          <th
            scope="col"
            class="govuk-table__header border"
          >
            Date of birth
          </th>
          <th
            scope="col"
            class="govuk-table__header border"
          >
            Place of birth
          </th>
          <th
            scope="col"
            class="govuk-table__header border"
          >
            NI Number
          </th>
          <th
            scope="col"
            class="govuk-table__header border"
          >
            Present address
          </th>
          <th
            scope="col"
            class="govuk-table__header border"
          >
            Previous address
          </th>
          <th
            scope="col"
            class="govuk-table__header border"
          >
            Trace/No trace
          </th>
          <th
            scope="col"
            class="govuk-table__header border"
          >
            Further information required
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
            Claire Say
          </td>
          <td class="govuk-table__cell border">
            08/03/71
          </td>
          <td class="govuk-table__cell border">
            Taunton
          </td>
          <td class="govuk-table__cell border">
            AB123456C
          </td>
          <td class="govuk-table__cell border">
            17 Tile Lane, Taunton, TD45 3GB
          </td>
          <td class="govuk-table__cell border">
            12 Hatchet Rise, Taunton, TD34 9DE
          </td>
          <td class="govuk-table__cell border" />
          <td class="govuk-table__cell border" />
        </tr>
      </tbody>
    </table>

    <table class="govuk-table govuk-!-margin-bottom-9">
      <caption class="govuk-table__caption">
        Character Export - Solicitors regulation authority
      </caption>
      <thead class="govuk-table__head">
        <tr class="govuk-table__row">
          <th
            scope="col"
            class="govuk-table__header border"
          >
            Name
          </th>
          <th
            scope="col"
            class="govuk-table__header border"
          >
            Other name
          </th>
          <th
            scope="col"
            class="govuk-table__header border"
          >
            Entered on the roll
          </th>
          <th
            scope="col"
            class="govuk-table__header border"
          >
            Registration number
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
            Claire Say
          </td>
          <td class="govuk-table__cell border">
            08/03/97
          </td>
          <td class="govuk-table__cell border">
            AB4598D
          </td>
        </tr>
      </tbody>
    </table>

    <table class="govuk-table govuk-!-margin-bottom-9">
      <caption class="govuk-table__caption">
        Character Export - Bar Standards board
      </caption>
      <thead class="govuk-table__head">
        <tr class="govuk-table__row">
          <th
            scope="col"
            class="govuk-table__header border"
          >
            Name
          </th>
          <th
            scope="col"
            class="govuk-table__header border"
          >
            Other name
          </th>
          <th
            scope="col"
            class="govuk-table__header border"
          >
            Called to the bar
          </th>
          <th
            scope="col"
            class="govuk-table__header border"
          >
            Registration number
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
            Claire Say
          </td>
          <td class="govuk-table__cell border">
            08/03/97
          </td>
          <td class="govuk-table__cell border">
            AB4598D
          </td>
        </tr>
      </tbody>
    </table>

    <table class="govuk-table govuk-!-margin-bottom-9">
      <caption class="govuk-table__caption">
        Character Export - JCIO
      </caption>
      <thead class="govuk-table__head">
        <tr class="govuk-table__row">
          <th
            scope="col"
            class="govuk-table__header border"
          >
            Name
          </th>
          <th
            scope="col"
            class="govuk-table__header border"
          >
            Other name
          </th>
          <th
            scope="col"
            class="govuk-table__header border"
          >
            Judicial Office
          </th>
          <th
            scope="col"
            class="govuk-table__header border"
          >
            Judicial Posts
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
            Claire Say
          </td>
          <td class="govuk-table__cell border">
            Yes
          </td>
          <td class="govuk-table__cell border">
            Fee Paid Tribunal Judge, Recorder
          </td>
        </tr>
      </tbody>
    </table>

    <table class="govuk-table govuk-!-margin-bottom-9">
      <caption class="govuk-table__caption">
        Character Export - Other (GMC, RICS)
      </caption>
      <thead class="govuk-table__head">
        <tr class="govuk-table__row">
          <th
            scope="col"
            class="govuk-table__header border"
          >
            Name
          </th>
          <th
            scope="col"
            class="govuk-table__header border"
          >
            Other name
          </th>
          <th
            scope="col"
            class="govuk-table__header border"
          >
            Date of membership
          </th>
          <th
            scope="col"
            class="govuk-table__header border"
          >
            Membership number
          </th>
          <th
            scope="col"
            class="govuk-table__header border"
          >
            Comments / Restrictions
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
            Claire Say
          </td>
          <td class="govuk-table__cell border">
            08/03/97
          </td>
          <td class="govuk-table__cell border">
            AB4598D
          </td>
          <td class="govuk-table__cell border">
            N/A
          </td>
        </tr>
      </tbody>
    </table>

    <table class="govuk-table govuk-!-margin-bottom-9">
      <caption class="govuk-table__caption">
        Character Checks Export - HMRC
      </caption>
      <thead class="govuk-table__head">
        <tr class="govuk-table__row">
          <th
            scope="col"
            class="govuk-table__header border"
          >
            Name
          </th>
          <th
            scope="col"
            class="govuk-table__header border"
          >
            Other name
          </th>
          <th
            scope="col"
            class="govuk-table__header border"
          >
            Date of birth
          </th>
          <th
            scope="col"
            class="govuk-table__header border"
          >
            VAT registration number
          </th>
          <th
            scope="col"
            class="govuk-table__header border"
          >
            Issues declared by applicant
          </th>
          <th
            scope="col"
            class="govuk-table__header border"
          >
            Outstanding Income Tax Returns
          </th>
          <th
            scope="col"
            class="govuk-table__header border"
          >
            Income Tax Debt
          </th>
          <th
            scope="col"
            class="govuk-table__header border"
          >
            Ongoing Income Tax Enquiries
          </th>
          <th
            scope="col"
            class="govuk-table__header border"
          >
            Outstanding VAT Debt
          </th>
          <th
            scope="col"
            class="govuk-table__header border"
          >
            Ongoing VAT Enquiry
          </th>
          <th
            scope="col"
            class="govuk-table__header border"
          >
            CENTAUR Information
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
            Claire Say
          </td>
          <td class="govuk-table__cell border">
            08/03/97
          </td>
          <td class="govuk-table__cell border">
            R3wa87
          </td>
          <td class="govuk-table__cell border">
            I was fined £150 for a late tax submission
          </td>
          <td class="govuk-table__cell border">
            N/A
          </td>
          <td class="govuk-table__cell border">
            £3000
          </td>
          <td class="govuk-table__cell border">
            N/A
          </td>
          <td class="govuk-table__cell border">
            N/A
          </td>
          <td class="govuk-table__cell border">
            N/A
          </td>
          <td class="govuk-table__cell border">
            Nothing recorded
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
