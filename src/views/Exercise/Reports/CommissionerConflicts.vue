<template>
  <div class="govuk-grid-row">
    <div class="govuk-grid-column-two-thirds">
      <h1 class="govuk-heading-l">
        Commissioner Conflicts
      </h1>
    </div>
    <div class="govuk-grid-column-one-third text-right govuk-!-padding-bottom-7">
      <ActionButton
        v-if="hasPermissions([
          PERMISSIONS.exercises.permissions.canReadExercises.value,
          PERMISSIONS.applications.permissions.canReadApplications.value
        ])"
        class="govuk-!-margin-right-2"
        :action="exportToGoogleDoc"
      >
        Export to Word
      </ActionButton>
    </div>

    <div class="govuk-grid-column-full">
      <Table
        data-key="id"
        :data="applications"
        :columns="tableColumns"
        :search-map="$searchMap.applications"
        :page-size="50"
        @change="getTableData"
      >
        <template #row="{row}">
          <TableCell :title="tableColumns[0].title">
            <div class="govuk-grid-row">
              <div class="govuk-grid-column-two-thirds">
                <div class="candidate-name govuk-heading-m govuk-!-margin-bottom-0">
                  {{ row.personalDetails.fullName }}
                </div>
              </div>
              <div class="govuk-grid-column-one-third text-right">
                <RouterLink
                  :to="{name: 'exercise-application', params: { applicationId: row.id }}"
                  class="govuk-link print-none"
                >
                  View application
                </RouterLink>
              </div>
              <div
                v-if="row.additionalInfo && row.additionalInfo.commissionerConflicts"
                class="govuk-grid-column-full"
              >
                <div
                  v-for="(commissionerConflict, index) in getCommissionerConflicts(row)"
                  :key="index"
                  class="govuk-grid-row govuk-!-margin-0 govuk-!-margin-bottom-4 govuk-!-margin-left-3"
                >
                  <hr
                    v-if="index"
                    class="govuk-section-break govuk-section-break--m govuk-section-break--visible govuk-!-margin-top-2"
                  >
                  <div v-if="commissionerConflict.hasRelationship">
                    <p><b>Commissioner:</b> {{ commissionerConflict.name }}</p>
                    <p><b>Details:</b> {{ commissionerConflict.details }}</p>
                  </div>
                </div>
              </div>
            </div>
          </TableCell>
        </template>
      </Table>
    </div>
  </div>
</template>

<script>
import { httpsCallable } from '@firebase/functions';
import { functions } from '@/firebase';
import Table from '@jac-uk/jac-kit/components/Table/Table.vue';
import TableCell from '@jac-uk/jac-kit/components/Table/TableCell.vue';
import permissionMixin from '@/permissionMixin';
import ActionButton from '@jac-uk/jac-kit/draftComponents/ActionButton.vue';

export default {
  name: 'CommissionerConflicts',
  components: {
    Table,
    TableCell,
    ActionButton,
  },
  mixins: [permissionMixin],
  data () {
    return {
      tableColumns: [
        { title: 'Candidate', sort: '_sort.fullNameUC', default: true },
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
  },
  unmounted() {
    this.$store.dispatch('applications/unbind');
  },
  methods: {
    getTableData(params) {
      this.$store.dispatch(
        'applications/bind',
        {
          exerciseId: this.exercise.id,
          status: 'applied',
          ...params,
        }
      );
    },
    getCommissionerConflicts(application) {
      if (application.additionalInfo && application.additionalInfo.commissionerConflicts) {
        return application.additionalInfo.commissionerConflicts.filter(conflict => conflict.hasRelationship);
      }
      return [];
    },
    async exportToGoogleDoc() {
      if (!this.exercise) return;
      try {
        const res = await httpsCallable(functions, 'exportApplicationCommissionerConflicts')({ exerciseId: this.exercise.id, format: 'googledoc' });
        if (res.data.sourceContent) {
          this.export2Word(res.data.sourceContent, `${this.exercise.referenceNumber} ${this.exercise.name} - Commissioner Conflicts Report`);
          return true;
        }
        return;
      } catch (error) {
        return;
      }
    },
    export2Word(html, filename = '') {
      const blob = new Blob(['\ufeff', html], {
        type: 'application/msword',
      });

      // specify link url
      const url = `data:application/vnd.ms-word;charset=utf-8,${encodeURIComponent(html)}`;
      // specify file name
      filename = filename ? `${filename}.doc` : 'Commissioner Conflicts Report.doc';
      // create download link element
      const downloadLink = document.createElement('a');
      document.body.appendChild(downloadLink);

      if (navigator.msSaveOrOpenBlob ){
        navigator.msSaveOrOpenBlob(blob, filename);
      } else {
        downloadLink.href = url;
        downloadLink.download = filename;
        downloadLink.click();
      }

      document.body.removeChild(downloadLink);
    },
  },
};
</script>
