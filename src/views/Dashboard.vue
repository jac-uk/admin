<template>
  <div>
    <div class="govuk-grid-row print-none">
      <div class="govuk-grid-column-full">
        <div class="text-right">
          <button
            v-if="isFavourites"
            class="govuk-button govuk-button--secondary govuk-!-margin-right-3"
            @click="showAll"
          >
            View all exercises
          </button>
          <button
            v-else
            class="govuk-button govuk-button--secondary govuk-!-margin-right-3"
            @click="showMyFavourites"
          >
            Show my favourites
          </button>
          <router-link
            ref="linkToNewExercise"
            to="/exercises/new"
            class="govuk-button govuk-!-margin-right-1"
          >
            Create an exercise
          </router-link>
        </div>
      </div>
    </div>
    <h1
      v-if="isFavourites"
      class="govuk-heading-xl govuk-!-margin-bottom-6"
    >
      Your exercises
    </h1>
    <h1
      v-else
      class="govuk-heading-xl govuk-!-margin-bottom-6"
    >
      All exercises
    </h1>

    <Table
      data-key="id"
      :data="records"
      :page-size="50"
      :columns="[
        { title: 'Reference number', sort: 'referenceNumber', direction: 'desc', default: true },
        { title: 'Name', sort: 'name' },
        { title: 'Open date', sort: 'applicationOpenDate' },
        { title: 'Close date', sort: 'applicationCloseDate' },
        {
          title: 'Applications count',
          sort: 'applicationsCount',
          class: 'govuk-table__header--numeric'
        },
      ]"
      @change="getTableData"
    >
      <template #row="{row}">
        <TableCell>
          <RouterLink
            :to="{ name: 'exercise-show-overview', params: { id: row.id } }"
          >
            {{ row.referenceNumber }}
          </RouterLink>
        </TableCell>
        <TableCell>
          <RouterLink
            :to="{ name: 'exercise-show-overview', params: { id: row.id } }"
          >
            {{ row.name }}
          </RouterLink>
        </TableCell>
        <TableCell>
          <RouterLink
            :to="{ name: 'exercise-show-overview', params: { id: row.id } }"
          >
            {{ row.applicationOpenDate | formatDate }}
          </RouterLink>
        </TableCell>
        <TableCell>
          <RouterLink
            :to="{ name: 'exercise-show-overview', params: { id: row.id } }"
          >
            {{ row.applicationCloseDate | formatDate }}
          </RouterLink>
        </TableCell>
        <TableCell
          class="govuk-table__cell--numeric"
        >
          {{ row.applicationsCount }}
        </TableCell>
      </template>
    </Table>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Table from '@/components/Page/Table/Table';
import TableCell from '@/components/Page/Table/TableCell';

export default {
  components: {
    Table,
    TableCell,
  },
  computed: mapState('exerciseCollection', [
    'records',
    'isFavourites',
  ]),
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
  },
};
</script>
