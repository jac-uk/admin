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
            @click="exportToGoogleDrive"
          >
            Export to google drive
          </ActionButton>
        </div>
      </div>
      <div class="govuk-grid-row">
        <div class="govuk-grid-column-one-third">
          <div class="panel govuk-!-margin-bottom-9 govuk-!-padding-4 background-light-grey">
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
          <div class="panel govuk-!-margin-bottom-9 govuk-!-padding-4 background-light-grey">
            <span class="govuk-caption-m">{{ type | lookup }} Dates</span>
            <h2
              class="govuk-heading-m govuk-!-margin-bottom-0"
            >
              {{ panel.dateFrom | formatDate | showAlternative("Unknown") }} -
              {{ panel.dateTo | formatDate | showAlternative("Unknown") }}
            </h2>
          </div>
        </div>

        <div class="govuk-grid-column-one-third">
          <div class="panel govuk-!-margin-bottom-9 govuk-!-padding-4 background-light-grey">
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
        :tabs="tabs"
        :active-tab.sync="activeTab"
      />
    </div>

    <div v-show="panel.scoreSheet && activeTab == 'scoreSheet'">
      <Table
        ref="scoreSheet"
        data-key="id"
        :data="scoreSheetRows"
        :columns="scoreSheetColumns"
        :page-size="500"
        class="merit-list"
        @change="onChangeScoreSheet"
      >
        <template
          v-if="panel.type == 'selection'"
          #header
        >
          <tr class="govuk-table__row">
            <th
              scope="col"
              class="govuk-table__header table-cell-application"
            />
            <th
              v-for="category in selectionCategories"
              :key="category"
              scope="col"
              :colspan="capabilities.length"
              class="govuk-table__header text-center"
            >
              {{ category | lookup }}
            </th>
          </tr>
        </template>
        <template #row="{row}">
          <TableCell class="table-cell-application">
            {{ row.referenceNumber }}
          </TableCell>

          <template v-if="panel.type == 'sift'">
            <TableCell
              v-for="(cap, index) in capabilities"
              :key="`sift_${index}`"
              class="text-center table-cell-score"
            >
              {{ row.scoreSheet[cap] }}
            </TableCell>
          </template>

          <template v-if="panel.type == 'selection'">
            <template
              v-for="category in selectionCategories"
            >
              <TableCell
                v-for="(cap, index) in capabilities"
                :key="`${category}_${index}`"
                class="text-center table-cell-score"
              >
                {{ row.scoreSheet[category][cap] }}
              </TableCell>
            </template>
          </template>
        </template>
      </Table>
    </div>

    <!-- APPLICATIONS LIST -->
    <div v-show="activeTab == 'applications'">
      <button
        class="govuk-button moj-button-menu__item moj-page-header-actions__action govuk-!-margin-right-2"
        :disabled="isButtonDisabled"
        @click="removeFromPanel"
      >
        Remove from panel
      </button>
      <Table
        data-key="id"
        :data="applications"
        :columns="tableColumnsApplications"
        multi-select
        :selection.sync="selectedItems"
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
import firebase from '@firebase/app';
import Table from '@jac-uk/jac-kit/components/Table/Table';
import TableCell from '@jac-uk/jac-kit/components/Table/TableCell';
import TabsList from '@jac-uk/jac-kit/draftComponents/TabsList';
import ActionButton from '@jac-uk/jac-kit/draftComponents/ActionButton';
import PanelForm from './components/AddEdit';
import EditPanellists from './Panellists/Edit';
import ViewPanellists from './Panellists/View';
import { ROLES, PANEL_STATUS } from './Constants';
import { CAPABILITIES, SELECTION_CATEGORIES } from '@/helpers/exerciseHelper';

export default {
  components: {
    TabsList,
    Table,
    TableCell,
    ActionButton,
    PanelForm,
    EditPanellists,
    ViewPanellists,
  },
  props: {
    type: {
      required: true,
      type: String,
    },
  },
  data() {
    const data = {
      activeTab: 'applications',
      tabs: [
        {
          ref: 'applications',
          title: 'Applications',
        },
        {
          ref: 'panellists',
          title: 'Panellists',
        },
        {
          ref: 'edit',
          title: 'Edit',
        },
      ],
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
    };
    return data;
  },
  computed: {
    scoreSheetRows() {
      const rows = [];
      if (!this.panel) return rows;
      if (!this.panel.applicationIds) return rows;
      if (!this.panel.capabilities) return rows;
      if (!this.panel.scoreSheet) return rows;
      this.panel.applicationIds.forEach(applicationId => {
        const row = {
          id: applicationId,
          referenceNumber: this.panel.applications[applicationId].referenceNumber,
          scoreSheet: this.panel.scoreSheet[applicationId],
          report: this.panel.reports ? this.panel.reports[applicationId] : null,
        };
        rows.push(row);
      });
      return rows;
    },
    scoreSheetColumns() {
      const columns = [];
      if (!this.panel) return columns;
      if (!this.panel.capabilities) return columns;
      if (!this.panel.scoreSheet) return columns;
      columns.push({ title: 'Application', class: 'table-cell-application' });
      if (this.type == 'sift') {
        this.capabilities.forEach(cap => columns.push({ title: cap, class: 'text-center table-cell-score' }));
      }
      if (this.type == 'selection') {
        this.selectionCategories.forEach(() => this.capabilities.forEach(cap => columns.push({ title: cap, class: 'text-center table-cell-score' })));
      }
      // columns.push({ title: 'Report', class: 'text-center' });
      return columns;
    },
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    task() {
      return this.$store.getters['tasks/getTask'](this.type);
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
      if (this.$refs['scoreSheet']) {
        this.$refs['scoreSheet'].loaded();
      }
      this.tabs.unshift({
        ref: 'scoreSheet',
        title: 'Score sheet',
      });
      this.activeTab = 'scoreSheet';
    }
  },
  destroyed() {
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
      await this.$store.dispatch('panel/update', { id: this.panelId, data: saveData } );
      this.isEditingPanellists = false;
    },
    onChangeScoreSheet() {
      if (this.$refs['scoreSheet']) {
        this.$refs['scoreSheet'].loaded();
      }
    },
    getTableDataApplications(params) {
      if (this.panel) {
        this.$store.dispatch(
          'panel/bindApplications',
          {
            exerciseId: this.panel.exerciseId,
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
        'statusLog.approved': firebase.firestore.FieldValue.serverTimestamp(),
      };
      await this.$store.dispatch('panel/update', { id: this.panelId, data: data });
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
.table-cell-application {
  width: 160px;
}
.table-cell-score {
  width: 50px;
}
</style>
