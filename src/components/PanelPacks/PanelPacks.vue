<template>
  <div>
    <TabsList
      :tabs="tabs"
      :active-tab.sync="activeTab"
    />
    <!-- PANELS -->
    <div v-show="activeTab == 'panels'">
      <button
        class="govuk-button govuk-!-margin-bottom-0"
        @click="createNewPanel"
      >
        Create New
      </button>
      <Table
        data-key="id"
        :data="panelsList"
        :page-size="50"
        :columns="tableColumns"
        @change="getTableData"
      >
        <template #row="{row}">
          <TableCell :title="tableColumns[0].title">
            <RouterLink
              :to="{ name: `exercise-tasks-${row.type}-view`, params: { panelId: row.id} }"
            >
              {{ row.name }}
            </RouterLink>
          </TableCell>
          <TableCell :title="tableColumns[1].title">
            {{ row.status }}
          </TableCell>
        </template>
      </Table>
    </div>
    <!-- // END PANELS -->
    <!-- CANDIDATES -->
    <div v-show="activeTab == 'candidates'">
      <Table
        data-key="id"
        :data="candidatesList"
        :columns="tableColumnsCandidates"
        multi-select
        :selection.sync="selectedItems"
        :page-size="50"
        :search="['candidate.fullName']"
        @change="getTableDataCandidates"
      >
        <template #actions>
          <button
            class="govuk-button moj-button-menu__item moj-page-header-actions__action govuk-!-margin-right-2"
            :disabled="isButtonDisabled"
            @click="btnClkSelectPanel('modalRefPanel')"
          >
            Set Panel
          </button>
        </template>

        <template #row="{row}">
          <TableCell :title="tableColumnsCandidates[0].title">
            <RouterLink
              :to="{ name: 'exercise-application', params: { applicationId: row.id } }"
            >
              {{ row.application.referenceNumber }}
            </RouterLink>
          </TableCell>
          <TableCell :title="tableColumnsCandidates[1].title">
            <RouterLink
              :to="{ name: 'candidates-view', params: { id: row.candidate.id } }"
            >
              {{ row.candidate.fullName }}
            </RouterLink>
          </TableCell>
          <TableCell :title="tableColumnsCandidates[2].title">
            {{ getPanelName(row) }}
          </TableCell>
        </template>
      </Table>
    </div>
    <!-- // END CANDIDATES -->
    <Modal
      ref="modalRefPanel"
    >
      <component
        :is="`SelectPanel`"
        :panels="panelsList"
        @close="closeModal('modalRefPanel')"
        @selected="selectPanel"
      />
    </Modal>
  </div>
</template>

<script>
import Table from '@jac-uk/jac-kit/components/Table/Table';
import TableCell from '@jac-uk/jac-kit/components/Table/TableCell';
import TabsList from '@jac-uk/jac-kit/draftComponents/TabsList';
import Modal from '@jac-uk/jac-kit/components/Modal/Modal';
import SelectPanel from '@/components/ModalViews/SelectPanel';

export default {
  components: {
    Table,
    TableCell,
    TabsList,
    Modal,
    SelectPanel,
  },
  props: {
    type: {
      required: true,
      type: String,
    },
  },
  data() {
    return {
      activeTab: 'panels',
      selectedItems: [],
      tableColumns: [
        { title: 'Name', sort: 'name', direction: 'asc', default: true },
        { title: 'Status' },
      ],
      tableColumnsCandidates: [
        { title: 'Reference number' },
        { title: 'Name', sort: 'candidate.fullName', default: true },
        { title: 'Panel' },
      ],
    };
  },
  computed: {
    tabs(){
      return [
        {
          ref: 'panels',
          title: 'Panels',
        },
        {
          ref: 'candidates',
          title: 'Candidates',
        },
      ];
    },
    exerciseId() {
      return this.$route.params.id;
    },
    panelsList() {
      // eslint-disable-next-line no-console
      // console.log('panelsList', this.$store.state.panels.records);
      return this.$store.state.panels.records;
    },
    candidatesList() {
      // eslint-disable-next-line no-console
      // console.log('panelsList', this.$store.state);
      let records = [];
      if (this.isSift) {
        records = this.$store.state.stageReview.records;
      }
      if (this.isSelectionDay) {
        records = this.$store.state.stageSelected.records;
      }
      return records;
    },
    isSift() {
      const routeFullPath = this.$route.fullPath ;
      const route = this.$store.getters['panels/isSift'](routeFullPath);
      return route;
    },
    isSelectionDay() {
      const routeFullPath = this.$route.fullPath ;
      const route = this.$store.getters['panels/isSelectionDay'](routeFullPath);
      return route;
    },
    isButtonDisabled() {
      const isDisabled = this.selectedItems && this.selectedItems.length;
      return !isDisabled;
    },
  },
  methods: {
    getTableData(params) {
      this.$store.dispatch(
        'panels/bind',
        {
          exerciseId: this.exerciseId,
          type: this.type,
          ...params,
        }
      );
    },
    getTableDataCandidates(params) {
      if (this.isSift) {
        this.$store.dispatch(
          'stageReview/bind',
          {
            exerciseId: this.exerciseId,
            ...params,
          }
        );
      }
      if (this.isSelectionDay) {
        this.$store.dispatch(
          'stageSelected/bind',
          {
            exerciseId: this.exerciseId,
            ...params,
          }
        );
      }
    },
    getPanelName(candidate) {
      if (!candidate.panelIds) {
        return '';
      }
      const panelId = this.isSift ? candidate.panelIds.sift : candidate.panelIds.selection;
      if (!panelId) {
        return '';
      }
      const panel = this.panelsList.find(p => p.id === panelId);
      return panel ? panel.name : '';
    },
    createNewPanel() {
      const routeName = this.type === 'sift' ? 'exercise-tasks-sift-new' : 'exercise-tasks-selection-new';
      // eslint-disable-next-line no-console
      // console.log('create new Pack btn clicked');
      this.$router.push({ name: routeName });
    },
    btnClkSelectPanel(modal) {
      this.openModal(modal);
    },
    openModal(modalRef){
      this.$refs[modalRef].openModal();
    },
    closeModal(modalRef) {
      this.$refs[modalRef].closeModal();
    },
    async selectPanel(panel) {
      const records = [];
      this.candidatesList.forEach(async (c) => {
        if (this.selectedItems.includes(c.id)) {
          const data = {
            panelIds: c.panelIds ? { ...c.panelIds } : {},
          };
          if (panel.type === 'sift') {
            data.panelIds.sift = panel.id;
          } else {
            data.panelIds.selection = panel.id; // are there other panel types to add?
          }
          records.push({ id: c.id, data: data });
        }
      });
      await this.$store.dispatch('candidateApplications/update', records);
    },
  },
};
</script>

<style scoped>

</style>
