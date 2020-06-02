<template>
  <div>
    <Banner :message="message" />
    <h1>Review</h1>
    <form @submit.prevent="checkForm">
      <button 
        class="govuk-button govuk-!-margin-right-2" 
        :disabled="isButtonDisabled"
      >
        Set status
      </button>
      <Table 
        data-key="id"
        :data="applicationRecords"
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
      return this.$store.state.stageReview.records;
    },
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    isButtonDisabled() {
      const isDisabled = this.selectedItems && this.selectedItems.length;
      return !isDisabled;
    },
    selectAll: {
      get: function () {
        return this.applicationRecords ? this.selectedItems.length == this.applicationRecords.length : false;
      },
      set: function (value) {
        var selectedItems = [];
        if (value) {
          this.applicationRecords.forEach((item) => {
            selectedItems.push(item.id);
          });
        }
        this.selectedItems = selectedItems;
      },
    }, 
  },
  async created() {
    this.$store.dispatch('stageReview/bind', { exerciseId: this.exercise.id });
    this.message = await this.$store.dispatch('stageReview/getMessages');
    this.selectedItems = this.$store.state.stageReview.selectedItems;
  },
  methods: {
    checkForm() {
      this.$store.dispatch('stageReview/storeItems', { items: this.selectedItems });
      this.$router.push({ name: 'exercise-stages-review-edit' });
    },
  },
};
</script>
