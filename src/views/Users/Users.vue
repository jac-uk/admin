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
      <button
        v-if="hasPermissions([PERMISSIONS.users.permissions.canCreateUsers.value])"
        class="govuk-button"
        @click="openCreateUserModal"
      >
        Create
      </button>

      <h2>List of admin users</h2>

      <Table
        ref="usersTable"
        data-key="id"
        :data="users"
        :page-size="50"
        :columns="tableColumns"
        @change="getTableData"
      >
        <template #row="{row}">
          <TableCell :title="tableColumns[0].title">
            {{ row.name }}
          </TableCell>
          <TableCell :title="tableColumns[1].title">
            {{ row.email }}
          </TableCell>
          <TableCell :title="tableColumns[2].title">
            {{ row.roleName }}
            <select
              class="govuk-select govuk-!-margin-right-3 govuk-!-margin-bottom-2"
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
            <ActionButton
              v-if="row.disabled && hasPermissions([PERMISSIONS.users.permissions.canEnableUsers.value])"
              type="primary"
              class="govuk-!-margin-right-3"
              :click="() => enableUser(row)"
            >
              Enable user
            </ActionButton>
            <ActionButton
              v-if="!row.disabled && hasPermissions([PERMISSIONS.users.permissions.canEnableUsers.value])"
              type="secondary"
              class="govuk-!-margin-right-3"
              :click="() => disableUser(row)"
            >
              Disable user
            </ActionButton>

            <button
              v-if="hasPermissions([PERMISSIONS.users.permissions.canDeleteUsers.value])"
              class="govuk-button govuk-button--warning"
              @click="() => openDeleteUserModal(row)"
            >
              Delete user
            </button>
          </TableCell>
        </template>
      </Table>
    </div>

    <div
      v-show="activeTab === 'roles'"
      class="print-full-width"
    >
      <Roles :roles="roles" />
    </div>

    <Modal ref="modalRefDeleteUser">
      <div class="modal__title govuk-!-padding-2 govuk-heading-m">
        Are you sure to delete user?
      </div>
      <div class="modal__content govuk-!-margin-6">
        <ActionButton
          type="primary"
          class="govuk-!-margin-right-2"
          :click="deleteUser"
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

    <Modal ref="modalRefCreateUser">
      <div class="modal__title govuk-!-padding-2 govuk-heading-m">
        Create a new user
      </div>
      <div class="modal__content govuk-!-margin-6">
        <div
          class="govuk-grid-column-full"
          style="text-align: left;"
        >
          <TextField
            id="email"
            v-model="newUser.email"
            label="Email"
            hint="The email must be a JAC email address."
            type="email"
            autocomplete="off"
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

          <TextField
            id="password"
            v-model="newUser.password"
            label="Password"
            hint="The password must be a string with at least 6 characters."
            type="password"
            autocomplete="off"
            required
          />

          <div class="govuk-form-group">
            <label class="govuk-heading-m govuk-!-margin-bottom-2">Role</label>
            <select
              id="role"
              v-model="newUser.role"
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
          :disabled="!newUser.email || isDuplicateEmail || isNotJACEmail || !isValidPassword "
          :click="createUser"
        >
          Save
        </ActionButton>
        <button
          class="govuk-button govuk-button--secondary govuk-!-margin-right-3"
          @click="closeCreateUserModal"
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
import TextField from '@jac-uk/jac-kit/draftComponents/Form/TextField.vue';
import Roles from './Roles.vue';
import { functions } from '@/firebase';
import permissionMixin from '@/permissionMixin';

export default {
  name: 'Users',
  components: {
    Table,
    TableCell,
    ActionButton,
    TabsList,
    Modal,
    TextField,
    Roles,
  },
  mixins: [permissionMixin],
  data() {
    return {
      activeTab: 'users',
      tableColumns: [
        { title: 'Name', sort: 'name', direction: 'asc', default: true },
        { title: 'Email' },
        { title: 'Role' },
        { title: 'Action' },
      ],
      selectedUser: null,
      newUser: {
        email: '',
        password: '',
        role: '',
      },
    };
  },
  computed: {
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
      ];
    },
    users() {
      return this.$store.state.users.records;
    },
    roles() {
      return this.$store.state.roles.records;
    },
    isDuplicateEmail() {
      return this.users.map(user => user.email).includes(this.newUser.email);
    },
    isNotJACEmail() {
      return this.newUser.email && !this.newUser.email.match(/@judicialappointments.(digital|gov.uk)$/);
    },
    isValidPassword() {
      return this.newUser.password.length >= 6;
    },
    defaultUserRole() {
      const role = this.roles.find(r => r.isDefault);
      return role ? role.id : '';
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
    forceUpdateTable() {
      if (this.$refs['usersTable']) {
        // force update table as Table component doesn't update when data is changed after vue3 upgrade
        this.$refs['usersTable'].$forceUpdate();
      }
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
        this.forceUpdateTable();
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
        this.forceUpdateTable();
        return true;
      } catch (error) {
        return false;
      }
    },
    async deleteUser() {
      if (this.selectedUser) return false;

      try {
        await this.$store.dispatch('users/delete', this.selectedUser.id);
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
    openCreateUserModal() {
      this.openModal('modalRefCreateUser');
      this.newUser.role = this.defaultUserRole;
    },
    closeCreateUserModal() {
      this.closeModal('modalRefCreateUser');
      this.resetNewUser();
    },
    openDeleteUserModal(user) {
      this.openModal('modalRefDeleteUser');
      this.selectedUser = user;
    },
    closeDeleteUserModal() {
      this.closeModal('modalRefDeleteUser');
      this.selectedUser = null;
    },
    resetNewUser() {
      this.newUser = {
        email: '',
        password: '',
        role: '',
      };
    },
    async createUser() {
      try {
        const res = await functions.httpsCallable('createUser')({
          email: this.newUser.email,
          password: this.newUser.password, // need to pass password to create new user
        });
        if (res && res.data && 'uid' in res.data) {
          this.resetNewUser();
          setTimeout(() => {
            this.closeCreateUserModal();
          }, 1000);
          return true;
        }
      } catch (error) {
        return false;
      }
    },
  },
};
</script>
