<template>
  <div>
    <div class="modal__title govuk-!-padding-2 govuk-heading-m">
      Permissions
    </div>
    <div
      v-if="!roleId"
      class="modal__content govuk-!-margin-6"
    >
      <TextField
        :id="`user_role_id`"
        v-model="roleName"
        label="User role name"
        type="text"
      />
      <ActionButton
        class="govuk-!-margin-right-1"
        type="primary"
        @click="createUserRole"
      >
        Save
      </ActionButton>
      <button
        class="govuk-button govuk-button--secondary govuk-!-margin-right-3"
        @click="closeModal"
      >
        Cancel
      </button>
    </div>
    <div
      v-if="roleId"
      class="modal__content govuk-!-margin-6"
    >
      <div class="govuk-grid-row">
        <div
          v-for="(permissionGroup, index) in permissions"
          :key="index"
          class="govuk-grid-column-one-quarter"
        >
          <h2 class="govuk-!-margin-top-0 govuk-!-margin-bottom-0">
            {{ permissionGroup.group }}
          </h2>
          <Table
            ref="exercisesTable"
            data-key="value"
            :data="permissionGroup.permissions"
            :page-size="50"
            :columns="tableColumns"
            multi-select
            :selection.sync="permissionGroup.enabledPermissions"
          >
            <template #row="{row}">
              <TableCell :title="tableColumns[0].title">
                {{ row.label }}
              </TableCell>
            </template>
          </Table>
        </div>
      </div>
      <div class="govuk-grid-row">
        <ActionButton
          type="primary"
          class="govuk-button govuk-!-margin-right-3"
          @click="saveUserRole()"
        >
          Save
        </ActionButton>
        <button
          class="govuk-button govuk-button--secondary govuk-!-margin-right-3"
          @click="closeModal"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { functions } from '@/firebase';
import TextField from '@jac-uk/jac-kit/draftComponents/Form/TextField';
// import Checkbox from '@jac-uk/jac-kit/draftComponents/Form/Checkbox';
import ActionButton from '@jac-uk/jac-kit/draftComponents/ActionButton';
import Table from '@jac-uk/jac-kit/components/Table/Table';
import TableCell from '@jac-uk/jac-kit/components/Table/TableCell';

export default {
  name: 'UserRolePermissions',
  components: {
    // Checkbox,
    Table,
    TableCell,
    TextField,
    ActionButton,
  },
  props: {
    roleId: {
      type: String,
      required: false,
      default: null,
    },

    permissions: {
      type: Array,
      required: false,
      default: () => [
        {
          group: 'Database',
          enabledPermissions: [],
          permissions: [
            {
              label: 'Can create',
              value: 'canCreate',
            },
            {
              label: 'Can update',
              value: 'canUpdate',
            },
            {
              label: 'Can delete',
              value: 'canDelete',
            },
          ],
        },
        {
          group: 'Users',
          enabledPermissions: [],
          permissions: [
            {
              label: 'Can enable users',
              value: 'canEnableUsers',
            },
            {
              label: 'Can change user role',
              value: 'canChangeUserRole',
            },
            {
              label: 'Can edit role permissions',
              value: 'canEditRolePermissions',
            },
          ],
        },
        {
          group: 'Exercises',
          enabledPermissions: [],
          permissions: [
            {
              label: 'Can approve exercise',
              value: 'canApproveExercise',
            },
            {
              label: 'Can add notes to exercise',
              value: 'canAddNotesToExercise',
            },
            {
              label: 'Can reset exercise',
              value: 'canResetExercise',
            },
            {
              label: 'Can amend after launch',
              value: 'canAmendAfterLaunch',
            },
          ],
        },
        {
          group: 'Candidates',
          enabledPermissions: [],
          permissions: [
            {
              label: 'Can view all candidates',
              value: 'canViewAllCandidates',
            },
            {
              label: 'Can add notes to candidates',
              value: 'canAddNotesToCandidates',
            },
          ],
        },
      ],
    },
  },
  data() {
    return {
      roleName: null,
      tableColumns: [
        { title: '' },
      ],
    };
  },

  methods: {
    closeModal() {
      this.$emit('close');
    },
    async createUserRole() {
      // TODO: enforce unique role name
      const response = await functions.httpsCallable('adminCreateUserRole')({ roleName: this.roleName });
      this.roleId = response.data.id;
    },
    async saveUserRole() {
      const response = await functions.httpsCallable('adminUpdateUserRole')({ roleId: this.roleId, permissions: this.permissions });
      return response;
    },
  },
};
</script>

<style>
.govuk-table__header .govuk-checkboxes__item {
  display: none;
}
.wide .modal {
  width: 90%;
}
</style>
