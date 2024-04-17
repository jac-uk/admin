<template>
  <div>
    <div class="govuk-grid-row print-none">
      <div class="govuk-grid-column-full">
        <div class="text-right">
          <button
            v-if="hasPermissions([PERMISSIONS.panellists.permissions.canManagePanellists.value])"
            class="govuk-button govuk-!-margin-right-1 govuk-!-margin-bottom-0"
            @click="$refs['createPanellistModal'].openModal()"
          >
            Add a panellist
          </button>
        </div>
      </div>
    </div>

    <h1
      class="govuk-heading-xl govuk-!-margin-bottom-6"
    >
      Panellists
    </h1>

    <Table
      data-key="id"
      :data="tableData"
      :page-size="50"
      :columns="tableColumns"
      @change="getTableData"
    >
      <template #row="{row}">
        <TableCell :title="tableColumns[0].title">
          <RouterLink
            :to="{ name: 'panellists-view', params: { id: row.id } }"
          >
            {{ row.fullName }}
          </RouterLink>
        </TableCell>
        <TableCell :title="tableColumns[1].title">
          {{ row.email }}
        </TableCell>
        <TableCell :title="tableColumns[2].title">
          {{ row.phone }}
        </TableCell>
      </template>
    </Table>
    <!--
      Name, Phone, JAC Exercise Email, Sex, Ethnicity, Correspondence Email
    -->
    <Modal ref="createPanellistModal">
      <TitleBar>
        Create panellist
      </TitleBar>
      <PanellistsForm
        class="govuk-!-margin-6"
        @save="createPanellist"
        @cancel="$refs['createPanellistModal'].closeModal()"
      />
    </Modal>
  </div>
</template>

<script>
import Table from '@jac-uk/jac-kit/components/Table/Table.vue';
import TableCell from '@jac-uk/jac-kit/components/Table/TableCell.vue';
import Modal from '@jac-uk/jac-kit/components/Modal/Modal.vue';
import TitleBar from '@/components/Page/TitleBar.vue';
import PanellistsForm from './components/AddEdit.vue';
import permissionMixin from '@/permissionMixin';

export default {
  components: {
    Table,
    TableCell,
    Modal,
    TitleBar,
    PanellistsForm,
  },
  mixins: [permissionMixin],
  data() {
    return {
      tableColumns: [
        { title: 'Name', sort: 'fullName', default: true },
        { title: 'Correspondence Email', sort: 'email' },
        { title: 'Phone', sort: 'phone' },
      ],
    };
  },
  computed: {
    tableData() {
      return this.$store.state.panellists.records;
    },
  },
  methods: {
    getTableData(params) {
      this.$store.dispatch('panellists/bind', params);
    },
    async createPanellist(data) {
      await this.$store.dispatch('panellist/create', data );
      this.$refs['createPanellistModal'].closeModal();
    },
  },
};
</script>
