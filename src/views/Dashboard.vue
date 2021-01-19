<template>
  <div>
    <div class="govuk-grid-row print-none">
      <div class="govuk-grid-column-full">
        <div class="text-right">
          <button
            v-if="isFavourites"
            class="govuk-button govuk-button--secondary govuk-!-margin-right-3 govuk-!-margin-bottom-0"
            @click="showAll"
          >
            View all exercises
          </button>
          <button
            v-else
            class="govuk-button govuk-button--secondary govuk-!-margin-right-3 govuk-!-margin-bottom-0"
            @click="showMyFavourites"
          >
            Show my favourites
          </button>
          <router-link
            ref="linkToNewExercise"
            to="/exercises/new"
            class="govuk-button govuk-!-margin-right-1 govuk-!-margin-bottom-0"
          >
            Create an exercise
          </router-link>
        </div>
      </div>
    </div>
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-full">
        <h1
          v-if="isFavourites"
          class="govuk-heading-xl"
        >
          Your exercises
        </h1>
        <h1
          v-else
          class="govuk-heading-xl"
        >
          All exercises
        </h1>
        <form @submit.prevent="checkForm">
          <Table
            ref="exercisesTable"
            data-key="id"
            :data="records"
            :page-size="50"
            :columns="tableColumns"
            :filters="[
              {
                title: 'State',
                field: 'state',
                type: 'checkbox',
                options: exerciseStates,
              },
              {
                type: 'dateRange',
                field: 'applicationOpenDate',
                title: 'Open date',
              },
            ]"
            multi-select
            :selection.sync="selectedItems"
            @change="getTableData"
          >
            <template #actions>
              <button
                class="govuk-button moj-button-menu__item moj-page-header-actions__action govuk-!-margin-right-2 govuk-!-margin-bottom-3"
                :disabled="isButtonDisabled"
              >
                Export data
              </button>
            </template>
            <template #row="{row}">
              <TableCell :title="tableColumns[0].title">
                <RouterLink
                  :to="{ name: 'exercise-show-overview', params: { id: row.id } }"
                >
                  {{ row.referenceNumber }}
                </RouterLink>
              </TableCell>
              <TableCell :title="tableColumns[1].title">
                <RouterLink
                  :to="{ name: 'exercise-show-overview', params: { id: row.id } }"
                >
                  {{ row.name }}
                </RouterLink>
              </TableCell>
              <TableCell :title="tableColumns[2].title">
                <RouterLink
                  :to="{ name: 'exercise-show-overview', params: { id: row.id } }"
                >
                  {{ row.applicationOpenDate | formatDate }}
                </RouterLink>
              </TableCell>
              <TableCell :title="tableColumns[3].title">
                <RouterLink
                  :to="{ name: 'exercise-show-overview', params: { id: row.id } }"
                >
                  {{ row.applicationCloseDate | formatDate }}
                </RouterLink>
              </TableCell>
              <TableCell
                class="govuk-table__cell--numeric"
                :title="tableColumns[4].title"
              >
                {{ row.applicationsCount }}
              </TableCell>
            </template>
          </Table>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Table from '@jac-uk/jac-kit/components/Table/Table';
import TableCell from '@jac-uk/jac-kit/components/Table/TableCell';

export default {
  components: {
    Table,
    TableCell,
  },
  data() {
    return {
      selectedItems: [],
      exerciseStates: ['draft', 'ready', 'approved'],
      tableColumns: [
        { title: 'Reference number', sort: 'referenceNumber', direction: 'desc', default: true },
        { title: 'Name', sort: 'name' },
        { title: 'Open date', sort: 'applicationOpenDate' },
        { title: 'Close date', sort: 'applicationCloseDate' },
        {
          title: 'Applications count',
          sort: 'applicationsCount',
          class: 'govuk-table__header--numeric',
        },
      ],
    };
  },
  computed: {
    ...mapState('exerciseCollection', [
      'records',
      'isFavourites',
    ]),
    isButtonDisabled() {
      const hasSelection = this.selectedItems && this.selectedItems.length;
      return !hasSelection;
    },
  },
  watch: {
    isFavourites() {
      if (this.$refs['exercisesTable']) {
        this.$refs['exercisesTable'].reload();
      }
    },
  },
  destroyed() {
    this.$store.dispatch('exerciseCollection/unbind');
  },
  methods: {
    showMyFavourites() {
      this.$store.dispatch('exerciseCollection/showFavourites');
    },
    showAll() {
      this.$store.dispatch('exerciseCollection/showAll');
    },
    getTableData(params) {
      this.$store.dispatch(
        'exerciseCollection/bind',
        params,
      );
    },
    checkForm() {
      this.$store.dispatch('exerciseCollection/storeItems', { items: this.selectedItems });
      this.$router.push({ name: 'exercises-export' });
    },
  },
};
</script>
