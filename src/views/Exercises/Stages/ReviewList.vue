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
            Review ({{ totalApplicationRecords }})
          </h1>
        </div>
        <div class="moj-page-header-actions__actions">
          <div class="moj-button-menu">
            <div class="moj-button-menu__wrapper">
              <button 
                class="govuk-button moj-button-menu__item moj-page-header-actions__action govuk-!-margin-right-2" 
                :disabled="isButtonDisabled"
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
          { title: 'EMP'}
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
      return this.$store.state.stageReview.records;
    },
    totalApplicationRecords() {
      if (this.exercise && this.exercise.applicationRecords && this.exercise.applicationRecords.review){
        return this.exercise.applicationRecords.review;
      } else {
        return 0;
      }
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
        const selectedItems = [];
        if (value) {
          this.applicationRecords.forEach((item) => {
            selectedItems.push(item.id);
          });
        }
        this.selectedItems = selectedItems;
      },
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
    this.$store.dispatch('stageReview/bind', { exerciseId: this.exercise.id });
    this.message = await this.$store.dispatch('stageReview/getMessages');
    this.selectedItems = this.$store.state.stageReview.selectedItems;
  },
  methods: {
    checkForm() {
      this.$store.dispatch('stageReview/storeItems', { items: this.selectedItems });
      this.$router.push({ name: 'exercise-stages-review-edit' });
    },
    updatePage(pageChanged){
      this.page = pageChanged;
    },
  },
};
</script>
