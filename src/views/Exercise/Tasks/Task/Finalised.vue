<template>
  <div>
    <h1 class="govuk-heading-l">
      {{ type | lookup }}
    </h1>

    <p v-if="hasApplicationsWithoutStatus" class="govuk-body-l">Please choose a status for each application.</p>
    <p v-else class="govuk-body-l">{{ type | lookup }} can now be completed. All applications will be assigned their new status.</p>

    <!-- STATS -->
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-one-half">
        <div class="panel govuk-!-margin-bottom-6 govuk-!-padding-4 background-light-grey">
          <p class="govuk-body govuk-!-margin-bottom-0">
            Applications
            <span class="govuk-caption-m">Total</span>
          </p>
          <h2 class="govuk-heading-l govuk-!-padding-top-0 govuk-!-margin-bottom-0">
            {{ task._stats.totalApplications }}
          </h2>
        </div>
      </div>
      <div
        v-if="hasApplicationsWithoutStatus"
        class="govuk-grid-column-one-half"
      >
        <div class="panel govuk-!-margin-bottom-6 govuk-!-padding-4 background-light-grey">
          <p class="govuk-body govuk-!-margin-bottom-0">
            Applications
            <span class="govuk-caption-m">Status not yet assigned</span>
          </p>
          <h2 class="govuk-heading-l govuk-!-padding-top-0 govuk-!-margin-bottom-0">
            {{ totalApplicationsWithoutStatus }}
          </h2>
        </div>
      </div>
      <div
        v-else
        class="govuk-grid-column-one-half"
      >
        <div class="panel govuk-!-margin-bottom-6 govuk-!-padding-4 background-light-grey">
          <p class="govuk-body govuk-!-margin-bottom-4">
            Next step
          </p>
          <ActionButton
            class="govuk-!-margin-bottom-1"
            type="primary"
            @click="btnComplete"
          >
            Complete {{ type | lookup }}
          </ActionButton>
        </div>
      </div>
    </div>
    <!-- END STATS -->

    <TabsList
      :tabs="tabs"
      :active-tab.sync="activeTab"
    />

    <!-- START: OVERVIEW -->
    <div v-show="activeTab == 'overview'">

      <!-- START: STATUS -->
      <div
        class="govuk-grid-row"
      >
        <div
          v-if="statusTotals"
          class="govuk-grid-column-one-half"
        >
          <div class="panel govuk-!-margin-bottom-6 govuk-!-padding-4 background-light-grey">
            <p class="govuk-body govuk-!-margin-bottom-2">
              Status after sift
            </p>
            <Table
              data-key="id"
              :data="Object.entries(statusTotals)"
              :columns="[{ title: 'Status' }, { title: 'Total' }]"
              local-data
            >
              <template #row="{row}">
                <TableCell>
                  {{ row[0] | lookup }}
                </TableCell>
                <TableCell>
                  {{ row[1] }}
                </TableCell>
              </template>
            </Table>
          </div>
        </div>
      </div>
      <!-- END: STATUS -->

    </div>
    <!-- END: OVERVIEW -->

    <!-- START: SCORE SHEET -->
    <div v-show="activeTab == 'scoreSheet'">
      <Table
        ref="scoreSheet"
        data-key="id"
        :data="scoreSheetRows"
        :columns="scoreSheetColumns"
        :page-size="500"
        local-data
        class="merit-list"
      >
        <template #header v-if="isSelection">
          <tr class="govuk-table__row">
            <th scope="col" class="govuk-table__header table-cell-application"></th>
            <th
              v-for="category in selectionCategories"
              :key="category"
              scope="col"
              :colspan="capabilities.length"
              class="govuk-table__header text-center"
            >
              {{ category | lookup }}
            </th>
            <th scope="col" class="govuk-table__header text-center"></th>
            <th scope="col" class="govuk-table__header text-center"></th>
          </tr>
        </template>
        <template #row="{row}">
          <TableCell class="table-cell-application">
            {{ row.referenceNumber }}
          </TableCell>

          <template v-if="isSift">
            <TableCell
              v-for="(cap, index) in capabilities"
              :key="`sift_${index}`"
              class="text-center table-cell-score"
            >
              {{ row.scoreSheet[cap] }}
            </TableCell>
          </template>

          <template v-if="isSelection">
            <template
              v-for="category in selectionCategories"
            >
              <TableCell
                v-for="(cap, index) in capabilities"
                :key="`${category}_${index}`"
                class="text-center table-cell-score"
              >
                <span v-if="row.scoreSheet[category]">
                  {{ row.scoreSheet[category][cap] }}
                </span>
              </TableCell>
            </template>
          </template>

          <TableCell class="text-right">
            {{ row.totalScore }}
          </TableCell>
          <TableCell class="govuk-!-padding-0 v-top">
            <Select
              :id="`status-${row.id}`"
              class="govuk-!-margin-bottom-0"
              :value="(task.outcome && task.outcome[row.id]) || ''"
              @input="updateStatus(row.id, $event)"
            >
              <option
                v-for="status in statuses"
                :key="status"
                :value="status"
              >
                {{ status | lookup }}
              </option>
            </Select>
          </TableCell>

        </template>
      </Table>
    </div>
    <!-- END: SCORE SHEET -->

  </div>
</template>

<script>
import { beforeRouteEnter, btnNext } from './helper';
import Table from '@jac-uk/jac-kit/components/Table/Table';
import TableCell from '@jac-uk/jac-kit/components/Table/TableCell';
import TabsList from '@jac-uk/jac-kit/draftComponents/TabsList';
import Select from '@jac-uk/jac-kit/draftComponents/Form/Select';
import ActionButton from '@jac-uk/jac-kit/draftComponents/ActionButton';
import { SHORTLISTING } from '@jac-uk/jac-kit/helpers/constants';
import { PANEL_TYPES } from './Panel/Constants';
import { CAPABILITIES, SELECTION_CATEGORIES } from '@/helpers/exerciseHelper';
import { functions } from '@/firebase';

export default {
  components: {
    Table,
    TableCell,
    TabsList,
    Select,
    ActionButton,
  },
  beforeRouteEnter: beforeRouteEnter,
  props: {
    type: {
      required: true,
      type: String,
    },
  },
  data() {
    return {
      activeTab: 'overview',
    };
  },
  computed: {
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    tabs() {
      const data = [];
      data.push({
        ref: 'overview',
        title: 'Overview',
      });
      data.push({
        ref: 'scoreSheet',
        title: 'Scores',
      });
      return data;
    },
    isSift() {
      return this.type === PANEL_TYPES.SIFT;
    },
    isSelection() {
      return this.type === PANEL_TYPES.SELECTION;
    },
    task() {
      return this.$store.getters['tasks/getTask'](this.type);
    },
    panels() {
      if (!this.task) return [];
      const allPanels = this.$store.state.panels.records || [];
      return allPanels
        .filter(panel => this.task.panelIds.indexOf(panel.id) >= 0)
        .sort((a, b) => {
          if (a.name > b.name) return 1;
          else if (a.name === b.name) return 0;
          else return -1;
        });
    },
    capabilities() {
      if (!this.task) return [];
      return CAPABILITIES.filter(cap => this.task.capabilities.indexOf(cap) >= 0);  // Using CAPABILITIES to ensure display order of selected capabilities
    },
    selectionCategories() {
      if (!this.task) return [];
      return SELECTION_CATEGORIES.filter(cap => this.task.selectionCategories.indexOf(cap) >= 0); // Using SELECTION_CATEGORIES to ensure display order
    },
    grades() {
      return this.task ? this.task.grades : [];
    },
    statuses() {
      switch (this.type) {
      case PANEL_TYPES.SIFT:
        return this.$store.getters['stageReview/availableStatuses'](SHORTLISTING.NAME_BLIND_PAPER_SIFT, []);
      case PANEL_TYPES.SELECTION:
        return this.$store.getters['stageSelected/availableStatuses'];
      default:
        return [];
      }
    },
    scoreSheetRows() {
      return this.task.finalScores.map(row => {
        return {
          id: row.id,
          referenceNumber: row.ref,
          scoreSheet: row.scoreSheet,
          totalScore: row.score,
          // panel: {
          //   id: row.panelId,
          //   name: this.panels.find(p => p.id === row.panelId).name,
          // },
        };
      }).sort((a, b) => b.totalScore - a.totalScore);
    },
    scoreSheetColumns() {
      const columns = [];
      columns.push({ title: 'Application', class: 'table-cell-application' });
      if (this.isSift) {
        this.capabilities.forEach(cap => columns.push({ title: cap, class: 'text-center table-cell-score' }));
      }
      if (this.isSelection) {
        this.selectionCategories.forEach(() => this.capabilities.forEach(cap => columns.push({ title: cap, class: 'text-center table-cell-score' })));
      }
      columns.push({ title: 'Score', class: 'text-center table-cell-score' });
      columns.push({ title: 'Status', class: 'text-center' });
      // columns.push({ title: 'Report', class: 'text-center' });
      return columns;
    },
    statusTotals() {
      const data = {};
      this.statuses.forEach(status => data[status] = 0);
      if (this.task.outcome) {
        Object.values(this.task.outcome).forEach(value => data[value]++);
      }
      return data;
    },
    totalApplicationsWithStatus() {
      if (!this.task) return 0;
      if (!this.task.outcome) return 0;
      const applicationIdsWithStatus = Object.keys(this.task.outcome);
      return applicationIdsWithStatus.length;
    },
    totalApplicationsWithoutStatus() {
      return this.task._stats.totalApplications - this.totalApplicationsWithStatus;
    },
    hasApplicationsWithoutStatus() {
      return this.totalApplicationsWithoutStatus !== 0;
    },
  },
  created() {
    this.$store.dispatch(
      'panels/bind',
      {
        exerciseId: this.exercise.id,
        type: this.type,
      }
    );
  },
  methods: {
    btnNext,
    async btnComplete() {
      await functions.httpsCallable('completeTask')({
        exerciseId: this.exercise.id,
        type: this.type,
      });
      this.btnNext();
    },
    async updateStatus(applicationId, status) {
      const saveData = {};
      saveData[`outcome.${applicationId}`] = status;
      await this.$store.dispatch('task/update', { exerciseId: this.exercise.id, type: this.type, data: saveData } );
    },
  },
};
</script>
