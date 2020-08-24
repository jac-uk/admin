<template>
  <div>
    <div class="govuk-grid-column-full govuk-!-margin-bottom-1">
      <h2 class="govuk-heading-m">
        Qualifying Test Response
      </h2>
      <h3 class="govuk-heading-l">
        {{ qualifyingTest.title | showAlternative(qualifyingTest.id) }}
      </h3>

      <table class="govuk-table">
        <tbody class="govuk-table__body">
          <tr class="govuk-table__row">
            <th class="govuk-table__header">
              Type
            </th>
            <td class="govuk-table__cell">
              {{ qualifyingTest.type | lookup }}
            </td>
            <th class="govuk-table__header">
              State
            </th>
            <td class="govuk-table__cell">
              {{ qualifyingTest.status | lookup }}
            </td>
          </tr>
          <tr class="govuk-table__row">
            <th class="govuk-table__header">
              Start Date
            </th>
            <td class="govuk-table__cell">
              {{ qualifyingTest.startDate | formatDate('longdatetime') }}
            </td>
            <th class="govuk-table__header">
              End Date
            </th>
            <td class="govuk-table__cell">
              {{ qualifyingTest.endDate | formatDate('longdatetime') }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    responseId() {
      const id = this.$route.params.responseId;
      // eslint-disable-next-line no-console
      console.log('id', id);
      return id;
    },
    qualifyingTest() {
      const qtList = this.$store.state.qualifyingTestResponses.record;
      // eslint-disable-next-line no-console
      console.log('qtList', qtList);
      return qtList;
    },
  },
  async created() {
    this.$store.dispatch('qualifyingTestResponses/bindRecord', { id: this.responseId });
  },
};
</script>

