<template>
  <div>
    <!-- TODO: refactor into more logical file structure -->
    <LoadingMessage
      v-if="loaded === false"
      :load-failed="loadFailed"
    />
    <div v-if="loaded === true">
      <div class="print-none">
        <h1>User Management</h1>
        <TabsList
          :tabs="tabs"
          :active-tab.sync="activeTab"
        />
      </div>
      <div
        v-show="activeTab == 'users'"
        class="print-full-width"
      >
        <h2>List of admin users</h2>
        <Table class="govuk-table">
          <tr class="govuk-table__row">
            <th
              scope="row"
              class="govuk-table__header"
            >
              User
            </th>
            <th
              scope="row"
              class="govuk-table__header"
            />

            <th
              scope="row"
              class="govuk-table__header"
            >
              Role
            </th>
          </tr>
          <tr
            v-for="(user, userIndex) in users"
            :key="userIndex"
            class="govuk-table__row"
          >
            <td class="govuk-table__cell">
              <div class="govuk-heading-s govuk-!-margin-bottom-1">
                {{ user.displayName }}
              </div>
              <div>
                {{ user.email }}
              </div>
            </td>
            <td class="govuk-table__cell">
              <Warning
                v-if="!user.isJACEmployee"
                :message="'External user'"
              />
            </td>
            <td class="govuk-table__cell">
              <select
                v-model="user.customClaims.r"
                class="govuk-select govuk-!-margin-right-3"
                @change="setUserRole(user)"
              >
                <option
                  v-for="(role, roleIndex) in roles"
                  :key="roleIndex"
                  :value="role.id"
                >
                  {{ role.roleName }}
                </option>
              </select>
              <ActionButton
                :type="user.disabled ? 'primary' : 'secondary'"
                @click="toggleDisableUser(user.uid, userIndex)"
              >
                {{ user.disabled ? 'Enable user' : 'Disable user' }}
              </ActionButton>
            </td>
          </tr>
        </Table>
      </div>

      <div
        v-show="activeTab === 'roles'"
        class="print-full-width"
      >
        <div class="govuk-grid-row">
          <div class="govuk-grid-column-one-quarter print-none">
            <!-- TODO: consider refactoring this -->
            <nav
              class="moj-side-navigation govuk-!-padding-top-0"
              :aria-label="'side-navigation'"
            >
              <ul class="moj-side-navigation__list">
                <h4

                  class="moj-side-navigation__title"
                >
                  Roles
                </h4>
                <ul
                  v-if="roles.length > 0"
                  class="moj-side-navigation__list"
                >
                  <!-- TODO: Sort the active class -->
                  <li
                    v-for="(role, roleIndex) in roles"
                    :key="roleIndex"
                    :class=" isActive(role.id) ? 'moj-side-navigation__item moj-side-navigation__item--active' : 'moj-side-navigation__item'"
                  >
                    <a
                      href="#"
                      class="moj-side-navigation__item"
                      @click.prevent="viewRolePermissions(roleIndex)"
                    >
                      {{ role.roleName }} {{ role.isDefault ? '(Default)' : '' }}
                    </a>
                  </li>
                </ul>
                <span v-else>No roles</span>
              </ul>
            </nav>
          </div>
          <div class="govuk-grid-column-three-quarters print-full-width">
            <div class="govuk-grid-row print-none">
              <div class="govuk-grid-column-one-half">
                <h1>Roles</h1>
              </div>
              <div class="govuk-grid-column-one-half">
                <div class="text-right">
                  <button
                    class="govuk-button govuk-!-margin-right-1 govuk-!-margin-top-3 govuk-!-margin-bottom-3"
                    @click="openCreateRoleModal()"
                  >
                    Create a new role
                  </button>
                </div>
              </div>
            </div>
            <div v-if="role">
              <h1>{{ role.roleName }}</h1>

              <h2>Database</h2>
              <div>
                <Checkbox
                  id="canCreate"
                  v-model="permissions.canCreate"
                >
                  Can create
                </Checkbox>

                <Checkbox
                  id="canUpdate"
                  v-model="permissions.canUpdate"
                >
                  Can update
                </Checkbox>

                <Checkbox
                  id="canDelete"
                  v-model="permissions.canDelete"
                >
                  Can delete
                </Checkbox>
              </div>
              <h2>Users</h2>
              <div>
                <Checkbox
                  id="canEnableUsers"
                  v-model="permissions.canEnableUsers"
                >
                  Can enable users
                </Checkbox>
                <Checkbox
                  id="canChangeUserRole"
                  v-model="permissions.canChangeUserRole"
                >
                  Can change user role
                </Checkbox>
                <Checkbox
                  id="canEditRolePermissions"
                  v-model="permissions.canEditRolePermissions"
                >
                  Can edit role permissions
                </Checkbox>
              </div>
              <h2>Exercises</h2>
              <div>
                <Checkbox
                  id="canApproveExercise"
                  v-model="permissions.canApproveExercise"
                >
                  Can approve exercise
                </Checkbox>
                
                <Checkbox
                  id="canAddNotesToExercise"
                  v-model="permissions.canAddNotesToExercise"
                >
                  Can add notes to exercise
                </Checkbox>
                
                <Checkbox
                  id="canResetExercise"
                  v-model="permissions.canResetExercise"
                >
                  Can reset exercise
                </Checkbox>
                
                <Checkbox
                  id="canAmendAfterLaunch"
                  v-model="permissions.canAmendAfterLaunch"
                >
                  Can amend after launch
                </Checkbox>
              </div>
              <h2>Candidates</h2>
              <div>
                <Checkbox
                  id="canViewAllCandidates"
                  v-model="permissions.canViewAllCandidates"
                >
                  Can view all candidates
                </Checkbox>
                
                <Checkbox
                  id="canAddNotesToCandidates"
                  v-model="permissions.canAddNotesToCandidates"
                >
                  Can add notes to candidates
                </Checkbox>
              </div>
              <div>
                <ActionButton
                  type="primary"
                  class="govuk-!-margin-right-1"
                  @click="saveRole()"
                >
                  Save role
                </ActionButton>
                <ActionButton
                  type="secondary"
                  :disabled="role.isDefault"
                  @click="setDefaultRole()"
                >
                  Set as default role
                </ActionButton>
              </div>
            </div>
            <div v-else>
              <h3>Select a role on the left to edit.</h3>
            </div>
          </div>
        </div>
      </div>

    </div>
    <Modal
      ref="modalRef"
    >
      <div class="modal__title govuk-!-padding-2 govuk-heading-m">
        Create a new role
      </div>
      <div
        v-if="!roleId"
        class="modal__content govuk-!-margin-6"
      >
        <TextField
          :id="`user_role_id`"
          v-model="newRoleName"
          label="User role name"
          type="text"
        />
        <ActionButton
          class="govuk-!-margin-right-1"
          type="primary"
          @click="createUserRole"
        >
          Save and set permissions
        </ActionButton>
        <button
          class="govuk-button govuk-button--secondary govuk-!-margin-right-3"
          @click="closeModal('modalRef')"
        >
          Cancel
        </button>
      </div>
    </Modal>
    <Modal
      ref="changingRole"
    >
      <div class="modal__content govuk-!-margin-6">
        <h2>
          Please wait...
        </h2>
      </div>

    </Modal>
  </div>
</template>

<script>
import LoadingMessage from '@jac-uk/jac-kit/draftComponents/LoadingMessage';
import { functions } from '@/firebase';
import ActionButton from '@jac-uk/jac-kit/draftComponents/ActionButton';
import Warning from '@jac-uk/jac-kit/draftComponents/Warning';
import TabsList from '@jac-uk/jac-kit/draftComponents/TabsList';
import Modal from '@jac-uk/jac-kit/components/Modal/Modal';
import Checkbox from '@jac-uk/jac-kit/draftComponents/Form/Checkbox';
import TextField from '@jac-uk/jac-kit/draftComponents/Form/TextField';

export default {
  components: {
    LoadingMessage,
    ActionButton,
    Warning,
    TabsList,
    Modal,
    Checkbox,
    TextField,
  },
  data() {
    return {
      loaded: false,
      loadFailed: false,
      users: [],
      roles: [],
      activeTab: 'users',
      roleId: null,
      role: null,
      rolePermissions: null,
      newRoleName: null,
      permissions: {
        canCreate: false,
        canUpdate: false,
        canDelete: false,
        canEnableUsers: false,
        canChangeUserRole: false,
        canEditRolePermissions: false,
        canApproveExercise: false,
        canAddNotesToExercise: false,
        canResetExercise: false,
        canAmendAfterLaunch: false,
        canViewAllCandidates: false,
        canAddNotesToCandidates: false,
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
    rolesNav() {
      const rolesNav = [];
      for (const role of this.roles) {
        rolesNav.push({
          title: role.roleName,
          name: role.id,
        });
      }
      return rolesNav;
    },
  },
  async mounted() {
    try {
      await this.getRoles();
      const users = await functions.httpsCallable('adminGetUsers')();
      this.users = users.data;
      for (const user of this.users) {
        //TODO: add default role logic
        if (!user.customClaims) {
          user.customClaims = {
            r: 'not set',
          };
        }
      }
      this.loaded = true;
    } catch (e) {
      this.loadFailed = true;
      throw e;
    }
  },

  methods: {
    async getRoles() {
      const roles = await functions.httpsCallable('adminGetUserRoles')();
      this.roles = roles.data;
    },
    async toggleDisableUser(uid, index) {
      const response = await functions.httpsCallable('adminDisableUser')({ uid: uid });
      this.users[index].disabled = response.data.disabled;
    },
    openModal(modalRef){
      this.$refs[modalRef].openModal();
    },
    closeModal(modalRef) {
      this.rolePermissions = null;
      this.$refs[modalRef].closeModal();
      this.newRoleName = null;
    },
    async setUserRole(user) {
      this.openModal('changingRole');
      await functions.httpsCallable('adminSetUserRole')({ userId: user.uid, roleId: user.customClaims.r });
      this.closeModal('changingRole');
    },
    viewRolePermissions(roleIndex) {
      this.role = this.roles[roleIndex];
      // set all permissions to false
      for (const permission in this.permissions) {
        this.permissions[permission] = false;
      }
      // set the enabled permissions for the role to true
      if (this.role.enabledPermissions) {
        for (const permission of this.role.enabledPermissions) {
          this.permissions[permission] = true;
        }
      }

    },
    async createUserRole() {
      //TODO: enforce unique role name
      const response = await functions.httpsCallable('adminCreateUserRole')({ roleName: this.newRoleName });
      await this.getRoles();
      //this.role = Array.filter((role) => { return role.id === response.data.id; });
      this.role = this.roles.filter((role) => { return role.id === response.data.id; })[0];
      this.closeModal('modalRef');
    },
    async saveRole() {
      this.role.enabledPermissions = [];
      for (const permission in this.permissions) {
        if (this.permissions[permission]) {
          this.role.enabledPermissions.push(permission);
        }
      }
      await functions.httpsCallable('adminUpdateUserRole')({ roleId: this.role.id, enabledPermissions: this.role.enabledPermissions });
      return true;
    },
    async setDefaultRole() {
      await functions.httpsCallable('adminSetDefaultRole')({ roleId: this.role.id });
      await this.getRoles();
      this.role.isDefault = true;
      return true;
    },
    openCreateRoleModal() {
      this.openModal('modalRef');
    },
    isActive(roleId) {
      if (this.role) {
        return roleId === this.role.id;
      } else {
        return false;
      }
    },
  },

};
</script>

<style>
td .govuk-warning-text {
  margin-bottom: 0 !important;
}
</style>