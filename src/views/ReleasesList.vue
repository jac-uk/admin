<template>
  <div>
    <h1
      class="govuk-heading-xl govuk-!-margin-bottom-6"
    >
      Latest Releases
    </h1>
    <Table
      data-key="id"
      :data="releasesData"
      :page-size="50"
      :columns="releasesColumns"
      @change="getReleasesData"
    >
      <template #row="{row}">
        <TableCell :title="releasesColumns[0].title">
          {{ row.title }}
        </TableCell>
        <TableCell :title="releasesColumns[1].title">
          {{ row.tag_name }}
        </TableCell>
        <TableCell :title="releasesColumns[2].title">
          {{ row.author }}
        </TableCell>
        <TableCell :title="releasesColumns[3].title">
          {{ row.published_at ? formatDate(row.published_at) : '' }}
        </TableCell>
      </template>
    </Table>
  </div>
</template>

<script>
import permissionMixin from '@/permissionMixin';
import dayjs from 'dayjs';
import Table from '@jac-uk/jac-kit/components/Table/Table.vue';
import TableCell from '@jac-uk/jac-kit/components/Table/TableCell.vue';

export default {
  name: 'ReleasesList',
  components: {
    Table,
    TableCell,
  },
  mixins: [permissionMixin],
  data() {
    return {
      releasesColumns: [
        { title: 'Repository' },
        { title: 'Tag Name' },
        { title: 'Author' },
        { title: 'Published At' },
      ],
    };
  },
  computed: {
    releasesData() {
      return this.$store.state.releases.records;
    },
  },
  created() {
    this.$store.dispatch('releases/getLatestReleases');
  },
  methods: {
    formatDate(dateStr) {
      return dateStr ? dayjs(dateStr).format('DD/MM/YYYY HH:mm:ss') : '';
    },
    getReleasesData(params) {
      this.$store.dispatch('releases/getLatestReleases', params);
    },
  },
};
</script>
