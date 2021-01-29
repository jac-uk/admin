<template>
  <div>
    <TabsList
      :tabs="tabs"
      :active-tab.sync="activeTab"
    />
    <!-- PANELS -->
    <div v-show="activeTab == 'panels'">
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
            {{ row.type }}
          </TableCell>
          <TableCell :title="tableColumns[2].title">
            {{ row.status }}
          </TableCell>
        </template>
      </Table>
      <button
        class="govuk-button govuk-!-margin-right-3"
        @click="createNewPanel"
      >
        Create New
      </button>
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
        :filters="[
          {
            title: 'Status',
            field: 'status',
            type: 'checkbox',
          },
        ]"
        @change="getTableDatacandidates"
      >
        <template #actions>
          <button
            class="govuk-button moj-button-menu__item moj-page-header-actions__action govuk-!-margin-right-2"
            :disabled="isButtonDisabled"
            @click="btnClkSelectPanel"
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
            {{ row.status | lookup }}
          </TableCell>
          <TableCell :title="tableColumnsCandidates[3].title">
            {{ row | candidateHasIssues }}
          </TableCell>
          <TableCell :title="tableColumnsCandidates[4].title">
            {{ row.flags.empApplied | toYesNo }}
          </TableCell>
        </template>
      </Table>
    </div>
    <!-- CANDIDATES -->
  </div>
</template>

<script>
import Table from '@jac-uk/jac-kit/components/Table/Table';
import TableCell from '@jac-uk/jac-kit/components/Table/TableCell';
import TabsList from '@jac-uk/jac-kit/draftComponents/TabsList';

export default {
  components: {
    Table,
    TableCell,
    TabsList,
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
        { title: 'Name' },
        { title: 'Type' },
        { title: 'Status' },
      ],
      tableColumnsCandidates: [
        { title: 'Reference number' },
        { title: 'Name', sort: 'candidate.fullName', default: true },
        { title: 'Issues' },
        { title: 'Status' },
        { title: 'EMP' },
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
        {
          ref: 'settings',
          title: 'Settings',
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
        records = this.$store.state.stageShortlisted.records;
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
  created() {

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
    getTableDatacandidates(params) {
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
          'stageShortlisted/bind',
          {
            exerciseId: this.exerciseId,
            ...params,
          }
        );
      }
    },
    createNewPanel() {
      const routeName = this.type === 'sift' ? 'exercise-tasks-sift-new' : 'exercise-tasks-selection-days-new';
      // eslint-disable-next-line no-console
      // console.log('create new Pack btn clicked');
      this.$router.push({ name: routeName });
    },
    btnClkSelectPanel() {
      // TODO Select Panels to add these candidates
      // eslint-disable-next-line no-console
      console.log('SelectPanel');
    },
  },
};
</script>

<style scoped>

</style>
