<template>
  <div>
    <!-- New section for file upload status -->
    <div>
      <h2 class="govuk-heading-m govuk-!-margin-bottom-2">
        Virus Scanner functionality: {{ fileUploadStatus }}
      </h2>
    </div>

    <h2 class="govuk-heading-m govuk-!-margin-bottom-2">
      Latest Releases
    </h2>

    <div v-if="availability">
      <div>Last fetched: {{ lastFetchedDT }}</div>
      <Table
        data-key="id"
        :data="tableData"
        :page-size="50"
        :columns="tableColumns"
        @change="getTableData"
      >
        <template #row="{row}">
          <TableCell :title="tableColumns[0].title">
            {{ row.title }}
          </TableCell>
          <TableCell :title="tableColumns[1].title">
            {{ row.tag_name }}
          </TableCell>
          <TableCell :title="tableColumns[2].title">
            {{ row.author }}
          </TableCell>
          <TableCell :title="tableColumns[3].title">
            {{ row.published_at ? formatDate(row.published_at) : '' }}
          </TableCell>
        </template>
      </Table>
    </div>

    <div v-else>
      Unavailable
    </div>
  </div>
</template>

<script>
import permissionMixin from '@/permissionMixin';
import dayjs from 'dayjs';
import Table from '@jac-uk/jac-kit/components/Table/Table.vue';
import TableCell from '@jac-uk/jac-kit/components/Table/TableCell.vue';
import { mapState, mapGetters } from 'vuex';

export default {
  name: 'ReleasesList',
  components: {
    Table,
    TableCell,
  },
  mixins: [permissionMixin],
  data() {
    return {
      tableColumns: [
        { title: 'Repository', sort: 'title', direction: 'desc', default: true },
        { title: 'Tag Name' },
        { title: 'Author' },
        { title: 'Published At' },
      ],
    };
  },
  computed: {
    ...mapGetters({
      fileUploadEnabled: 'candidateSettings/getUploadStatus',
      lastFetchedDT: 'releases/getLastFetchedDT',
    }),
    ...mapState('releases', [
      'availability',
    ]),
    tableData() {
      return this.$store.state.releases.records;
    },
    fileUploadStatus() {
      return this.fileUploadEnabled ? 'Online' : 'Offline';
    },
  },
  created() {
    // Can make the calls synchronously below
    this.$store.dispatch('releases/getLatestReleases');
    this.$store.dispatch('candidateSettings/bind');
  },
  methods: {
    formatDate(dateStr) {
      return dateStr ? dayjs(dateStr).format('DD/MM/YYYY HH:mm:ss') : '';
    },
    getTableData(params) {
      this.$store.dispatch('releases/getLatestReleases', params);
    },
  },
};
</script>
