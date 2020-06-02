<template>
  <div>
    <TabsList
      :tabs="tabs"
      :active-tab.sync="activeTab"
    />
    {{ activeTab }}
    {{ selectedItems }}
    <Table 
      data-key="id"
      :data="tableData"
      :columns="[
        { title: 'Reference number' },
        { title: 'Candidate' },
        { title: 'Status' },
      ]"
      multi-select
      :selection.sync="selectedItems"
    >
      <template #row="{row}">
        <TableCell>{{ row.application.referenceNumber }}</TableCell>
        <TableCell>{{ row.candidate.fullName }}</TableCell>
        <TableCell>{{ row.status | lookup }}</TableCell>
      </template>
    </Table>
  </div>
</template>
<script>
import TabsList from '@/components/Page/TabsList'; 
import Table from '@/components/Page/Table/Table'; 
import TableCell from '@/components/Page/Table/TableCell'; 

export default {
  components: {
    TabsList,
    Table,
    TableCell,
  },
  data() {
    return {
      tabs: [
        {
          ref: 'one',
          title: 'this is tab 1',
        },
        {
          ref: 'two',
          title: 'here is tab 2',
        },
      ],
      activeTab: 'one',
      tableData: [
        { id: 'row-1', application: { referenceNumber: 'app-1' }, candidate: { fullName: 'Candidate 1' }, status: 'passedFirstTest' },
        { id: 'row-2', application: { referenceNumber: 'app-2' }, candidate: { fullName: 'Candidate 2' }, status: 'passedSift' },
        { id: 'row-3', application: { referenceNumber: 'app-3' }, candidate: { fullName: 'Candidate 3' }, status: 'failedSift' },
        { id: 'row-4', application: { referenceNumber: 'app-4' }, candidate: { fullName: 'Candidate 4' }, status: 'failedFirstTest' },
      ],
      selectedItems: ['row-1'],
    };
  },
};
</script>
