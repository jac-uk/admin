<template>
  <div>
    <Banner 
      :message="message" 
      status="success" 
    />
    <form>
      <div class="moj-page-header-actions">
        <div class="moj-page-header-actions__title">
          <h1 class="govuk-heading-l">
            Shortlisted ({{ totalApplicationRecords }})
          </h1>
        </div>
        <div class="moj-page-header-actions__actions">
          <div class="moj-button-menu">
            <div class="moj-button-menu__wrapper">
              <button  
                class="govuk-button govuk-button--secondary moj-button-menu__item moj-page-header-actions__action govuk-!-margin-right-2" 
                :disabled="isButtonDisabled"
                @click.prevent="moveBack()"
              >
                Move back to ...
              </button>
              <button 
                class="govuk-button moj-button-menu__item moj-page-header-actions__action govuk-!-margin-right-2" 
                :disabled="isButtonDisabled"
                @click.prevent="setStatus()"
              >
                Set status
              </button>
            </div>
          </div>
        </div>
      </div>
      <Table 
        data-key="id"
        :data="applicationRecords"
        :columns="[
          { title: 'Reference number' },
          { title: 'Name' },
          { title: 'Issues' },
          { title: 'Status' },
          { title: 'EMP' }
        ]"
        multi-select
        :selection.sync="selectedItems"
      >
        <template #row="{row}">
          <TableCell>{{ row.application.referenceNumber }}</TableCell>
          <TableCell>{{ row.candidate.fullName }}</TableCell>
          <TableCell>{{ row | candidateHasIssues }}</TableCell>
          <TableCell>{{ row.status | lookup }}</TableCell>
          <TableCell>{{ row.flags.empApplied | toYesNo }}</TableCell>
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
      return this.$store.state.stageShortlisted.records;
    },
    totalApplicationRecords() {
      return this.exercise.applicationRecords.shortlisted || 0;
    },
    isButtonDisabled() {
      const isDisabled = this.selectedItems && this.selectedItems.length;
      return !isDisabled;
    },
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
  },
  async created() {
    this.$store.dispatch('stageShortlisted/bind', { exerciseId: this.exercise.id });
    this.message = await this.$store.dispatch('stageShortlisted/getMessages');
  },
  methods: {
    moveBack() {
      this.$store.dispatch('stageShortlisted/storeItems', { items: this.selectedItems });
      this.$router.push({ name: 'exercise-stages-shortlist-back' });
    },
    setStatus() {
      this.$store.dispatch('stageShortlisted/storeItems', { items: this.selectedItems });
      this.$router.push({ name: 'exercise-stages-shortlist-edit' });
    },
  },
};
</script>
