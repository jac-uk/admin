<template>
  <div>
    <h1 class="govuk-heading-xl govuk-!-margin-bottom-6">
      Latest Releases
    </h1>

    <!-- New section for file upload status -->
    <div>
      <h2 class="govuk-heading-m">
        Virus Scanner functionality: {{ fileUploadStatus }}
      </h2>
    </div>

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
</template>

<script>
import permissionMixin from '@/permissionMixin';
import dayjs from 'dayjs';
import Table from '@jac-uk/jac-kit/components/Table/Table.vue';
import TableCell from '@jac-uk/jac-kit/components/Table/TableCell.vue';
import { collection, doc, getDoc } from 'firebase/firestore';
import { firestore } from '@/firebase';

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
      fileUploadEnabled: false, // To store the file upload status
    };
  },
  computed: {
    tableData() {
      return this.$store.state.releases.records;
    },
    fileUploadStatus() {
      return this.fileUploadEnabled ? 'Online' : 'Offline';
    },
  },
  created() {
    this.$store.dispatch('releases/getLatestReleases');
    this.fetchFileUploadStatus();
  },
  methods: {
    formatDate(dateStr) {
      return dateStr ? dayjs(dateStr).format('DD/MM/YYYY HH:mm:ss') : '';
    },
    getTableData(params) {
      this.$store.dispatch('releases/getLatestReleases', params);
    },
    async fetchFileUploadStatus() {
      try {
        // Reference to the 'settings' collection
        const settingsRef = collection(firestore, 'settings');

        // Reference to the 'candidateSettings' subcollection within 'settings'
        const candidateSettingsRef = collection(settingsRef, 'candidateSettings');

        // Reference to the 'bypasses' subcollection within 'candidateSettings'
        const bypassesRef = collection(candidateSettingsRef, 'bypasses');

        // Reference to the 'fileUpload' document within 'bypasses'
        const fileUploadDoc = doc(bypassesRef, 'fileUpload');

        // Fetch the feature flag
        const docSnapshot = await getDoc(fileUploadDoc);
        this.fileUploadEnabled = docSnapshot.exists() ? docSnapshot.data().enabled : false;
      } catch (error) {
        console.error('Failed to fetch file upload status:', error);
        this.fileUploadEnabled = false; // Default to false if there's an error
      }
    },
  },
};
</script>
