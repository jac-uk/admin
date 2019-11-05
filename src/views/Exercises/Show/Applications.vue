<template>
  <div>
  <table class="govuk-table">
    <caption class="govuk-table__caption">Applicants</caption>
    <thead class="govuk-table__head">
      <tr class="govuk-table__row">
        <th scope="col" class="govuk-table__header app-custom-class">Applicant Ref</th>
        <th scope="col" class="govuk-table__header app-custom-class">Name</th>
        <th scope="col" class="govuk-table__header app-custom-class">Email</th>
        <th scope="col" class="govuk-table__header app-custom-class">Status</th>
        <th scope="col" class="govuk-table__header app-custom-class">Notes</th>
      </tr>
    </thead>
    <tbody class="govuk-table__body" >
      <tr v-for="applicant in applicants" :key="applicant.name" class="govuk-table__row">
        <th scope="row" class="govuk-table__header">{{applicant.ref}}</th>
        <td class="govuk-table__cell">{{applicant.name}}</td>
        <td class="govuk-table__cell">{{applicant.email}}</td>
        <td class="govuk-table__cell">{{applicant.status}}</td>
        <td class="govuk-table__cell">{{applicant.notes}}</td>
      </tr>
    </tbody>
  </table>

  <router-link
    class="govuk-button"
    :to="{name: 'exercise-applications-full'}"
  >
    See further information
  </router-link>

 </div>
</template>

<script>
export default {
  data() {
    return {
      applicants: [
        { ref: '001',
          name: 'Lauren 1',
          email: 'email@1.com',
          status: 'pending',
          notes: 'Has never been a judge.'
        },
        { ref: '002',
          name: 'Lauren 2',
          email: 'email@2.com',
          status: 'pending',
          notes: 'Had accessibility requirements.'
        },
        { ref: '003',
          name: 'Lauren 3',
          email: 'email@3.com',
          status: 'pending',
          notes: 'Needs to reschedule role play.'
        },
        ],
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
</style>
