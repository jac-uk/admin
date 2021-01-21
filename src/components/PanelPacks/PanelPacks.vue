<template>
  <div>
    <TabsList
      :tabs="tabs"
      :active-tab.sync="activeTab"
    />
    <Table
      v-show="activeTab == 'panels'"
      data-key="id"
      :data="panelsList"
      :page-size="50"
      :columns="tableColumns"
      @change="getTableData"
    >
      <template #row="{row}">
        <TableCell :title="tableColumns[0]">
          {{ row.title }}
        </TableCell>
        <TableCell :title="tableColumns[1]">
          {{ row.type }}
        </TableCell>
        <TableCell :title="tableColumns[2]">
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
      tableColumns: [
        { title: 'Title', sort: 'title' },
        { title: 'Type' },
        { title: 'Status' },
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
    createNewPanel() {
      const routeName = this.type === 'sift' ? 'exercise-tasks-sift-new' : 'exercise-tasks-selection-days-new';
      // eslint-disable-next-line no-console
      // console.log('create new Pack btn clicked');
      this.$router.push({ name: routeName });
    },
  },
};
</script>

<style scoped>

</style>
