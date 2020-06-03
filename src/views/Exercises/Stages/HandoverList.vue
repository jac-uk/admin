<template>
  <div>
    <Banner 
      :message="message" 
      status="success" 
    />
    <form @submit.prevent="checkForm">
      <div class="moj-page-header-actions">
        <div class="moj-page-header-actions__title">
          <h1 class="govuk-heading-l">
            Handover ({{ totalApplicationRecords }})
          </h1>
        </div>
      </div>
      <Table 
        data-key="id"
        :data="applicationRecords"
        :columns="[
          { title: 'Reference number' },
          { title: 'Name' },
          { title: 'Status' },
        ]"
      >
        <template #row="{row}">
          <TableCell>{{ row.application.referenceNumber }}</TableCell>
          <TableCell>{{ row.candidate.fullName }}</TableCell>
          <TableCell>{{ row.status | lookup }}</TableCell>
        </template>
      </Table>   
    </form>
  </div>
</template>

<script>
import Banner from '@/components/Page/Banner';
import Table from '@/components/Page/Table/Table'; 
import TableCell from '@/components/Page/Table/TableCell'; 

export default {
  components: {
    Banner,
    Table,
    TableCell,
  },
  data() {
    return {
      message: null,
      selectedItems: [],
    };
  },
  computed: {
    applicationRecords() {
      return this.$store.state.stageHandover.records;
    },
    totalApplicationRecords() {
      return this.exercise.applicationRecords.handover || 0;
    },
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    isButtonDisabled() {
      const isDisabled = false; // hardcode the button always disabled for Handover status
      // const isDisabled = this.selectedItems && this.selectedItems.length;
      return !isDisabled;
    },
  },
  created() {
    this.$store.dispatch('stageHandover/bind', { exerciseId: this.exercise.id });
  },
};
</script>
