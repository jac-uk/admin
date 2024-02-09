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
      Please create panels and allocate applications to those panels.
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
            <span class="govuk-caption-m">Not yet assigned to a panel</span>
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
        class="govuk-button govuk-!-margin-bottom-0"
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

    <!-- APPLICATIONS -->
    <div v-show="activeTab == 'applications'">
      <Table
        v-model:selection="selectedItems"
        data-key="id"
        :data="applicationsWithoutPanels"
        :columns="tableColumnsApplications"
        multi-select
        :page-size="50"
        :search="['candidate.fullName']"
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
import { beforeRouteEnter, btnNext } from '../helper';
import { getTaskSteps } from '@/helpers/exerciseHelper';
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
      return this.task ? this.task._stats.totalApplications : 0;
    },
    tabs() {
      const data = [];
      data.push({
        ref: 'panels',
        title: 'Panels',
      });
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
  },
  methods: {
    btnNext,
    async btnActivate() {
      const response = await functions.httpsCallable('updateTask')({
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
        // update panel with new ids
        await this.$store.dispatch('panel/addApplications', {
          panelId: data.panelId,
          type: this.type,
          applicationIds: this.selectedItems,
        });
        // update applicationRecords
        const updates = this.selectedItems.map(applicationId => {
          const update = {};
          update[`${this.type}.panelId`] = data.panelId;
          return { id: applicationId, data: update };
        });
        await this.$store.dispatch('candidateApplications/update', updates);
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
  },
};
</script>
