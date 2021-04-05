<template>
  <div
    class="js-enabled"
  >
    <div>
      <h1
        class="govuk-heading-xl govuk-!-margin-bottom-6"
      >
        Events
      </h1>
    </div>

    <TabsList
      :tabs="tabs"
      :active-tab.sync="activeTab"
    />

    <Table
      v-show="activeTab == 'info'"
      data-key="id"
      :data="info"
      :page-size="50"
      :columns="tableColumns"
      @change="getInfoData"
    >
      <template #row="{row}">
        <TableCell :title="tableColumns[0].title">
          {{ row.timestamp | formatDate('datetime') }}
        </TableCell>
        <TableCell :title="tableColumns[1].title">
          {{ row.user ? row.user.name : null }}
        </TableCell>
        <TableCell :title="tableColumns[1].title">
          {{ row.description }}
        </TableCell>
        <TableCell :title="tableColumns[2].title">
          *** detail to go here ***
        </TableCell>
      </template>
    </Table>

    <p v-if="activeTab === 'info' && !info.length">
      No events
    </p>

    <Table
      v-show="activeTab == 'warnings'"
      data-key="id"
      :data="warnings"
      :page-size="50"
      :columns="tableColumns"
      @change="getWarningsData"
    >
      <template #row="{row}">
        <TableCell :title="tableColumns[0].title">
          {{ row.timestamp | formatDate('datetime') }}
        </TableCell>
        <TableCell :title="tableColumns[1].title">
          {{ row.user ? row.user.name : null }}
        </TableCell>
        <TableCell :title="tableColumns[1].title">
          {{ row.description }}
        </TableCell>
        <TableCell :title="tableColumns[2].title">
          *** detail to go here ***
        </TableCell>
      </template>
    </Table>

    <p v-if="activeTab === 'warnings' && !warnings.length">
      No events
    </p>

    <Table
      v-show="activeTab == 'errors'"
      data-key="id"
      :data="errorEvents"
      :page-size="50"
      :columns="tableColumns"
      @change="getErrorsData"
    >
      <template #row="{row}">
        <TableCell :title="tableColumns[0].title">
          {{ row.timestamp | formatDate('datetime') }}
        </TableCell>
        <TableCell :title="tableColumns[1].title">
          {{ row.user ? row.user.name : null }}
        </TableCell>
        <TableCell :title="tableColumns[1].title">
          {{ row.description }}
        </TableCell>
        <TableCell :title="tableColumns[2].title">
          *** detail to go here ***
        </TableCell>
      </template>
    </Table>

    <p v-if="activeTab === 'errors' && !errorEvents.length">
      No events
    </p>
  </div>
</template>

<script>
import Table from '@jac-uk/jac-kit/components/Table/Table';
import TableCell from '@jac-uk/jac-kit/components/Table/TableCell';
import TabsList from '@jac-uk/jac-kit/draftComponents/TabsList';
import Form from '@jac-uk/jac-kit/draftComponents/Form/Form';

export default {
  components: {
    Table,
    TableCell,
    TabsList,
  },
  extends: Form,
  data() {
    return {
      activeTab: 'info',
      formData: {
        delayInMinutes: 5,
        defaultMailbox: '',
        sendToRecipient: false,
      },
      tableColumns: [
        { title: 'Created', sort: 'createdAt', direction: 'desc', default: true },
        { title: 'Template' },
        { title: 'To' },
        { title: 'Status' },
      ],
    };
  },
  computed: {
    tabs(){
      return [
        {
          ref: 'info',
          title: 'Info',
        },
        {
          ref: 'warnings',
          title: 'Warnings',
        },
        {
          ref: 'errors',
          title: 'Errors',
        },
      ];
    },
    info() {
      return this.$store.state.events.info;
    },
    warnings() {
      return this.$store.state.events.warnings;
    },
    errorEvents() {
      return this.$store.state.events.errors;
    },
  },
  created() {

  },
  methods: {
    getInfoData(params) {
      this.$store.dispatch(
        'events/bindInfo',
        params,
      );
    },
    getWarningsData(params) {
      this.$store.dispatch(
        'events/bindWarnings',
        params,
      );
    },
    getErrorsData(params) {
      this.$store.dispatch(
        'events/bindErrors',
        params,
      );
    },
  },
};
</script>
