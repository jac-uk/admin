<template>
  <div>
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-full">
        <div class="float-left">
          <h1
            v-if="isFavourites"
            class="govuk-heading-xl govuk-!-margin-bottom-4"
          >
            Favourite exercises
          </h1>
          <h1
            v-else-if="isArchived"
            class="govuk-heading-xl govuk-!-margin-bottom-4"
          >
            Archived exercises
          </h1>
          <h1
            v-else
            class="govuk-heading-xl govuk-!-margin-bottom-4"
          >
            Live exercises
          </h1>
        </div>
        <div class="text-right print-none">
          <button
            v-if="isFavourites"
            class="govuk-button govuk-button--secondary govuk-!-margin-right-3 govuk-!-margin-bottom-0"
            @click="showAll"
          >
            View live exercises
          </button>
          <button
            v-else
            class="govuk-button govuk-button--secondary govuk-!-margin-right-3 govuk-!-margin-bottom-0"
            @click="showMyFavourites"
          >
            Show my favourites
          </button>
          <button
            v-if="isArchived"
            class="govuk-button govuk-button--secondary govuk-!-margin-right-3 govuk-!-margin-bottom-0"
            @click="showAll"
          >
            View live exercises
          </button>
          <button
            v-else
            class="govuk-button govuk-button--secondary govuk-!-margin-right-3 govuk-!-margin-bottom-0"
            @click="showArchived"
          >
            View archived exercises
          </button>
          <router-link
            v-if="hasPermissions([PERMISSIONS.exercises.permissions.canCreateExercises.value])"
            ref="linkToNewExercise"
            to="/create-exercise"
            class="govuk-button govuk-!-margin-bottom-0"
          >
            Create an exercise
          </router-link>
        </div>
      </div>
    </div>
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-full">
        <form
          class="exercises-table"
          @submit.prevent="checkForm"
        >
          <Table
            ref="exercisesTable"
            v-model:selection="selectedItems"
            data-key="id"
            :data="tableData"
            :page-size="50"
            :columns="tableColumns"
            :filters="[
              {
                type: 'dateRange',
                field: 'applicationOpenDate',
                title: 'Open date',
              },
              {
                title: 'Approval',
                field: '_approval.status',
                type: 'radio',
                options: ['None', 'Approved', 'Rejected', 'Requested'],
                emptyOption: 'None',
                defaultValue: 'None',
              },
              {
                type: 'singleCheckbox',
                field: '_lateApplicationRequests',
                inputLabel: 'Exercises with late application requests',
                fieldComparator: 'arrayNotEmpty'
              },
            ]"
            :search-map="$searchMap.exercises"
            multi-select
            @change="getTableData"
          >
            <template #actions>
              <button
                class="govuk-button moj-button-menu__item moj-page-header-actions__action govuk-!-margin-right-2 govuk-!-margin-bottom-3"
                :disabled="isButtonDisabled"
              >
                Export data
              </button>
            </template>
            <template #row="{row}">
              <TableCell :title="tableColumns[0].title">
                <RouterLink
                  :to="{ name: 'exercise-dashboard', params: { id: row.id } }"
                >
                  {{ row.referenceNumber }}
                </RouterLink>
              </TableCell>
              <TableCell :title="tableColumns[1].title">
                <RouterLink
                  :to="{ name: 'exercise-dashboard', params: { id: row.id } }"
                >
                  {{ row.name }}
                </RouterLink>
              </TableCell>
              <TableCell :title="tableColumns[2].title">
                <RouterLink
                  :to="{ name: 'exercise-dashboard', params: { id: row.id } }"
                >
                  {{ $filters.formatDate(row.applicationOpenDate) }}
                </RouterLink>
              </TableCell>
              <TableCell :title="tableColumns[3].title">
                <RouterLink
                  :to="{ name: 'exercise-dashboard', params: { id: row.id } }"
                >
                  {{ $filters.formatDate(row.applicationCloseDate) }}
                </RouterLink>
              </TableCell>
              <TableCell :title="tableColumns[4].title">
                {{ getExerciseStatus(row) }}
              </TableCell>
              <TableCell :title="tableColumns[5].title">
                {{ getExerciseStage(row) }}
              </TableCell>
              <TableCell
                class="govuk-table__cell--numeric"
                :title="tableColumns[6].title"
              >
                {{ $filters.formatNumber(row.applicationsCount) }}
              </TableCell>
            </template>
          </Table>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Table from '@jac-uk/jac-kit/components/Table/Table.vue';
import TableCell from '@jac-uk/jac-kit/components/Table/TableCell.vue';
import permissionMixin from '@/permissionMixin';
import createTimeline from '@jac-uk/jac-kit/helpers/Timeline/createTimeline';
import exerciseTimeline from '@jac-uk/jac-kit/helpers/Timeline/exerciseTimeline';

export default {
  name: 'Exercises',
  components: {
    Table,
    TableCell,
  },
  mixins: [permissionMixin],
  data() {
    return {
      tableColumns: [
        { title: 'Reference number', sort: 'referenceNumber', direction: 'desc', default: true },
        { title: 'Name', sort: 'name' },
        { title: 'Open date', sort: 'applicationOpenDate' },
        { title: 'Close date', sort: 'applicationCloseDate' },
        { title: 'Status' },
        { title: 'Stage' },
        {
          title: 'Submitted Applications',
          sort: '_applications.applied',
          class: 'govuk-table__header--numeric',
        },
      ],
    };
  },
  computed: {
    ...mapState('exerciseCollection', [
      'records',
      'isFavourites',
      'isArchived',
    ]),
    selectedItems: {
      get: function() {
        return this.$store.state.exerciseCollection.selectedItems;
      },
      set: function(val) {
        this.$store.commit('exerciseCollection/setSelectedItems', val);
      },
    },
    isButtonDisabled() {
      const hasSelection = this.selectedItems && this.selectedItems.length;
      return !hasSelection;
    },
    tableData() {
      return this.records.map(row => {
        const data = { ...row };
        data.id = row.id;
        data.applicationsCount = (row._applications && row._applications.applied) || 0;
        return data;
      });
    },
  },
  watch: {
    isFavourites() {
      this.reloadTable();
    },
    isArchived() {
      this.reloadTable();
    },
  },
  unmounted() {
    this.$store.dispatch('exerciseCollection/unbind');
  },
  methods: {
    showMyFavourites() {
      this.$store.dispatch('exerciseCollection/showFavourites');
    },
    showAll() {
      this.$store.dispatch('exerciseCollection/showAll');
    },
    showArchived() {
      this.$store.dispatch('exerciseCollection/showArchived');
    },
    getTableData(params) {
      this.$store.dispatch(
        'exerciseCollection/bind',
        params
      );
    },
    reloadTable() {
      if (this.$refs['exercisesTable']) {
        this.$refs['exercisesTable'].reload();
      }
    },
    checkForm() {
      this.$store.dispatch('exerciseCollection/storeItems', { items: this.selectedItems });
      this.$router.push({ name: 'exercises-export' });
    },
    getExerciseStatus(exercise) {
      let status = '';

      if (exercise.state === 'archived') {
        status += 'Archived';
      } else if (exercise.state === 'draft') {
        status += 'Draft';
      } else {
        status += 'Live';
      }
      return status;
    },
    getExerciseStage(exercise) {
      let timeItemToShow = 0;
      const timeline = createTimeline(exerciseTimeline(exercise));
      if (timeline) {
        timeline.forEach((time, index) => {
          if (time.date <= Date.now()) {
            timeItemToShow = index;
          }
        });
      }
      return timeline[timeItemToShow]?.entry || '';
    },
  },
};
</script>

<style>
.exercises-table input[type="search"] {
  margin-left: 3px;
}
</style>
