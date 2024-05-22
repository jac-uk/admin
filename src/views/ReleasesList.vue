<template>
  <div>
    <h1
      class="govuk-heading-xl govuk-!-margin-bottom-6"
    >
      Latest Releases
    </h1>
    <table class="govuk-table">
      <thead class="govuk-table__head">
        <tr class="govuk-table__row">
          <th
            v-for="item in releasesColumns"
            :key="item.title"
            scope="col"
            class="govuk-table__header"
          >
            {{ item.title }}
          </th>
        </tr>
      </thead>
      <tbody class="govuk-table__body">
        <tr
          v-for="item in releasesData"
          :key="item.id"
          class="govuk-table__row"
        >
          <th
            scope="row"
            class="govuk-table__header"
          >
            {{ item.title }}
          </th>
          <td class="govuk-table__cell">
            {{ item.tag_name }}
          </td>
          <td class="govuk-table__cell">
            {{ item.author }}
          </td>
          <td class="govuk-table__cell">
            {{ formatDate(item.published_at) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import permissionMixin from '@/permissionMixin';
import dayjs from 'dayjs';

export default {
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
