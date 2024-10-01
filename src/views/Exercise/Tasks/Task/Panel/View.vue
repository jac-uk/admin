<template>
  <div
    v-if="panel"
    class="panels-packs"
  >
    <div id="panel-pack-div">
      <div class="govuk-grid-row">
        <div class="govuk-grid-column-one-half">
          <router-link
            class="govuk-back-link govuk-!-margin-top-0"
            :to="{ name: 'exercise-task-panelsInitialised' }"
          >
            Back
          </router-link>          
          <span class="govuk-caption-l">Panel</span>
          <h1 class="govuk-heading-l govuk-!-margin-bottom-4">
            {{ panel.name }}
          </h1>
        </div>
        <div class="govuk-grid-column-one-half text-right print-none">
          <ActionButton
            type="primary"
            :disabled="!canExportToGoogleDrive"
            :action="exportToGoogleDrive"
          >
            Export to google drive
          </ActionButton>
        </div>
      </div>
      <div class="govuk-grid-row">
        <div class="govuk-grid-column-one-third">
          <div class="panel govuk-!-margin-bottom-6 govuk-!-padding-4 background-light-grey">
            <span class="govuk-caption-m">Status</span>
            <h2 class="govuk-heading-m govuk-!-margin-bottom-0">
              {{ panel.status }}
              <span v-if="isProcessing">
                {{ processingProgress }} of {{ processingTotal }}
              </span>
            </h2>
          </div>
        </div>

        <div class="govuk-grid-column-one-third">
          <div class="panel govuk-!-margin-bottom-6 govuk-!-padding-4 background-light-grey">
            <span class="govuk-caption-m">{{ $filters.lookup(type) }} Dates</span>
            <h2
              class="govuk-heading-m govuk-!-margin-bottom-0"
            >
              {{ $filters.showAlternative($filters.formatDate(panel.dateFrom), "Unknown") }} -
              {{ $filters.showAlternative($filters.formatDate(panel.dateTo), "Unknown") }}
            </h2>
          </div>
        </div>

        <div class="govuk-grid-column-one-third">
          <div class="panel govuk-!-margin-bottom-6 govuk-!-padding-4 background-light-grey">
            <div class="govuk-caption-m">
              Applications
            </div>
            <h2
              class="govuk-heading-m govuk-!-margin-bottom-0"
            >
              {{ applications.length }}
            </h2>
          </div>
        </div>
      </div>
      <TabsList
        v-model:active-tab="activeTab"
        :tabs="tabs"
      />
    </div>

    <div
      v-if="panel.scoreSheet"
      v-show="activeTab == 'scoreSheet'"
    >
      <ScoreSheet
        ref="scoreSheet"
        data-key="id"
        :marking-scheme="panel.markingScheme"
        :data="scoreSheetData"
        :columns-before="[{ title: 'Application', ref: 'referenceNumber', class: 'table-cell-application' }]"
        :editable="canEditScoreSheet"
        :moderation="isModerationRequired"
        :tools="scoreSheetTools"
      >
        <template #columns-before="{row}">
          <TableCell
            class="table-cell-application nowrap sticky-left"
            :class="{ 'highlight': row.highlight }"
          >
            {{ row.referenceNumber }}
          </TableCell>
        </template>
      </ScoreSheet>      
    </div>

    <!-- APPLICATIONS LIST -->
    <div v-show="activeTab == 'applications'">
      <button
        class="govuk-button govuk-!-margin-bottom-4"
        :disabled="isButtonDisabled"
        @click="removeFromPanel"
      >
        Remove from panel
      </button>
      <Table
        v-model:selection="selectedItems"
        data-key="id"
        :data="applications"
        :columns="tableColumnsApplications"
        multi-select
        :page-size="500"
        @change="getTableDataApplications"
      >
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
        </template>
      </Table>
    </div>
    <!-- //  END APPLICATIONS LIST -->

    <!-- PANELLISTS -->
    <div v-if="activeTab === 'panellists'">
      <div class="text-right govuk-!-margin-bottom-4">
        <a
          v-if="isEditingPanellists"
          class="govuk-link print-none"
          href
          @click.prevent="viewPanellists"
        >
          View panellists
        </a>
        <a
          v-else
          class="govuk-link print-none"
          href
          @click.prevent="editPanellists"
        >
          Update panellists
        </a>
      </div>
      <EditPanellists
        v-if="isEditingPanellists"
        :panel="panel"
        :panellists="panellists"
        :roles="roles"
        @save="savePanellists"
        @cancel="isEditingPanellists = false"
      />
      <ViewPanellists
        v-else
        :panel="panel"
        :panellists="panellists"
        :roles="roles"
      />
    </div>
    <!-- END PANELLISTS -->

    <!-- EDIT PANEL -->
    <div
      v-if="activeTab === 'edit'"
      class="govuk-grid-row"
    >
      <div class="govuk-grid-column-two-thirds">
        <PanelForm
          :id="panelId"
          :data="panel"
          @save="savePanel"
          @cancel="activeTab = 'applications'"
          @delete="deletePanel"
        />
      </div>
    </div>
    <!-- //  END EDIT PANEL -->
  </div>
</template>

<script>
import { serverTimestamp } from '@firebase/firestore';
import Table from '@jac-uk/jac-kit/components/Table/Table.vue';
import TableCell from '@jac-uk/jac-kit/components/Table/TableCell.vue';
import TabsList from '@jac-uk/jac-kit/draftComponents/TabsList.vue';
import ActionButton from '@jac-uk/jac-kit/draftComponents/ActionButton.vue';
import PanelForm from './components/AddEdit.vue';
import EditPanellists from './Panellists/Edit.vue';
import ViewPanellists from './Panellists/View.vue';
import { ROLES, PANEL_STATUS } from './Constants';
import { SCORESHEET_TOOLS, getScoreSheetTotal, scoreSheetRowsAddRank, scoreSheetRowsAddDiversity } from '@/helpers/scoreSheetHelper';
import ScoreSheet from '@/components/ScoreSheet/ScoreSheet.vue';

export default {
  components: {
    TabsList,
    Table,
    TableCell,
    ActionButton,
    PanelForm,
    EditPanellists,
    ViewPanellists,
    ScoreSheet,
  },
  props: {
    type: {
      required: true,
      type: String,
    },
  },
  data() {
    const data = {
      activeTab: 'panellists',
      selectedItems: [],
      tableColumnsApplications: [
        { title: 'Reference number' },
        { title: 'Name' },
      ],
      isEditingPanellists: false,
      roles: [
        ROLES.CHAIR,
        ROLES.JUDICIAL,
        ROLES.INDEPENDENT,
        ROLES.OTHER,
      ],
      scoreSheetTools: [
        SCORESHEET_TOOLS.FIND,
        SCORESHEET_TOOLS.COPY,
        SCORESHEET_TOOLS.PASTE,
        SCORESHEET_TOOLS.SCORE,
        SCORESHEET_TOOLS.DIVERSITY,
      ],
    };
    return data;
  },
  computed: {
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    exerciseDiversity() {
      return this.$store.state.exerciseDiversity.record ? this.$store.state.exerciseDiversity.record.applicationsMap : {};
    },
    tabs() {
      const tabs = [];
      tabs.push({ ref: 'panellists', title: 'Panellists' });
      // tabs.push({ ref: 'slots', title: 'Selection Days' });
      tabs.push({ ref: 'applications', title: 'Applications' });
      tabs.push({ ref: 'edit', title: 'Edit' });
      return tabs;
    },
    scoreSheetData() {
      const rows = [];
      if (!this.panel) return rows;
      if (!this.panel.applicationIds) return rows;
      if (!this.panel.scoreSheet) return rows;
      this.panel.applicationIds.forEach(applicationId => {
        const row = {
          id: applicationId,
          referenceNumber: this.panel.applications[applicationId].referenceNumber,
          scoreSheet: this.panel.scoreSheet[applicationId],
          score: getScoreSheetTotal(this.panel.markingScheme, this.panel.scoreSheet[applicationId]),
          // report: this.panel.reports ? this.panel.reports[applicationId] : null,
        };
        rows.push(row);
      });
      if (this.exerciseDiversity) scoreSheetRowsAddDiversity(rows, this.exerciseDiversity);
      scoreSheetRowsAddRank(rows);
      return rows;
    },
    task() {
      return this.$store.getters['tasks/getTask'](this.type);
    },
    canEditScoreSheet() {
      return false;
    },
    isModerationRequired() {
      return false;
      // if (!this.task) return false;
      // if (!this.task.panelIds) return false;
      // return this.task.panelIds.length > 1;
    },
    grades() {
      return this.task ? this.task.grades : [];
    },
    panelId() {
      return this.$route.params.panelId;
    },
    panel() {
      return this.$store.state.panel.record;
    },
    panellists() {
      const orderedPanellists = [...this.$store.state.panel.panellists];
      return orderedPanellists.sort((first, second) => {
        if (first.fullName < second.fullName) {
          return -1;
        }
        if (first.fullName > second.fullName) {
          return 1;
        }
        return 0;
      });
    },
    applications() {
      return this.$store.state.panel.applications;
    },
    isButtonDisabled() {
      const isDisabled = this.selectedItems && this.selectedItems.length;
      return !isDisabled;
    },
    canExportToGoogleDrive() {
      if (this.panel && [PANEL_STATUS.DRAFT, PANEL_STATUS.CREATED].indexOf(this.panel.status) >= 0) {
        return true;
      } else {
        return false;
      }
    },
    isProcessing() {
      return this.panel && this.panel.status === 'processing';
    },
    processingTotal() {
      if (this.panel && this.panel.applicationsMap) {
        return Object.keys(this.panel.applicationsMap).length;
      }
      return 0;
    },
    processingRemaining() {
      if (this.panel && this.panel.processing && this.panel.processing.queue) {
        return this.panel.processing.queue.length;
      }
      return 0;
    },
    processingProgress() {
      return this.processingTotal - this.processingRemaining;
    },
  },
  async created() {
    await this.$store.dispatch('panel/bind', this.panelId);
    if (this.panel && this.panel.panellistIds) {
      this.$store.dispatch('panel/bindPanellists', { ids: this.panel.panellistIds });
    }    
    if (
      this.panel &&
      this.panel.scoreSheet
    ) {
      this.tabs.unshift({
        ref: 'scoreSheet',
        title: 'Score sheet',
      });
      this.activeTab = 'scoreSheet';
    }
    await this.$store.dispatch('exerciseDiversity/bind', this.exercise.id);
  },
  unmounted() {
    this.$store.dispatch('panel/unbind');
    this.$store.dispatch('panel/unbindApplications');
    this.$store.dispatch('panel/unbindPanellists');
  },
  methods: {
    async savePanel(data) {
      const saveData = { ...data };
      saveData.exercise = {
        id: this.exercise.id,
        name: this.exercise.name,
        referenceNumber: this.exercise.referenceNumber,
      };
      saveData.markingScheme = this.task.markingScheme,
      await this.$store.dispatch('panel/update', { id: this.panelId, data: saveData } );
      this.activeTab = 'applications';
    },
    async deletePanel() {
      await this.$store.dispatch('panel/delete', this.panelId );
      this.$router.push({ name: 'exercise-task-loading' });
    },
    async editPanellists() {
      await this.$store.dispatch('panel/bindPanellists'); // TODO avoid re-bind
      this.isEditingPanellists = true;
    },
    viewPanellists() {
      this.isEditingPanellists = false;
    },
    async savePanellists(data) {
      const saveData = {
        panellistIds: Object.values(data).filter(item => item.length > 0),
        roles: data,
      };
      if (data[ROLES.CHAIR]) {
        const chair = this.panellists.find(item => item.id === data[ROLES.CHAIR]);
        if (chair) {
          saveData.editors = [chair.jacEmail]; // `editors` just has a single editor for now however is named in case we want to add more in the future
        }
      }
      await this.$store.dispatch('panel/update', { id: this.panelId, data: saveData } );
      this.isEditingPanellists = false;
    },
    getTableDataApplications(params) {
      if (this.panel) {
        this.$store.dispatch(
          'panel/bindApplications',
          {
            exerciseId: this.panel.exercise.id,
            panelId: this.panelId,
            type: this.panel.type,
            ...params,
          }
        );
      }
    },
    async removeFromPanel() {
      await this.$store.dispatch('panel/removeApplications', { applicationIds: this.selectedItems });
    },
    async exportToGoogleDrive() {
      const data = {
        status: 'approved',   // TODO this needs to work off of another field e.g. `exportStatus`
        'statusLog.approved': serverTimestamp(),
      };
      await this.$store.dispatch('panel/update', { id: this.panelId, data: data });
      return true;
    },
    // async resetPanelExport() {
    //   const data = {
    //     status: PANEL_STATUS.DRAFT,
    //   };
    //   await this.$store.dispatch('panel/update', { id: this.panelId, data: data });
    // },
    // async exportToGoogleDrive() {
    //   console.log('export. TODO re-include export trigger');
    //   const data = {
    //     applicationIds: this.applications.map(application => application.id),
    //     applications: {},
    //     panellists: {},
    //     capabilities: this.capabilities,
    //     grades: this.grades,
    //     scoreSheet: {},
    //     status: PANEL_STATUS.CREATED,
    //   };
    //   this.applications.forEach(application => {
    //     data.applications[application.id] = {
    //       referenceNumber: application.application.referenceNumber,
    //       // TODO include fullName for non name-blind
    //     };
    //     data.scoreSheet[application.id] = emptyScoreSheet({ type: this.panel.type, capabilities: this.capabilities }).scoreSheet;
    //   });
    //   this.panellists.filter(panellist => this.panel.panellistIds.indexOf(panellist.id) >= 0).forEach(panellist => {
    //     data.panellists[panellist.id] = {
    //       fullName: panellist.fullName,
    //       // TODO include other details e.g. phone, email?
    //     };
    //   });
    //   await this.$store.dispatch('panel/update', { id: this.panelId, data: data });
    // },
  },
};
</script>

<style scoped>
.govuk-summary-list__key {
  vertical-align: top;
}
</style>
