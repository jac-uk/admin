<template>
  <div>
    <div v-if="users">
      <h2 class="govuk-heading-l">
        User roles
      </h2>
      <Table
        data-key="id"
        :data="userData"
        :search="['fullName']"
        :columns="[
          { title: 'Name', sort: 'name', default: true },
          { title: 'Email' },
          { title: 'Role' },
        ]"
        :filters="[
          {
            title: 'Admin',
            field: 'admin',
            type: 'checkbox',
            options: roles,
          },
        ]"
        :selection.sync="selectedUsers"
        multi-select
        :page-size="50"
      >
        <template #row="{row}">
          <TableCell :title="tableColumns[0].title">
            {{ row.displayName }}
          </TableCell>
          <TableCell :title="tableColumns[1].title">
            {{ row.email }}
          </TableCell>
          <TableCell :title="tableColumns[2].title">
            {{ row.role }}
          </TableCell>
        </template>
      </Table>
    </div>
    <div v-else>
      <h3>No users available</h3>
    </div>
    <div class="govuk-form-group">
      <Select
        id="role"
        v-model="selectedRole"
        :disabled="!selectedUsers.length"
      >
        <option
          style="display:none;"
          selected
          value=""
        >
          Choose a role
        </option>
        <option value="user">
          user
        </option>
        <option value="admin">
          admin
        </option>
        <option value="manager">
          manager
        </option>
      </Select>
    </div>
    <ActionButton
      type="primary"
      :disabled="!selectedUsers.length"
      @click="changeRole()"
    >
      Change role
    </ActionButton>
  </div>
</template>

<script>
import { users } from '@/helpers/users';
import Table from '@jac-uk/jac-kit/components/Table/Table';
import TableCell from '@jac-uk/jac-kit/components/Table/TableCell';
import ActionButton from '@jac-uk/jac-kit/draftComponents/ActionButton';
import Select from '@jac-uk/jac-kit/draftComponents/Form/Select';

export default {
  name: 'Users',
  components: {
    Table,
    TableCell,
    ActionButton,
    Select,
  },
  data() {
    return {
      users: users,
      roles: ['admin', 'manager', 'user'],
      searchUser: '',
      selectedUsers: [],
      selectedRole: '',
      tableColumns: [
        { title: 'Name', sort: 'user.displayName', default: true },
        { title: 'Email' },
        { title: 'Role' },
      ],
    };
  },
  computed: {
    isButtonDisabled() {
      const isDisabled = this.selectedItems && this.selectedItems.length;
      return !isDisabled;
    },
    userData() {
      return this.users;
    },
  },
  methods: {
    changeRole() {
      this.selectedUsers.forEach(selectedUser => {
        users.forEach(user => {
          if (user.id === selectedUser) {
            user.role = this.selectedRole;
          }
        });
      });
      this.saveData(users);
    },
    saveData(users) {
      const data = JSON.stringify(users);
      localStorage.setItem('users', data);
    },

  },
  getUserData() {
    console.log('calling');
    const data = JSON.parse(localStorage.getItem('users'));
    console.log(data);
    return data;
  },
};
</script>
