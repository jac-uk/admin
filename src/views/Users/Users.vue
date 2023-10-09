<template>
  <div>
    <div class="print-none">
      <h1>User Management</h1>
      <TabsList
        v-model:active-tab="activeTab"
        :tabs="tabs"
      />
    </div>

    <div
      v-show="activeTab == 'users'"
      class="print-full-width"
    >
      <h2>List of admin users</h2>

      <Table
        ref="usersTable"
        data-key="id"
        :data="users"
        :page-size="50"
        :columns="tableColumns"
        :search="['email']"
        @change="getTableData"
      >
        <template #row="{row}">
          <TableCell :title="tableColumns[0].title">
            {{ row.displayName }}
          </TableCell>
          <TableCell :title="tableColumns[1].title">
            {{ row.email }}
          </TableCell>
          <TableCell :title="tableColumns[2].title">
            {{ row.roleName }}
            <select
              class="govuk-select"
              :value="row.role.id"
              :disabled="!hasPermissions([PERMISSIONS.users.permissions.canChangeUserRole.value])"
              @change="event => handleRoleChange(event, row)"
            >
              <option
                v-for="(roleItem, roleIndex) in roles"
                :key="roleIndex"
                :value="roleItem.id"
              >
                {{ roleItem.roleName }}
              </option>
            </select>
          </TableCell>
          <TableCell :title="tableColumns[3].title">
            <div style="display: flex; gap: 15px;">
              <ActionButton
                v-if="row.disabled && hasPermissions([PERMISSIONS.users.permissions.canEnableUsers.value])"
                type="primary"
                class="govuk-!-margin-bottom-0"
                :action="() => enableUser(row)"
              >
                Enable
              </ActionButton>
              <ActionButton
                v-if="!row.disabled && hasPermissions([PERMISSIONS.users.permissions.canEnableUsers.value])"
                type="secondary"
                class="govuk-!-margin-bottom-0"
                :action="() => disableUser(row)"
              >
                Disable
              </ActionButton>

              <button
                v-if="hasPermissions([PERMISSIONS.users.permissions.canDeleteUsers.value])"
                class="govuk-button govuk-button--warning govuk-!-margin-bottom-0"
                @click="() => openDeleteUserModal(row)"
              >
                Delete
              </button>
            </div>
          </TableCell>
        </template>
      </Table>
    </div>

    <div
      v-if="activeTab === 'roles'"
      class="print-full-width"
    >
      <Roles :roles="roles" />
    </div>

    <div
      v-if="activeTab === 'invitations'"
      class="print-full-width"
    >
      <UserInvitations
        :users="users"
        :roles="roles"
      />
    </div>

    <Modal ref="modalRefDeleteUser">
      <div class="modal__title govuk-!-padding-2 govuk-heading-m">
        Are you sure to delete user?
      </div>
      <div class="modal__content govuk-!-margin-6">
        <ActionButton
          type="primary"
          class="govuk-!-margin-right-2"
          :action="deleteUser"
        >
          Delete
        </ActionButton>
        <button
          class="govuk-button govuk-button--secondary"
          @click="closeDeleteUserModal"
        >
          Cancel
        </button>
      </div>
    </Modal>
  </div>
</template>

<script>
import Table from '@jac-uk/jac-kit/components/Table/Table.vue';
import TableCell from '@jac-uk/jac-kit/components/Table/TableCell.vue';
import ActionButton from '@jac-uk/jac-kit/draftComponents/ActionButton.vue';
import TabsList from '@jac-uk/jac-kit/draftComponents/TabsList.vue';
import Modal from '@jac-uk/jac-kit/components/Modal/Modal.vue';
import Roles from './Roles.vue';
import UserInvitations from './Invitations.vue';
import permissionMixin from '@/permissionMixin';

export default {
  name: 'Users',
  components: {
    Table,
    TableCell,
    ActionButton,
    TabsList,
    Modal,
    Roles,
    UserInvitations,
  },
  mixins: [permissionMixin],
  data() {
    return {
      activeTab: 'users',
      tableColumns: [
        { title: 'Name' },
        { title: 'Email', sort: 'email', direction: 'asc', default: true },
        { title: 'Role' },
        { title: 'Action' },
      ],
      selectedUser: null,
    };
  },
  computed: {
    userId() {
      return this.$store.state.auth.currentUser.uid;
    },
    tabs() {
      return [
        {
          ref: 'users',
          title: 'Users',
        },
        {
          ref: 'roles',
          title: 'Roles',
        },
        {
          ref: 'invitations',
          title: 'Invitations',
        },
      ];
    },
    users() {
      return this.$store.state.users.records;
    },
    roles() {
      return this.$store.state.roles.records;
    },
  },
  mounted() {
    this.$store.dispatch('roles/bind', {
      orderBy: 'roleName',
      direction: 'asc',
    });
  },
  methods: {
    getTableData(params) {
      this.$store.dispatch('users/bind', params);
    },
    handleRoleChange(event, user) {
      const roleId = event.target.value;
      this.$store.dispatch('users/save', {
        userId: user.id,
        data: {
          role: {
            id: roleId,
            isChanged: true,
          },
        },
      });
    },
    async enableUser(user) {
      try {
        await this.$store.dispatch('users/save', {
          userId: user.id,
          data: { disabled: false },
        });
        return true;
      } catch (error) {
        return false;
      }
    },
    async disableUser(user) {
      try {
        await this.$store.dispatch('users/save', {
          userId: user.id,
          data: {
            disabled: true,
          },
        });
        return true;
      } catch (error) {
        return false;
      }
    },
    async deleteUser() {
      if (!this.selectedUser) return false;

      try {
        await this.$store.dispatch('users/delete', this.selectedUser.id);
        setTimeout(() => {
          this.closeDeleteUserModal();
        }, 200);
        return true;
      } catch (error) {
        return false;
      }
    },
    openModal(modalRef){
      this.$refs[modalRef].openModal();
    },
    closeModal(modalRef) {
      this.$refs[modalRef].closeModal();
    },
    openDeleteUserModal(user) {
      this.openModal('modalRefDeleteUser');
      this.selectedUser = user;
    },
    closeDeleteUserModal() {
      this.closeModal('modalRefDeleteUser');
      this.selectedUser = null;
    },
  },
};
</script>

<style scoped>
td {
  vertical-align: middle;
}
</style>
