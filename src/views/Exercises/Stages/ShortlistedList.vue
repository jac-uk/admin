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
        :data="getPaginated"
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
          <TableCell>
            <RouterLink
              :to="{ name: 'exercise-application', params: { applicationId: row.id } }"
            >
              {{ row.application.referenceNumber }}
            </RouterLink> 
          </TableCell>
          <TableCell>
            <RouterLink
              :to="{ name: 'candidates-view', params: { id: row.candidate.id } }"
            >
              {{ row.candidate.fullName }}
            </RouterLink> 
          </TableCell>
          <TableCell>{{ row | candidateHasIssues }}</TableCell>
          <TableCell>{{ row.status | lookup }}</TableCell>
          <TableCell>{{ row.flags.empApplied | toYesNo }}</TableCell>
        </template>
      </Table>
      <Pagination 
        :high-index="numberOfPages"
        @pageChanged="updatePage($event)"
      />
    </form>
  </div>
</template>

<script>
import Banner from '@/components/Page/Banner';
import Table from '@/components/Page/Table/Table'; 
import TableCell from '@/components/Page/Table/TableCell'; 
import Pagination from '@/components/Page/Pagination';

export default {
  components: {
    Banner,
    Table,
    TableCell,
    Pagination,
  },
  data() {
    return {
      message: null,
      selectedItems: [],
      page: 1,
      pageSize: 25,
    };
  },
  computed: {
    applicationRecords() {
      return this.$store.state.stageShortlisted.records;
    },
    totalApplicationRecords() {
      if (this.exercise && this.exercise.applicationRecords && this.exercise.applicationRecords.shortlisted){
        return this.exercise.applicationRecords.shortlisted; 
      } else {
        return 0;
      }
    },
    isButtonDisabled() {
      const isDisabled = this.selectedItems && this.selectedItems.length;
      return !isDisabled;
    },
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    numberOfPages() {
      return Math.ceil(this.totalApplicationRecords / this.pageSize);
    },
    getPaginated() {
      if (this.numberOfPages){
        if (this.page > this.numberOfPages) throw `Page ${this.page} exceeds page size of ${this.numberOfPages}`;

        const sliceFrom = ((this.page - 1) * this.pageSize);
        const sliceTo = sliceFrom + this.pageSize; 
        const sliced = this.applicationRecords.slice(sliceFrom, sliceTo);

        return sliced;
      } else {
        return this.applicationRecords;
      }
    },
  },
  async created() {
    this.$store.dispatch('stageShortlisted/bind', { exerciseId: this.exercise.id });
    this.message = await this.$store.dispatch('stageShortlisted/getMessages');
  },
  methods: {
    moveBack() {
      this.$store.dispatch('stageShortlisted/storeItems', { items: this.selectedItems });
      this.$router.push({ name: 'exercise-stages-shortlisted-back' });
    },
    setStatus() {
      this.$store.dispatch('stageShortlisted/storeItems', { items: this.selectedItems });
      this.$router.push({ name: 'exercise-stages-shortlisted-edit' });
    },
    updatePage(pageChanged){
      this.page = pageChanged;
    },
  },
};
</script>
