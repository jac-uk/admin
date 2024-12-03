<template>
  <div>
    <button
      v-if="hasPermissions([PERMISSIONS.users.permissions.canCreateUsers.value])"
      class="govuk-button"
      @click="openCreateUserInvitationModal"
    >
      Create
    </button>

    <h2>List of invited users</h2>

    <TabsList
      v-model:active-tab="activeTab"
      :tabs="tabs"
      class="print-none"
    />

    <Table
      :key="activeTab"
      ref="userInvitationsTable"
      data-key="id"
      class="govuk-!-margin-top-8"
      :data="records"
      :page-size="50"
      :columns="tableColumns"
      :search="['email']"
      @change="getTableData"
    >
      <template #row="{row}">
        <TableCell :title="tableColumns[0].title">
          {{ $filters.formatDate(row.createdAt) }}
        </TableCell>
        <TableCell :title="tableColumns[1].title">
          {{ row.email }}
        </TableCell>
        <TableCell :title="tableColumns[2].title">
          {{ getRoleName(row.roleId) }}
        </TableCell>
        <TableCell
          :title="tableColumns[3].title"
          class="capitalize"
        >
          {{ row.status }}
        </TableCell>
        <TableCell
          v-if="row.status === 'pending'"
          :title="tableColumns[4].title"
        >
          <div>
            <button
              v-if="hasPermissions([PERMISSIONS.users.permissions.canCreateUsers.value])"
              class="govuk-button govuk-button--secondary govuk-!-margin-right-3 govuk-!-margin-bottom-0"
              @click="() => openEditUserInvitationModal(row)"
            >
              Edit
            </button>
            <button
              v-if="hasPermissions([PERMISSIONS.users.permissions.canDeleteUsers.value])"
              class="govuk-button govuk-button--warning govuk-!-margin-bottom-0"
              @click="() => openDeleteUserInvitationModal(row)"
            >
              Delete
            </button>
          </div>
        </TableCell>
      </template>
    </Table>

    <Modal ref="modalRefUserInvitation">
      <div class="modal__title govuk-!-padding-2 govuk-heading-m">
        {{ `${userInvitation.id ? 'Edit' : 'Create'} a user invitation` }}
      </div>
      <div class="modal__content govuk-!-margin-6">
        <div
          class="govuk-grid-column-full"
          style="text-align: left;"
        >
          <TextField
            id="email"
            v-model="userInvitation.email"
            label="Email"
            hint="The email must be a JAC email address."
            type="email"
            autocomplete="off"
            :to-lower-case="true"
            required
          />
          <p
            v-if="isDuplicateEmail"
            class="govuk-error-message"
          >
            Duplicate Email
          </p>
          <p
            v-if="isNotJACEmail"
            class="govuk-error-message"
          >
            Please use a JAC email address
          </p>

          <div class="govuk-form-group">
            <label class="govuk-heading-m govuk-!-margin-bottom-2">Role</label>
            <select
              id="role"
              v-model="userInvitation.roleId"
              class="govuk-select"
              style="width: 100%;"
            >
              <option
                v-for="(roleItem, roleIndex) in roles"
                :key="roleIndex"
                :value="roleItem.id"
              >
                {{ roleItem.roleName }}
              </option>
            </select>
          </div>
        </div>

        <ActionButton
          type="primary"
          class="govuk-!-margin-right-3"
          :disabled="!userInvitation.email || isDuplicateEmail || isNotJACEmail || !userInvitation.roleId"
          :action="userInvitation.id ? updateUserInvitation : createUserInvitation"
        >
          Save
        </ActionButton>
        <button
          class="govuk-button govuk-button--secondary govuk-!-margin-right-3"
          @click="closeUserInvitationModal"
        >
          Cancel
        </button>
      </div>
    </Modal>

    <Modal ref="modalRefDeleteUserInvitation">
      <div class="modal__title govuk-!-padding-2 govuk-heading-m">
        Are you sure to delete user invitation?
      </div>
      <div class="modal__content govuk-!-margin-6">
        <ActionButton
          type="primary"
          class="govuk-!-margin-right-2"
          :action="deleteUserInvitation"
        >
          Delete
        </ActionButton>
        <button
          class="govuk-button govuk-button--secondary"
          @click="closeDeleteUserInvitationModal"
        >
          Cancel
        </button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { serverTimestamp } from '@firebase/firestore';
import TabsList from '@jac-uk/jac-kit/draftComponents/TabsList.vue';
import Table from '@jac-uk/jac-kit/components/Table/Table.vue';
import TableCell from '@jac-uk/jac-kit/components/Table/TableCell.vue';
import ActionButton from '@jac-uk/jac-kit/draftComponents/ActionButton.vue';
import Modal from '@jac-uk/jac-kit/components/Modal/Modal.vue';
import TextField from '@jac-uk/jac-kit/draftComponents/Form/TextField.vue';
import permissionMixin from '@/permissionMixin';

export default {
  name: 'UserInvitations',
  components: {
    TabsList,
    Table,
    TableCell,
    ActionButton,
    Modal,
    TextField,
  },
  mixins: [permissionMixin],
  props: {
    users: {
      type: Array,
      required: true,
    },
    roles: {
      type: Array,
      required: true,
    },
  },
  data() {
    const tabs = [
      {
        ref: 'pending',
        title: 'Pending',
      },
      {
        ref: 'completed',
        title: 'Completed',
      },
    ];

    return {
      tabs,
      activeTab: 'pending',
      userInvitation: {
        email: '',
        roleId: '',
        status: 'pending',
      },
      isDuplicateEmail: false,
      selectedUserInvitation: null,
    };
  },
  computed: {
    tableColumns() {
      const tableColumns = [
        { title: 'Created at' },
        { title: 'Email', direction: 'asc', sort: 'email', default: true },
        { title: 'Role' },
        { title: 'Status' },
      ];
      if (this.isPending) {
        tableColumns.push({ title: 'Action' });
      }
      return tableColumns;
    },
    isPending() {
      return this.activeTab === 'pending';
    },
    isCompleted() {
      return this.activeTab === 'completed';
    },
    records() {
      if (this.isPending) {
        return this.$store.state.userInvitations.userInvitationPendingRecords;
      } else if (this.isCompleted) {
        return this.$store.state.userInvitations.userInvitationCompletedRecords;
      } else {
        return [];
      }
    },
    isNotJACEmail() {
      return this.userInvitation.email && !this.userInvitation.email.match(/(.*@judicialappointments|.*@justice)[.](digital|gov[.]uk)/);
    },
    defaultUserRoleId() {
      const role = this.roles.find(r => r.isDefault);
      return role ? role.id : '';
    },
  },
  watch: {
    'userInvitation.email'() {
      this.isDuplicateEmail = false;
    },
  },
  methods: {
    getStatus() {
      let status = '';
      if (this.isPending) {
        status = 'pending';
      } else if (this.isCompleted) {
        status = 'completed';
      }
      return status;
    },
    getTableData(params) {
      this.$store.dispatch('userInvitations/bind', {
        status: this.getStatus(),
        ...params,
      });
    },
    getRoleName(roleId) {
      const role = this.roles.find(r => r.id === roleId);
      return role ? role.roleName : '';
    },
    async validateEmail(email) {
      const user = await this.$store.dispatch('users/getByEmail', email);
      const userInvitation = await this.$store.dispatch('userInvitations/getByEmail', { email });
      if (user || userInvitation?.status === 'pending') this.isDuplicateEmail = true;
      else this.isDuplicateEmail = false;
    },
    openCreateUserInvitationModal() {
      this.userInvitation.roleId = this.defaultUserRoleId;
      this.$refs['modalRefUserInvitation'].openModal();
    },
    openEditUserInvitationModal(userInvitation) {
      this.selectedUserInvitation = userInvitation;
      this.userInvitation.id = userInvitation.id;
      this.userInvitation.email = userInvitation.email;
      this.userInvitation.roleId = userInvitation.roleId;
      this.$refs['modalRefUserInvitation'].openModal();
    },
    closeUserInvitationModal() {
      this.$refs['modalRefUserInvitation'].closeModal();
      this.resetUserInvitation();
    },
    openDeleteUserInvitationModal(userInvitation) {
      this.userInvitation.id = userInvitation.id;
      this.$refs['modalRefDeleteUserInvitation'].openModal();
    },
    closeDeleteUserInvitationModal() {
      this.$refs['modalRefDeleteUserInvitation'].closeModal();
      this.resetUserInvitation();
    },
    resetUserInvitation() {
      this.userInvitation = {
        email: '',
        roleId: '',
        status: 'pending',
      };
      this.selectedUserInvitation = null;
    },
    async createUserInvitation() {
      await this.validateEmail(this.userInvitation.email);
      if (this.isDuplicateEmail) return false;

      try {
        const data = {
          ...this.userInvitation,
          createdAt: serverTimestamp(),
        };
        await this.$store.dispatch('userInvitations/create', data);
        this.closeUserInvitationModal();
        return true;
      } catch (error) {
        return false;
      }
    },
    async updateUserInvitation() {
      if (this.selectedUserInvitation.email === this.userInvitation.email) {
        this.isDuplicateEmail = false;
      } else {
        await this.validateEmail(this.userInvitation.email);
        if (this.isDuplicateEmail) return false;
      }

      try {
        const data = {
          id: this.userInvitation.id,
          data: {
            email: this.userInvitation.email,
            roleId: this.userInvitation.roleId,
          },
        };
        await this.$store.dispatch('userInvitations/save', data);
        this.closeUserInvitationModal();
        return true;
      } catch (error) {
        return false;
      }
    },
    async deleteUserInvitation() {
      try {
        await this.$store.dispatch('userInvitations/delete', this.userInvitation.id);
        this.closeDeleteUserInvitationModal();
        return true;
      } catch (error) {
        return false;
      }
    },
  },
};
</script>

<style scoped>
td {
  vertical-align: middle;
}

.capitalize::first-letter {
  text-transform: capitalize;
}
</style>
