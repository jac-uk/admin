<template>
  <div>
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-one-half">
        <h1 class="govuk-heading-l govuk-!-margin-bottom-2">
          {{ $filters.lookup(type) }}
        </h1>
      </div>
      <div class="text-right govuk-grid-column-one-half">
        <FullScreenButton />
      </div>
    </div>

    <ProgressBar :steps="taskSteps" />

    <p
      v-if="hasApplicationsWithoutPanels"
      class="govuk-body govuk-!-margin-bottom-4"
    >
      Please create panels and assign applications to those panels.
    </p>
    <p
      v-else-if="hasPanelsWithoutPanellists"
      class="govuk-body govuk-!-margin-bottom-4"
    >
      Please ensure all panels have panellists.
    </p>
    <p
      v-else
      class="govuk-body govuk-!-margin-bottom-4"
    >
      You may now activate this {{ $filters.lookup(type) }}.
    </p>

    <!-- STATS -->
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-one-third">
        <div class="panel govuk-!-margin-bottom-6 govuk-!-padding-4 background-light-grey">
          <p class="govuk-body govuk-!-margin-bottom-0">
            Panels
            <span class="govuk-caption-m">Total</span>
          </p>
          <h2 class="govuk-heading-l govuk-!-padding-top-0 govuk-!-margin-bottom-0">
            {{ panels.length }}
          </h2>
        </div>
      </div>
      <div class="govuk-grid-column-one-third">
        <div class="panel govuk-!-margin-bottom-6 govuk-!-padding-4 background-light-grey">
          <p class="govuk-body govuk-!-margin-bottom-0">
            Applications
            <span class="govuk-caption-m">Total</span>
          </p>
          <h2 class="govuk-heading-l govuk-!-padding-top-0 govuk-!-margin-bottom-0">
            {{ totalApplications }}
          </h2>
        </div>
      </div>
      <div
        v-if="hasApplicationsWithoutPanels"
        class="govuk-grid-column-one-third"
      >
        <div class="panel govuk-!-margin-bottom-6 govuk-!-padding-4 background-light-grey">
          <p class="govuk-body govuk-!-margin-bottom-0">
            Applications
            <span class="govuk-caption-m">Not yet assigned</span>
          </p>
          <h2 class="govuk-heading-l govuk-!-padding-top-0 govuk-!-margin-bottom-0">
            {{ applicationsWithoutPanels.length }}
          </h2>
        </div>
      </div>
      <div
        v-else-if="hasPanelsWithoutPanellists"
        class="govuk-grid-column-one-third"
      >
        <div class="panel govuk-!-margin-bottom-6 govuk-!-padding-4 background-light-grey">
          <p class="govuk-body govuk-!-margin-bottom-0">
            Panels
            <span class="govuk-caption-m">Without panellists</span>
          </p>
          <h2 class="govuk-heading-l govuk-!-padding-top-0 govuk-!-margin-bottom-0">
            {{ panelsWithoutPanellists.length }}
          </h2>
        </div>
      </div>
      <div
        v-else
        class="govuk-grid-column-one-third"
      >
        <div class="panel govuk-!-margin-bottom-6 govuk-!-padding-4 background-light-grey">
          <p class="govuk-body govuk-!-margin-bottom-4">
            Next step
          </p>
          <ActionButton
            class="govuk-!-margin-bottom-1"
            type="primary"
            :action="btnActivate"
          >
            Activate
          </ActionButton>
        </div>
      </div>
    </div>
    <!-- END STATS -->

    <TabsList
      v-model:active-tab="activeTab"
      :tabs="tabs"
    />

    <!-- PANELS -->
    <div v-show="activeTab == 'panels'">
      <button
        class="govuk-button govuk-!-margin-bottom-4"
        @click="createNewPanel"
      >
        Create new panel
      </button>
      <Table
        data-key="id"
        :data="panels"
        :page-size="50"
        :columns="tableColumns"
        @change="getTableData"
      >
        <template #row="{row}">
          <TableCell :title="tableColumns[0].title">
            <RouterLink
              :to="{ name: `exercise-task-panel`, params: { type: type, panelId: row.id } }"
            >
              {{ row.name }}
            </RouterLink>
          </TableCell>
          <TableCell :title="tableColumns[1].title">
            {{ row.panellistIds ? row.panellistIds.length : 0 }}
          </TableCell>
          <TableCell :title="tableColumns[2].title">
            {{ row.applicationIds ? row.applicationIds.length : 0 }}
          </TableCell>
        </template>
      </Table>
    </div>
    <!-- // END PANELS -->

    <!-- SELECTION DAYS -->
    <div v-if="hasSelectionDayTimetable" v-show="activeTab == 'dates'">
      [ selection days ]
      {{ selectionDays }}
    </div>
    <!-- // END SELECTION DAYS -->

    <!-- TIMETABLE -->
    <div v-if="hasSelectionDayTimetable" v-show="activeTab == 'timetable'">
      <ActionButton
        type="primary"
        :disabled="false"
        :action="generateTimetable"
      >
        Generate timetable
      </ActionButton>

      <div v-if="hasTimetableMessage" class="govuk-inset-text govuk-!-margin-top-0">
        <p class="govuk-body">Useful information from the Generate Timetable function about why the timetable is not complete. Such as:</p>
        <ul class="govuk-list govuk-list--bullet">
          <li>There are more candidates than slots</li>
          <li>The following candidates are only available on one day</li>
          <li>The following candidates clash with every panellist</li>
          <li>The following dates are oversubscribed</li>
          <li>The following dates have no candidates</li>
          <li>The following panellists have conflicts with lots of candidates</li>
          <li>etc</li>
        </ul>
      </div>

      <div
        class="govuk-grid-row"
      >
        <div class="govuk-grid-column-one-half">
          <a
            class="govuk-link govuk-!-margin-right-4"
            @click="alert('Under construction :)')"
          >Find an application</a>
        </div>
        <div class="govuk-grid-column-one-half text-right">
          <a
            class="govuk-link"
            @click="alert('Under construction :)')"
          >Export</a>
          <a
            class="govuk-link govuk-!-margin-left-4"
            @click="alert('Under construction :)')"
          >Expand all</a>
        </div>
      </div>
      <Table
        :data="timetable"
        dataKey="date"
        :columns="tableColumnsTimetable"
        :page-size="500"
        local-data
      >
        <template #row="{row, rowIndex}">
          <TableCell :title="tableColumnsTimetable[0].title">
            <RouterLink
              :to="{ name: `exercise-task-panel`, params: { type: type, panelId: row.id } }"
            >
              {{ row.name }}
            </RouterLink>
          </TableCell>
          <TableCell :title="tableColumnsTimetable[1].title">
            {{ $filters.formatDate(row.date) }}
          </TableCell>
          <TableCell :title="tableColumnsTimetable[2].title">
            {{ row.location }}
          </TableCell>
          <TableCell :title="tableColumnsTimetable[3].title">
            {{ row.totalSlots }}
          </TableCell>
          <TableCell :title="tableColumnsTimetable[4].title">
            {{ row.applicationIds ? row.applicationIds.length : 0 }}
          </TableCell>
        </template>
      </Table>
    </div>
    <!-- // END TIMETABLE -->

    <!-- APPLICATIONS -->
    <div v-show="activeTab == 'applications'">
      <Table
        v-model:selection="selectedItems"
        data-key="id"
        :data="applicationsWithoutPanels"
        :columns="tableColumnsApplications"
        multi-select
        :page-size="50"
        :search-map="$searchMap.applicationRecords"
        @change="getTableDataApplications"
      >
        <template #actions>
          <button
            class="govuk-button moj-button-menu__item moj-page-header-actions__action govuk-!-margin-right-2"
            :disabled="!selectedItems.length"
            @click="$refs['setPanelModal'].openModal()"
          >
            Set Panel
          </button>
        </template>

        <template #row="{row}">
          <TableCell :title="tableColumnsApplications[0].title">
            <RouterLink
              :to="{ name: 'exercise-application', params: { applicationId: row.id } }"
            >
              {{ row.application.referenceNumber }}
            </RouterLink>
          </TableCell>
          <TableCell :title="tableColumnsApplications[1].title">
            <RouterLink
              :to="{ name: 'candidates-view', params: { id: row.candidate.id } }"
            >
              {{ row.candidate.fullName }}
            </RouterLink>
          </TableCell>
          <TableCell :title="tableColumnsApplications[2].title">
            {{ getPanelName(row) }}
          </TableCell>
        </template>
      </Table>
    </div>
    <!-- // END APPLICATIONS -->

    <Modal ref="setPanelModal">
      <TitleBar>
        Set panel
      </TitleBar>
      <SelectPanel
        class="govuk-!-margin-6"
        :panels="panels"
        @save="selectPanel"
        @cancel="$refs['setPanelModal'].closeModal()"
      />
    </Modal>
  </div>
</template>

<script>
import { httpsCallable } from '@firebase/functions';
import { beforeRouteEnter, btnNext } from '../helper';
import { getTaskSteps, TASK_TYPE } from '@/helpers/exerciseHelper';
import FullScreenButton from '@/components/Page/FullScreenButton.vue';
import ProgressBar from '@/components/Page/ProgressBar.vue';
import Table from '@jac-uk/jac-kit/components/Table/Table.vue';
import TableCell from '@jac-uk/jac-kit/components/Table/TableCell.vue';
import TabsList from '@jac-uk/jac-kit/draftComponents/TabsList.vue';
import Modal from '@jac-uk/jac-kit/components/Modal/Modal.vue';
import TitleBar from '@/components/Page/TitleBar.vue';
import SelectPanel from '../Panel/components/SelectPanel.vue';
import ActionButton from '@jac-uk/jac-kit/draftComponents/ActionButton.vue';
import { functions } from '@/firebase';
import { totalApplications } from '../Finalised/meritListHelper';

export default {
  components: {
    Table,
    TableCell,
    TabsList,
    Modal,
    TitleBar,
    SelectPanel,
    ActionButton,
    FullScreenButton,
    ProgressBar,
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
      activeTab: 'panels',
      panelsLoaded: false,
      selectedItems: [],
      tableColumns: [
        { title: 'Name', sort: 'name', direction: 'asc', default: true },
        { title: 'Panellists' },
        { title: 'Applications' },
      ],
      tableColumnsApplications: [
        { title: 'Reference number' },
        { title: 'Name', sort: 'candidate.fullName', default: true },
        { title: 'Panel' },
      ],
      tableColumnsTimetable: [
        { title: 'Panel' },
        { title: 'Date' },
        { title: 'Location' },
        { title: 'Number of slots' },
        { title: 'Applications' },
      ],
      hasTimetableMessage: false,
    };
  },
  computed: {
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    task() {
      return this.$store.getters['tasks/getTask'](this.type);
    },
    taskSteps() {
      const steps = getTaskSteps(this.exercise, this.type, this.task);
      return steps;
    },
    totalApplications() {
      let total = 0;
      if (!this.task) return total;
      if (!this.panels) {
        return totalApplications(this.task);
      }
      this.panels.forEach(panel => {
        if (panel.applicationIds) total += panel.applicationIds.length;
      });
      if (this.hasApplicationsWithoutPanels) total += this.applicationsWithoutPanels.length;
      return total;
    },
    tabs() {
      const data = [];
      data.push({
        ref: 'panels',
        title: 'Panels',
      });
      if (this.hasSelectionDayTimetable) {
        // data.push({
        //   ref: 'dates',
        //   title: 'Selection Days',
        // });
        data.push({
          ref: 'timetable',
          title: 'Timetable',
        });
      }
      if (this.hasApplicationsWithoutPanels) {
        data.push({
          ref: 'applications',
          title: 'Applications - to be assigned',
        });
      }
      return data;
    },
    panels() {
      return this.$store.state.panels.records;
    },
    panelIds() {
      return this.panels.map(panel => panel.id);
    },
    applicationsWithoutPanels() {
      return this.$store.state.panels.applicationsWithoutPanels;
    },
    hasApplicationsWithoutPanels() {
      return this.applicationsWithoutPanels.length > 0;
    },
    panelsWithoutPanellists() {
      return this.panels.filter(panel => !(panel.panellistIds && panel.panellistIds.length > 0));
    },
    hasPanelsWithoutPanellists() {
      return this.panelsWithoutPanellists.length > 0;
    },
    selectedApplications() {
      if (!this.selectedItems.length) return null;
      return this.applicationsWithoutPanels.filter(application => this.selectedItems.indexOf(application.id) >= 0);
    },
    hasSelectionDayTimetable() {
      return this.task.type === TASK_TYPE.SELECTION_DAY && this.task._preSelectionDayQuestionnaire;
    },
    selectionDays() {
      if (this.hasSelectionDayTimetable) {
        const form = this.$store.getters['candidateForm/data']();
        if (form) {
          return form.candidateAvailabilityDates;
        }
      }
      return null;
    },
    timetable() {
      const data = [];
      this.panels.forEach(panel => {
        panel.timetable.forEach(item => {
          if (item.totalSlots > 0) {
            data.push({ id: panel.id, name: panel.name, ...item });
          }
        });
      });
      return data;
    },
  },
  async created() {
    if (this.hasSelectionDayTimetable) {
      await this.$store.dispatch('candidateForm/bind', this.task._preSelectionDayQuestionnaire.formId);
    }
  },
  methods: {
    btnNext,
    async btnActivate() {
      const response = await httpsCallable(functions, 'updateTask')({
        exerciseId: this.exercise.id,
        type: this.type,
      });
      if (response && response.data && response.data.success) {
        this.btnNext();
      }
    },
    getTableData(params) {
      this.$store.dispatch(
        'panels/bind',
        {
          exerciseId: this.exercise.id,
          type: this.type,
          ...params,
        }
      );
    },
    getTableDataApplications(params) {
      this.$store.dispatch(
        'panels/bindApplicationsWithoutPanels',
        {
          exerciseId: this.exercise.id,
          type: this.type,
          status: this.task.applicationEntryStatus,
          ...params,
        }
      );
    },
    getPanelName(application) {
      if (!application[this.type]) { return ''; }
      const panelId = application[this.type].panelId;
      if (!panelId) { return ''; }
      const panel = this.panels.find(p => p.id === panelId);
      return panel ? panel.name : '';
    },
    async updateStatus(panelId, applicationId, status) {
      const saveData = {
        outcome: {},
      };
      saveData.outcome[applicationId] = status;
      await this.$store.dispatch('panel/update', { id: panelId, data: saveData } );
    },
    createNewPanel() {
      this.$router.push({ name: 'exercise-task-panel-new' });
    },
    async selectPanel(data) {
      if (data && data.panelId) {
        let panelId = data.panelId;
        let panel, date, location, timetable;
        if (this.hasSelectionDayTimetable) {
          const parts = data.panelId.split('__');
          console.log('parts', parts);
          panelId = parts[0];
          date = parts[1];
          location = parts[2];
          panel = this.$store.getters['panels/getPanel'](panelId);
          console.log('panel', panel);
          timetable = panel.timetable;
          timetable.forEach(item => {
            if (item.date == date && item.location === location) {
              if (!item.applicationIds) item.applicationIds = [];
              item.applicationIds = [ ...new Set(item.applicationIds.concat(this.selectedItems)) ];
            }
          });
          console.log('timetable', timetable);
        }
        // update panel with new ids
        await this.$store.dispatch('panel/addApplications', {
          panelId: panelId,
          type: this.type,
          applicationIds: this.selectedItems,
          applicationRecords: this.selectedApplications,
          timetable,
        });
        this.selectedItems = [];
      }
      this.$refs['setPanelModal'].closeModal();
      if (this.hasApplicationsWithoutPanels < 1) {
        if (this.hasStats) {
          this.activeTab = 'overview';
        } else {
          this.activeTab = 'panels';
        }
      }
    },
    async generateTimetable() {
      return new Promise((resolve) => {
        setTimeout(() => {
          this.hasTimetableMessage = true;
          resolve(true);
        }, 3000);
      });
    },
    alert(message) {
      window.alert(message);
    },
  },
};
</script>
