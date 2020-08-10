<template>
  <div>
    <div class="moj-page-header-actions">
      <div class="moj-page-header-actions__title">
        <h2 class="govuk-heading-l">
          Applications - {{ status | lookup }}
        </h2>
      </div>

      <div
        v-if="status === 'applied'"
        class="moj-page-header-actions__actions float-right"
      >
        <div class="moj-button-menu">
          <div class="moj-button-menu__wrapper">
            <button
              class="govuk-button govuk-button--secondary moj-button-menu__item moj-page-header-actions__action"
              data-module="govuk-button"
              @click="exportContacts()"
            >
              Export contacts
            </button>
          </div>
        </div>
      </div>
    </div>

    <table
      v-if="applications.length"
      class="govuk-table"
    >
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
          <th
            scope="col"
            class="govuk-table__header app-custom-class"
          >
            Status
          </th>
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
            <RouterLink
              class="govuk-link"
              :to="{name: 'exercise-applications-application', params: { applicationId: application.id, status: status }}"
            >
              {{ application.referenceNumber | showAlternative(application.id) }}
            </RouterLink>
          </th>
          <td class="govuk-table__cell">
            <span v-if="application.personalDetails">
              <RouterLink
                :to="{ name: 'candidates-view', params: { id: application.userId } }"
              >
                {{ application.personalDetails.fullName }}
              </RouterLink>
            </span>
          </td>
          <td class="govuk-table__cell">
            {{ application.status }}
          </td>
        </tr>
      </tbody>
    </table>

    <p
      v-else
      class="govuk-body"
    >
      No applications found.
    </p>
  </div>
</template>

<script>
import * as filters from '@/filters';
import { downloadXLSX } from '@/helpers/export';

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
          roles.push(`other: ${ equalityAndDiversitySurvey.otherCurrentFeePaidJudicialOfficeHolderDetails }`);
        } else if (role === 'other-salaried-judicial-office-holder') {
          roles.push(`other: ${ equalityAndDiversitySurvey.otherCurrentSalariedJudicialOfficeHolderDetails}`);
        } else if (role === 'other-current-legal-role') {
          roles.push(`Other: ${ equalityAndDiversitySurvey.otherCurrentLegalRoleDetails }`);
        } else {
          roles.push(filters.lookup(role));
        }
      });

      return roles.join('\n');
    },
    flattenProfessionalBackground(equalityAndDiversitySurvey) {
      if (!(equalityAndDiversitySurvey && equalityAndDiversitySurvey.professionalBackground)) {
        return '';
      }
      const roles = [];
      equalityAndDiversitySurvey.professionalBackground.forEach((role) => {
        if (role === 'other-professional-background') {
          roles.push(`Other: ${ equalityAndDiversitySurvey.otherProfessionalBackgroundDetails }`);
        } else {
          roles.push(filters.lookup(role));
        }
      });
      return roles.join('\n');
    },
    attendedUKStateSchool(equalityAndDiversitySurvey) {
      if (!(equalityAndDiversitySurvey && equalityAndDiversitySurvey.stateOrFeeSchool)) {
        return '';
      }
      return filters.toYesNo(['uk-state-selective', 'uk-state-non-selective'].indexOf(equalityAndDiversitySurvey.stateOrFeeSchool) >= 0);
    },
    gatherContacts() {
      const headers = [
        'Reference number',
        'Status',
        'Name',
        'Email',
        'Phone number',
        'Date of Birth',
        'National Insurance Number',
        'Gender',
        'Disability',
        'Ethnic Group',
        'Current Legal Role',
        'Professional Background',
        'Attended UK State School',
        'First Generation Student',
        'First Assessor Name',
        'First Assessor Email',
        'First Assessor Phone',
        'Second Assessor Name',
        'Second Assessor Email',
        'Second Assessor Phone',
      ];

      const contacts = this.applications.map((application) => {
        return [
          application.referenceNumber,
          filters.lookup(application.status),
          application.personalDetails.fullName,
          application.personalDetails.email,
          application.personalDetails.phone,
          filters.formatDate(application.personalDetails.dateOfBirth),
          filters.formatNIN(application.personalDetails.nationalInsuranceNumber),
          filters.lookup(application.equalityAndDiversitySurvey.gender),
          filters.toYesNo(filters.lookup(application.equalityAndDiversitySurvey.disability)),
          filters.lookup(application.equalityAndDiversitySurvey.ethnicGroup),
          this.flattenCurrentLegalRole(application.equalityAndDiversitySurvey),
          this.flattenProfessionalBackground(application.equalityAndDiversitySurvey),
          filters.toYesNo(this.attendedUKStateSchool(application.equalityAndDiversitySurvey)),
          filters.toYesNo(filters.lookup(application.equalityAndDiversitySurvey.firstGenerationStudent)),
          application.firstAssessorFullName,
          application.firstAssessorEmail,
          application.firstAssessorPhone,
          application.secondAssessorFullName,
          application.secondAssessorEmail,
          application.secondAssessorPhone,
        ];
      });

      return [
        headers,
        ...contacts,
      ];
    },
    exportContacts() {
      const title = 'Contacts';
      const data = this.gatherContacts();

      downloadXLSX(
        data,
        {
          title: `${this.exercise.referenceNumber} ${title}`,
          sheetName: title,
          fileName: `${this.exercise.referenceNumber} - ${title}.xlsx`,
        }
      );
    },
  },
};
</script>

<style type="text/css" rel="stylesheet/scss" lang="scss" scoped>
  .govuk-summary-list__value,
  .govuk-summary-list__value:last-child,
  .govuk-summary-list__key {
    @include govuk-media-query($from: tablet) {
      width: auto;
    }
  }
</style>
