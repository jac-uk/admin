<template>
  <div class="govuk-grid-column-full">
    <div class="moj-page-header-actions">
      <div class="moj-page-header-actions__title">
        <h2 class="govuk-heading-l">
          Handover
        </h2>
      </div>

      <div
        class="moj-page-header-actions__actions float-right"
      >
        <div class="moj-button-menu">
          <div class="moj-button-menu__wrapper">
            <button
              class="govuk-button govuk-button--secondary moj-button-menu__item moj-page-header-actions__action"
              data-module="govuk-button"
              @click="exportData()"
            >
              Export data
            </button>
            <ActionButton
              v-if="totalApplicationRecords"
              type="primary"
              @click="transferHandoverData()"
            >
              Transfer Handover Data
            </ActionButton>
          </div>
        </div>
      </div>
    </div>

    <div class="govuk-grid-row">
      <div class="govuk-grid-column-one-half">
        <div class="panel govuk-!-margin-bottom-9">
          <span class="govuk-caption-m">
            Approved for immediate appointment
          </span>
          <h2 class="govuk-heading-m govuk-!-margin-bottom-0">
            {{ totalApplicationRecords }}
          </h2>
        </div>
      </div>
      <div class="govuk-grid-column-one-half">
        <div class="panel govuk-!-margin-bottom-9">
          <span class="govuk-caption-m">Type of exercise</span>
          <h2 class="govuk-heading-m govuk-!-margin-bottom-0">
            {{ exerciseType | lookup }}
          </h2>
        </div>
      </div>
    </div>

    <Table
      data-key="id"
      :data="applicationRecords"
      :columns="tableColumns"
      :page-size="1000"
      @change="getTableData"
    >
      <template #row="{row}">
        <TableCell :title="tableColumns[0].title">
          <RouterLink
            :to="{ name: 'exercise-application', params: { applicationId: row.id } }"
          >
            {{ row.application.referenceNumber }}
          </RouterLink>
        </TableCell>
        <TableCell :title="tableColumns[1].title">
          <RouterLink
            :to="{ name: 'candidates-view', params: { id: row.candidate.id } }"
          >
            {{ row.candidate.fullName }}
          </RouterLink>
        </TableCell>
      </template>
    </Table>
  </div>
</template>

<script>
import { functions } from '@/firebase';
import { mapState } from 'vuex';
import * as filters from '@jac-uk/jac-kit/filters/filters';
import { downloadXLSX } from '@jac-uk/jac-kit/helpers/export';
import Table from '@jac-uk/jac-kit/components/Table/Table';
import TableCell from '@jac-uk/jac-kit/components/Table/TableCell';
import ActionButton from '@jac-uk/jac-kit/draftComponents/ActionButton';
import { APPLICATION_STATUS } from '@jac-uk/jac-kit/helpers/constants';

export default {
  components: {
    Table,
    TableCell,
    ActionButton,
  },
  data() {
    return {
      tableColumns: [
        {
          title: 'Reference number',
          class: ['govuk-!-width-one-third'],
        },
        { title: 'Name', sort: 'candidate.fullName', default: true },
      ],
    };
  },
  computed: {
    ...mapState({
      exercise: state => state.exerciseDocument.record,
      applications: state => state.applications.records,
      applicationRecords: state => state.stageHandover.records,
    }),
    exerciseType() {
      return this.exercise.typeOfExercise;
    },
    totalApplicationRecords() {
      return (this.exercise && this.exercise.applicationRecords && this.exercise.applicationRecords.handover) ? this.exercise.applicationRecords.handover : 0;
    },
  },
  methods: {
    async transferHandoverData() {
      await functions.httpsCallable('transferHandoverData')({ exerciseId: this.exercise.id });
    },
    getTableData(params) {
      this.$store.dispatch(
        'stageHandover/bind',
        {
          exerciseId: this.exercise.id,
          status: APPLICATION_STATUS.APPROVED_FOR_IMMEDIATE_APPOINTMENT,
          ...params,
        }
      );
    },
    formatPersonalDetails(personalDetails) {
      const formatAddress = (address => [
        address.street1,
        address.street2,
        address.town,
        address.county,
        address.postcode,
      ].join('\n')
      );

      let formattedPreviousAddresses;
      if (personalDetails.address && !personalDetails.address.currentMoreThan5Years) {
        formattedPreviousAddresses = personalDetails.address.previous.map((address) => {
          const dates = `${filters.formatDate(address.startDate)} - ${filters.formatDate(address.endDate)}`;
          const formattedAddress = formatAddress(address);
          return `${dates}\n${formattedAddress}`;
        }).join('\n\n');
      }

      return [
        personalDetails.title,
        personalDetails.fullName,
        personalDetails.otherNames,
        personalDetails.suffix,
        personalDetails.email,
        filters.formatDate(personalDetails.dateOfBirth),
        filters.formatNIN(personalDetails.nationalInsuranceNumber),
        filters.lookup(personalDetails.citizenship),
        personalDetails.address ? formatAddress(personalDetails.address.current) : null,
        formattedPreviousAddresses,
        personalDetails.phone,
      ];
    },
    formatDiversityData(survey) {
      const share = (value) => survey.shareData ? value : null;

      let formattedFeePaidJudicialRole;
      if (survey.shareData) {
        formattedFeePaidJudicialRole = filters.toYesNo(filters.lookup(survey.feePaidJudicialRole));
        if (survey.feePaidJudicialRole == 'other-fee-paid-judicial-office') {
          formattedFeePaidJudicialRole = `${formattedFeePaidJudicialRole}\n${survey.otherFeePaidJudicialRoleDetails}`;
        }
      }

      const formattedDiversityData = [
        filters.toYesNo(survey.shareData),
        share(survey.professionalBackground.map(position => filters.lookup(position)).join(', ')),
        formattedFeePaidJudicialRole,
        share(filters.lookup(survey.stateOrFeeSchool)),
        share(filters.toYesNo(filters.lookup(survey.firstGenerationStudent))),
        share(filters.lookup(survey.ethnicGroup)),
        share(filters.lookup(survey.gender)),
        share(filters.lookup(survey.sexualOrientation)),
        share(survey.disability ? survey.disabilityDetails : filters.toYesNo(survey.disability)),
        share(filters.lookup(survey.religionFaith)),
        share(filters.toYesNo(filters.lookup(survey.attendedOutreachEvents))),
      ];

      if (this.exerciseType === 'legal' || this.exerciseType === 'leadership') {
        formattedDiversityData.push(
          share(filters.toYesNo(filters.lookup(survey.participatedInJudicialWorkshadowingScheme))),
          share(filters.toYesNo(filters.lookup(survey.hasTakenPAJE))),
        );
      }

      return formattedDiversityData;
    },
    formatLegalData(application) {
      const qualifications = application.qualifications.map(qualification => {
        return [
          filters.lookup(qualification.location),
          filters.lookup(qualification.type),
          filters.formatDate(qualification.date),
          qualification.membershipNumber,
        ].join(', ');
      }).join('\n');

      let judicialExperience;

      if (application.feePaidOrSalariedJudge) {
        judicialExperience = `Fee paid or salaried judge\n${filters.lookup(application.feePaidOrSalariedSittingDaysDetails)}`;
      } else if (application.declaredAppointmentInQuasiJudicialBody) {
        judicialExperience = `Quasi-judicial body\n${filters.lookup(application.quasiJudicialSittingDaysDetails)}`;
      } else {
        judicialExperience = `Acquired skills in other way\n${filters.lookup(application.skillsAquisitionDetails)}`;
      }

      return [
        qualifications,
        judicialExperience,
      ];
    },
    formatNonLegalData(application) {
      const organisations = {
        'chartered-association-of-building-engineers': 'charteredAssociationBuildingEngineers',
        'chartered-institute-of-building': 'charteredInstituteBuilding',
        'chartered-institute-of-environmental-health': 'charteredInstituteEnvironmentalHealth',
        'general-medical-council': 'generalMedicalCouncilDate',
        'royal-college-of-psychiatrists': 'royalCollegeOfPsychiatrist',
        'royal-institution-of-chartered-surveyors': 'royalInstitutionCharteredSurveyors',
        'royal-institute-of-british-architects': 'royalInstituteBritishArchitects',
        'other': 'otherProfessionalMemberships',
      };

      if (application.professionalMemberships) {
        const professionalMemberships = application.professionalMemberships.map(membership => {
          let formattedMembership;
          if (organisations[membership]) {
            const fieldName = organisations[membership];

            formattedMembership = `${filters.lookup(membership)}, ${filters.formatDate(application[`${fieldName}Date`])}, ${application[`${fieldName}Number`]}`;
          }

          if (application.memberships[membership]) {
            const otherMembershipLabel = this.exercise.otherMemberships.find(m => m.value === membership).label;

            formattedMembership = `${filters.lookup(otherMembershipLabel)}, ${filters.formatDate(application.memberships[membership].date)}, ${application.memberships[membership].number}`;
          }

          return formattedMembership;
        }).join('\n');

        return [
          professionalMemberships,
        ];
      } else {
        return [''];
      }
    },
    gatherReportData() {
      const headers = {
        personalDetails: [
          'Candidate Title',
          'Candidate Name',
          'Other Names',
          'Suffix',
          'Email address',
          'Date of Birth',
          'National Insurance Number',
          'Citizenship',
          'Current Address',
          'Previous addresses',
          'Telephone number',
        ],
        qualifications: {
          legal: [
            'Legal qualifications',
            'Judicial experience',
          ],
          'non-legal': [
            'Professional Memberships',
          ],
          leadership: [
            'Legal qualifications',
            'Judicial experience',
          ],
        },
        diversity: {
          common: [
            'Agreed to share Diversity',
            'Professional Background',
            'Previous roles',
            'School type',
            'Attended university',
            'Ethnicity',
            'Gender',
            'Sexual orientation',
            'Disability',
            'Religion or belief',
          ],
          legal: [
            'JAC Presentation',
            'Judicial workshadowing',
            'PAJE',
          ],
          'non-legal': [
            'JAC Presentation',
          ],
          'leadership-non-legal': [
            'JAC Presentation',
          ],
          leadership: [
            'JAC Presentation',
            'Judicial workshadowing',
            'PAJE',
          ],
        },
      };

      const reportData = this.applicationRecords.map(record => {
        const application = this.$store.getters['applications/getById'](record.application.id);

        let qualifications;
        if (this.exerciseType === 'legal' || this.exerciseType === 'leadership') {
          qualifications = this.formatLegalData(application);
        }
        if (this.exerciseType === 'non-legal') {
          qualifications = this.formatNonLegalData(application);
        }

        return [
          ...this.formatPersonalDetails(application.personalDetails),
          ...qualifications,
          ...this.formatDiversityData(application.equalityAndDiversitySurvey)];
      });

      const reportHeaders = [
        ...headers.personalDetails,
        ...headers.qualifications[this.exerciseType],
        ...headers.diversity.common,
        ...headers.diversity[this.exerciseType],
      ];

      return [
        reportHeaders,
        ...reportData,
      ];
    },
    async exportData() {
      // ensure we have applications for this exercise
      // TODO implement admin#1081 (or only fetch applications if we don't already have them)
      await this.$store.dispatch('applications/bind', {
        exerciseId: this.exercise.id,
        status: 'applied',
      });

      const title = 'Handover Report';
      const data = this.gatherReportData();

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
