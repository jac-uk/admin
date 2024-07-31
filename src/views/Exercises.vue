<template>
  <div>
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-full">
        <div class="float-left">
          <h1
            v-if="isFavourites"
            class="govuk-heading-xl govuk-!-margin-bottom-4"
          >
            Favourite Exercises
          </h1>
          <h1
            v-else-if="isArchived"
            class="govuk-heading-xl govuk-!-margin-bottom-4"
          >
            Archived Exercises
          </h1>
          <h1
            v-else
            class="govuk-heading-xl govuk-!-margin-bottom-4"
          >
            Live Exercises
          </h1>
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
                type: 'singleCheckbox',
                field: 'state',
                inputLabel: 'Exclude Exercises in Draft status',
                fieldComparator: 'notEqual',
                value: 'draft',
              },
              {
                type: 'singleCheckbox',
                field: '_lateApplicationRequests',
                inputLabel: 'Exercises with late application requests',
                fieldComparator: 'arrayEmpty' // better to use `arrayEmpty` as we cannot use more than one '!=' filter
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
              <TableCell
                :title="tableColumns[0].title"
              >
                {{ row.referenceNumber }}
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
              <TableCell
                class="govuk-table__cell--numeric"
                :title="tableColumns[5].title"
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
        { title: 'Reference', sort: 'createdAt', direction: 'desc', default: true },
        { title: 'Name', sort: 'name' },
        { title: 'Open', sort: 'applicationOpenDate' },
        { title: 'Close', sort: 'applicationCloseDate' },
        { title: 'Status' },
        {
          title: 'Applications',
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
        data.rowLink = { name: 'exercise-dashboard', params: { id: row.id } };
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
  beforeUnmount() {
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
        status += this.getExerciseTimelineStage(exercise);
      }
      return status;
    },
    getExerciseTimelineStage(exercise) {
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
.govuk-table__cell a {
  text-decoration: none;
}
</style>
