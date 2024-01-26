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
      <ActionButton
        v-if="hasPermissions([
          PERMISSIONS.exercises.permissions.canReadExercises.value,
          PERMISSIONS.applicationRecords.permissions.canReadApplicationRecords.value,
          PERMISSIONS.applications.permissions.canReadApplications.value
        ])"
        type="primary"
        :action="exportData"
      >
        Download XLSX
      </ActionButton>
    </div>
  </div>
</template>

<script>
import { httpsCallable } from '@firebase/functions';
import BackLink from '@jac-uk/jac-kit/draftComponents/BackLink.vue';
import ActionButton from '@jac-uk/jac-kit/draftComponents/ActionButton.vue';
import { functions } from '@/firebase';
import { downloadXLSX } from '@jac-uk/jac-kit/helpers/export';
import permissionMixin from '@/permissionMixin';

export default {
  name: 'ExercisesExport',
  components: {
    BackLink,
    ActionButton,
  },
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
    async exportData() {
      try {
        const response = await httpsCallable(functions, 'exportExerciseData')({ exerciseIds: this.selectedItems });
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
        return true;
      } catch (error) {
        return;
      }
    },
  },
};
</script>
