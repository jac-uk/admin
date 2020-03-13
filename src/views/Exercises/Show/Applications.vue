<template>
  <div>
    <table class="govuk-table">
      <caption class="govuk-table__caption">
        Applications - {{ status | lookup }}
      </caption>
      <thead class="govuk-table__head">
        <tr class="govuk-table__row">
          <th
            scope="col"
            class="govuk-table__header app-custom-class"
          >
            Reference number
          </th>
          <th
            scope="col"
            class="govuk-table__header app-custom-class"
          >
            Name
          </th>
          <!--<th
            scope="col"
            class="govuk-table__header app-custom-class"
          >
            Email
          </th> -->
          <th
            scope="col"
            class="govuk-table__header app-custom-class"
          >
            Status
          </th>
          <!-- <th
            scope="col"
            class="govuk-table__header app-custom-class"
          >
            Notes
          </th> -->
        </tr>
      </thead>
      <tbody class="govuk-table__body">
        <tr
          v-for="application in applications"
          :key="application.id"
          class="govuk-table__row"
        >
          <th
            scope="row"
            class="govuk-table__header"
          >
            <router-link
              class="govuk-link"
              :to="{name: 'exercise-show-application', params: { applicationId: application.id }}"
            >
              {{ application.referenceNumber }}
            </router-link>          
          </th>
          <td class="govuk-table__cell">
            <span v-if="application.personalDetails">{{ application.personalDetails.fullName }}</span>
          </td>
          <!--<td class="govuk-table__cell">
            {{ application.email }}
          </td> -->
          <td class="govuk-table__cell">
            <router-link
              class="govuk-link"
              :to="{name: 'exercise-show-application', params: { applicationId: application.id }}"
            >
              {{ application.status }}
            </router-link>          
          </td>
          <!-- <td class="govuk-table__cell">
            {{ application.notes }}
          </td> -->
        </tr>
      </tbody>
    </table>

    <button 
      class="govuk-button"
      @click="downloadContacts"
    >
      Download Contacts CSV
    </button>
  </div>
</template>

<script>
export default {
  computed: {
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    applications() {
      return this.$store.state.applications.records;
    },
    status() {
      return this.$route.params.status;
    },
  },
  created() {
    this.$store.dispatch('applications/bind', { exerciseId: this.exercise.id, status: this.status });
  },
  beforeRouteUpdate (to, from, next) {
    this.$store.dispatch('applications/bind', { exerciseId: this.exercise.id, status: to.params.status });
    next();
  },  
  destroyed() {
    // this.$store.dispatch('applications/unbind');
  },
  methods: {
    downloadContacts() {
      const contacts = [];
      for (let i = 0, len = this.applications.length; i < len; ++i) {
        contacts.push({
          Ref: this.applications[i].referenceNumber,
          Status: this.applications[i].status,
          Name: this.applications[i].personalDetails ? this.applications[i].personalDetails.fullName : '',
          Email: this.applications[i].personalDetails ? this.applications[i].personalDetails.email : '',
          Phone: this.applications[i].personalDetails ? this.applications[i].personalDetails.phone : '',
          FirstAssessorName: this.applications[i].firstAssessorFullName,
          FirstAssessorEmail: this.applications[i].firstAssessorEmail,
          FirstAssessorPhone: this.applications[i].firstAssessorPhone,
          SecondAssessorName: this.applications[i].secondAssessorFullName,
          SecondAssessorEmail: this.applications[i].secondAssessorEmail,
          SecondAssessorPhone: this.applications[i].secondAssessorPhone,
        });
      }
      let csvContent = 'data:text/csv;charset=utf-8,';
      csvContent += [
        Object.keys(contacts[0]).join(';'),
        ...contacts.map(item => Object.values(item).join(';')),
      ]
        .join('\n')
        .replace(/(^\[)|(\]$)/gm, '');
      const data = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', data);
      link.setAttribute('download', `${this.exercise.referenceNumber}.contacts.csv`);
      link.click();
    },
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
