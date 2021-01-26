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

    <Table
      ref="applicationsTable"
      data-key="id"
      :data="applications"
      :columns="tableColumns"
      :search="['personalDetails.fullName']"
      :page-size="50"
      @change="getTableData"
    >
      <template #row="{row}">
        <TableCell :title="tableColumns[0].title">
          <RouterLink
            class="govuk-link"
            :to="{name: 'exercise-applications-application', params: { applicationId: row.id, status: status }}"
          >
            {{ row.referenceNumber | showAlternative(row.id) }}
          </RouterLink>
        </TableCell>
        <TableCell :title="tableColumns[1].title">
          {{ row.personalDetails && row.personalDetails.fullName }}
        </TableCell>
        <TableCell :title="tableColumns[2].title">
          {{ row.status | lookup }}
        </TableCell>
      </template>
    </Table>
    <p
      v-if="!applications.length"
      class="govuk-body"
    >
      No applications found.
    </p>
  </div>
</template>

<script>
import Table from '@jac-uk/jac-kit/components/Table/Table';
import TableCell from '@jac-uk/jac-kit/components/Table/TableCell';
import * as filters from '@jac-uk/jac-kit/filters/filters';
import { downloadXLSX } from '@jac-uk/jac-kit/helpers/export';

export default {
  components: {
    Table,
    TableCell,
  },
  data(){
    return {
      tableColumns: [
        { title: 'Reference number' },
        { title: 'Name', sort: 'personalDetails.fullName', default: true },
        { title: 'Status' },
      ],
    };
  },
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
  watch: {
    status() {
      this.$refs['applicationsTable'].reload();
    },
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
        'Held Fee-paid Judicial Role',
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
          filters.heldFeePaidJudicialRole(application.equalityAndDiversitySurvey.feePaidJudicialRole),
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
    async exportContacts() {
      const title = 'Contacts';
      await this.getTableData({});
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
    getTableData(params) {
      return this.$store.dispatch(
        'applications/bind',
        {
          exerciseId: this.exercise.id,
          status: this.status,
          ...params,
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
