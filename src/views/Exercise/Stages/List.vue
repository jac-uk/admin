<template>
  <div>
    <Banner
      :message="message"
      status="success"
    />
    <form @submit.prevent="checkForm">
      <div class="moj-page-header-actions govuk-!-margin-bottom-2">
        <div class="moj-page-header-actions__title">
          <h1 class="govuk-heading-l">
            {{ $filters.lookup(stage) }} ({{ totalApplicationRecords }})
          </h1>
        </div>
        <div
          v-if="hasPermissions([PERMISSIONS.applicationRecords.permissions.canUpdateApplicationRecords.value])"
          class="moj-page-header-actions__actions float-right"
        >
          <div class="moj-button-menu">
            <div class="moj-button-menu__wrapper">
              <button
                v-if="canGoBack"
                class="govuk-button govuk-button--secondary moj-button-menu__item moj-page-header-actions__action govuk-!-margin-right-2"
                :disabled="!hasItems"
                @click.prevent="moveBack()"
              >
                Move back to ...
              </button>
              <button
                v-if="canSetStatus"
                class="govuk-button moj-button-menu__item moj-page-header-actions__action govuk-!-margin-right-2"
                :disabled="!hasItems"
              >
                Set status
              </button>
              <Select
                id="page-size"
                v-model="pageSize"
                required
                class="moj-button-menu__item moj-page-header-actions__action govuk-!-margin-right-2 govuk-!-margin-bottom-0"
              >
                <option
                  v-for="size in pageSizes"
                  :key="size"
                  :value="size"
                >
                  {{ size }}
                </option>
              </Select>
            </div>
          </div>
        </div>
      </div>
      <Table
        ref="tableRef"
        :key="stage"
        v-model:selection="selectedItems"
        data-key="id"
        :data="applicationRecords"
        :columns="tableColumns"
        multi-select
        :page-size="pageSize"
        :search-map="$searchMap.applicationRecords"
        :filters="[
          {
            title: 'Status',
            field: 'status',
            type: 'checkbox',
            options: filterStatuses,
          },
        ]"
        @change="getTableData"
      >
        <template #row="{row}">
          <TableCell :title="tableColumns[0].title">
            <RouterLink
              :to="{ name: 'exercise-application', params: { applicationId: row.id } }"
            >
              {{ row.application.referenceNumber }}
            </RouterLink>
          </TableCell>
          <TableCell :title="tableColumns[1].title">
            <RouterLink
              :to="{ name: 'candidates-view', params: { id: row.candidate.id } }"
              target="_blank"
            >
              {{ row.candidate.fullName }}
            </RouterLink>
          </TableCell>
          <TableCell :title="tableColumns[2].title">
            {{ $filters.candidateHasIssues(row) }}
          </TableCell>
          <TableCell :title="tableColumns[3].title">
            {{ $filters.lookup(row.status) }}
          </TableCell>
          <TableCell :title="tableColumns[4].title">
            {{ $filters.lookup($filters.toYesNo(row.flags.empApplied)) }}
          </TableCell>
        </template>
      </Table>
    </form>
  </div>
</template>

<script>
import Banner from '@jac-uk/jac-kit/draftComponents/Banner.vue';
import Table from '@jac-uk/jac-kit/components/Table/Table.vue';
import TableCell from '@jac-uk/jac-kit/components/Table/TableCell.vue';
import permissionMixin from '@/permissionMixin';
import Select from '@jac-uk/jac-kit/draftComponents/Form/Select.vue';
import { availableStatuses, getPreviousStage, getStagePassingStatuses } from  '@jac-uk/jac-kit/helpers/exerciseHelper';
import { EXERCISE_STAGE } from '@jac-uk/jac-kit/helpers/constants';
import store from '@/store';

export default {
  components: {
    Banner,
    Table,
    TableCell,
    Select,
  },
  mixins: [permissionMixin],
  beforeRouteEnter(to) {
    const stage = to.params.stage;
    const exercise = store.state.exerciseDocument.record;
    if (stage === EXERCISE_STAGE.REVIEW && exercise) {
      if (exercise._processingVersion >= 2) {
        return { name: to.name, params: { stage: EXERCISE_STAGE.SHORTLISTING } };
      }
    }
  },
  data() {
    return {
      message: null,
      selectedItems: [],
      tableColumns: [
        { title: 'Reference number' },
        { title: 'Name', sort: 'candidate.fullName', default: true },
        { title: 'Issues' },
        { title: 'Status' },
        { title: 'EMP' },
      ],
      pageSize: 50,
      pageSizes: [2, 10, 50, 100, 250, 500],
    };
  },
  computed: {
    stage() {
      return this.$route.params.stage;
    },
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    applicationRecords() {
      return this.$store.state.applicationRecords.records;
    },
    totalApplicationRecords() {
      return (this.exercise && this.exercise._applicationRecords && this.exercise._applicationRecords[this.stage]) || 0;
    },
    hasItems() {
      return this.selectedItems && this.selectedItems.length;
    },
    canGoBack() {
      return this.previousStage ? true : false;
    },
    canSetStatus() {
      return this.stage !== EXERCISE_STAGE.HANDOVER;
    },
    availableStatuses() {
      const statuses = availableStatuses(this.exercise, this.stage);
      return statuses;
    },
    previousStage() {
      return getPreviousStage(this.exercise, this.stage);
    },
    filterStatuses() {
      let statuses = this.availableStatuses;
      if (this.previousStage) {
        statuses = statuses.concat(getStagePassingStatuses(this.exercise, this.previousStage));
      }
      return statuses;
    },
  },
  watch: {
    async stage(newVal, oldVal) {
      if (newVal != oldVal) {
        this.message = await this.$store.dispatch('applicationRecords/getMessages');
        this.selectedItems = [];
        this.$store.dispatch('applicationRecords/storeItems', { items: this.selectedItems });
        this.setPageTitle();
      }
    },
  },
  async created() {
    this.message = await this.$store.dispatch('applicationRecords/getMessages');
    this.setPageTitle();
  },
  methods: {
    setPageTitle() {
      document.title = `${this.$filters.lookup(this.stage)} | Exercise Stage | JAC Digital Platform`;
    },
    moveBack() {
      this.$store.dispatch('applicationRecords/storeItems', { items: this.selectedItems });
      this.$router.push({ name: 'exercise-stage-back' });
    },
    checkForm() {
      this.$store.dispatch('applicationRecords/storeItems', { items: this.selectedItems });
      this.$router.push({ name: 'exercise-stage-edit' });
    },
    getTableData(params) {
      this.$store.dispatch(
        'applicationRecords/bind',
        {
          exerciseId: this.exercise.id,
          stage: this.stage,
          ...params,
        }
      );
    },
    async candidateSearch(searchTerm) {
      return await this.$store.dispatch('candidates/search', { searchTerm: searchTerm, exerciseId: this.exercise.id });
    },
  },
};
</script>
