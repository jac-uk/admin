<template>
  <div class="govuk-grid-row">
    <div class="govuk-grid-column-full">
      <BackLink />
      <h1
        class="govuk-heading-l"
      >
        Export Exercise Data
      </h1>
      <p>Exercises selected: {{ selectedItems.length }}</p>
      <form @submit.prevent="validateAndSave">
        <ErrorSummary
          :errors="errors"
        />
        <button
          v-if="hasPermissions([
            PERMISSIONS.exercises.permissions.canReadExercises.value,
            PERMISSIONS.applicationRecords.permissions.canReadApplicationRecords.value,
            PERMISSIONS.applications.permissions.canReadApplications.value
          ])"
          class="govuk-button"
        >
          Download XLSX
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import Form from '@jac-uk/jac-kit/draftComponents/Form/Form';
import ErrorSummary from '@jac-uk/jac-kit/draftComponents/Form/ErrorSummary';
import BackLink from '@jac-uk/jac-kit/draftComponents/BackLink';
import { functions } from '@/firebase';
import { downloadXLSX } from '@jac-uk/jac-kit/helpers/export';
import permissionMixin from '@/permissionMixin';

export default {
  name: 'ExercisesExport',
  components: {
    ErrorSummary,
    BackLink,
  },
  extends: Form,
  mixins: [permissionMixin],
  computed: {
    selectedItems() {
      return this.$store.state.exerciseCollection.selectedItems;
    },
  },
  created() {
    if (this.selectedItems.length === 0) {
      this.$router.push({ name: 'exercises' });
    }
  },
  methods: {
    async save() {
      const response = await functions.httpsCallable('exportExerciseData')({ exerciseIds: this.selectedItems });
      const data = response.data;
      const xlsxData = [];
      for (let i = 0, len = data.rows.length; i < len; ++i) {
        const row = [];
        for (let j = 0, lenJ = data.columns.length; j < lenJ; ++j) {
          row.push(data.rows[i][data.columns[j].ref]);
        }
        xlsxData.push(row);
      }
      const xlsxHeaders = data.columns.map(column => column.title);
      xlsxData.unshift(xlsxHeaders);
      downloadXLSX(
        xlsxData,
        {
          title: 'Exercise export',
          sheetName: 'Exercise data',
          fileName: 'exercise-data.xlsx',
        }
      );
    },
  },
};
</script>
