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
import filters from '@/filters';

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
    flattenCurrentLegalRole(equalityAndDiversitySurvey) {
      if (!(equalityAndDiversitySurvey && equalityAndDiversitySurvey.currentLegalRole)) {
        return '';
      }

      const roles = [];
      equalityAndDiversitySurvey.currentLegalRole.forEach((role) => {
        if (role === 'other-fee-paid-judicial-office-holder') {
          roles.push(`${ filters.lookup(role) }: ${ equalityAndDiversitySurvey.otherCurrentFeePaidJudicialOfficeHolderDetails }`);
        } else if (role === 'other-salaried-judicial-office-holder') {
          roles.push(`${ filters.lookup(role) }: ${ equalityAndDiversitySurvey.otherCurrentSalariedJudicialOfficeHolderDetails}`);
        } else if (role === 'other-current-legal-role') {
          roles.push(`${ filters.lookup(role) }: ${ equalityAndDiversitySurvey.otherCurrentLegalRoleDetails }`);
        } else {
          roles.push(`${ filters.lookup(role) }`);
        }
      });

      return `"${ roles.join('\n')}"`;
    },
    gatherContacts() {
      const contacts = this.applications.map((application) => {
        return {
          Ref: application.referenceNumber,
          Status: filters.lookup(application.status),
          Name: application.personalDetails ? application.personalDetails.fullName : '',
          Email: application.personalDetails ? application.personalDetails.email : '',
          Phone: application.personalDetails ? application.personalDetails.phone : '',
          DateOfBirth: application.personalDetails ? filters.formatDate(application.personalDetails.dateOfBirth) : '',
          Gender: application.equalityAndDiversitySurvey ? filters.lookup(application.equalityAndDiversitySurvey.gender) : '',
          Disability: application.equalityAndDiversitySurvey ? filters.toYesNo(filters.lookup(application.equalityAndDiversitySurvey.disability)) : '',
          EthnicGroup: application.equalityAndDiversitySurvey ? filters.lookup(application.equalityAndDiversitySurvey.ethnicGroup) : '',
          CurrentLegalRole: application.equalityAndDiversitySurvey ? this.flattenCurrentLegalRole(application.equalityAndDiversitySurvey) : '',
          FirstAssessorName: application.firstAssessorFullName,
          FirstAssessorEmail: application.firstAssessorEmail,
          FirstAssessorPhone: application.firstAssessorPhone,
          SecondAssessorName: application.secondAssessorFullName,
          SecondAssessorEmail: application.secondAssessorEmail,
          SecondAssessorPhone: application.secondAssessorPhone,
        };
      });

      return contacts;
    },
    buildCsv(contacts) {
      let csvContent = 'data:text/csv;charset=utf-8,';
      csvContent += [
        Object.keys(contacts[0]).join(';'),
        ...contacts.map(item => Object.values(item).join(';')),
      ]
        .join('\n')
        .replace(/(^\[)|(\]$)/gm, '');

      return encodeURI(csvContent);
    },
    downloadContacts() {
      const contacts = this.gatherContacts();

      const link = document.createElement('a');

      link.setAttribute('href', this.buildCsv(contacts));
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
