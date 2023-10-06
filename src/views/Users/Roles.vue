<template>
  <div>
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
              <li
                v-for="(roleItem, index) in roles"
                :key="index"
                :class="isRoleActive(roleItem.id) ? 'moj-side-navigation__item moj-side-navigation__item--active' : 'moj-side-navigation__item'"
              >
                <a
                  href="#"
                  class="moj-side-navigation__item"
                  @click.prevent="selectedRoleIndex = index"
                >
                  {{ roleItem.roleName }} {{ roleItem.isDefault ? '(Default)' : '' }}
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
          <div
            v-if="hasPermissions([PERMISSIONS.users.permissions.canCreateRoles.value])"
            class="govuk-grid-column-one-half"
          >
            <div class="text-right">
              <button
                class="govuk-button govuk-!-margin-right-1 govuk-!-margin-top-3 govuk-!-margin-bottom-3"
                @click="openCreateRoleModal"
              >
                Create a new role
              </button>
            </div>
          </div>
        </div>
        <div
          v-if="role"
          ref="role"
        >
          <h1>{{ role.roleName }}</h1>

          <div
            v-for="(value, key) in PERMISSIONS"
            :key="key"
          >
            <h2>{{ value.label }}</h2>
            <Checkbox
              v-for="(subValue, subKey) in value.permissions"
              :id="subKey"
              :key="subKey"
              v-model="permissions[subKey]"
            >
              {{ subValue.label }}
            </Checkbox>
          </div>

          <div v-if="hasPermissions([PERMISSIONS.users.permissions.canEditRolePermissions.value])">
            <ActionButton
              type="primary"
              class="govuk-!-margin-right-3"
              :action="saveRole"
            >
              Save role
            </ActionButton>
            <ActionButton
              type="secondary"
              :disabled="role.isDefault"
              :action="setDefaultRole"
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

    <Modal ref="modalRefCreateRole">
      <div class="modal__title govuk-!-padding-2 govuk-heading-m">
        Create a new role
      </div>
      <div class="modal__content govuk-!-margin-6">
        <TextField
          :id="`user_role_id`"
          v-model="newRoleName"
          label="User role name"
          type="text"
        />
        <ActionButton
          type="primary"
          class="govuk-!-margin-right-3"
          :action="createRole"
        >
          Save and set permissions
        </ActionButton>
        <button
          class="govuk-button govuk-button--secondary"
          @click="closeCreateRoleModal"
        >
          Cancel
        </button>
      </div>
    </Modal>
  </div>
</template>

<script>
import ActionButton from '@jac-uk/jac-kit/draftComponents/ActionButton.vue';
import Modal from '@jac-uk/jac-kit/components/Modal/Modal.vue';
import Checkbox from '@jac-uk/jac-kit/draftComponents/Form/Checkbox.vue';
import TextField from '@jac-uk/jac-kit/draftComponents/Form/TextField.vue';
import { functions } from '@/firebase';
import permissionMixin from '@/permissionMixin';

export default {
  name: 'UserRoles',
  components: {
    ActionButton,
    Modal,
    Checkbox,
    TextField,
  },
  mixins: [permissionMixin],
  props: {
    roles: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      selectedRoleIndex: null,
      newRoleName: null,
    };
  },
  computed: {
    role() {
      if (!this.roles || this.selectedRoleIndex === null) {
        return null;
      }
      return this.roles[this.selectedRoleIndex];
    },
    permissions() {
      const permissions = { ...this.rawPermissions };
      // set the enabled permissions for the role to true
      if (this.role?.enabledPermissions) {
        for (const permission of this.role.enabledPermissions) {
          if (permission in permissions) {
            permissions[permission] = true;
          }
        }
      }
      return permissions;
    },
  },
  updated() {
    const canEditRolePermissions = this.hasPermissions([this.PERMISSIONS.users.permissions.canEditRolePermissions.value]);
    if (!canEditRolePermissions) {
      this.disableEditRolePermissions();
    }
  },
  methods: {
    isRoleActive(roleId) {
      if (this.role) {
        return roleId === this.role.id;
      } else {
        return false;
      }
    },
    disableEditRolePermissions() {
      const roleRef = this.$refs.role;
      if (roleRef) {
        const inputs = roleRef.querySelectorAll('input');
        inputs && inputs.forEach(input => input.disabled = true);
      }
    },
    openCreateRoleModal(){
      this.$refs.modalRefCreateRole.openModal();
    },
    closeCreateRoleModal() {
      this.$refs.modalRefCreateRole.closeModal();
      this.resetNewRole();
    },
    async createRole() {
      try {
        await this.$store.dispatch('roles/create', { roleName: this.newRoleName, enabledPermissions: [] });
        this.closeCreateRoleModal();
      } catch (error) {
        return false;
      }
    },
    resetNewRole() {
      this.newRoleName = null;
    },
    async saveRole() {
      const enabledPermissions = [];
      for (const permission in this.permissions) {
        if (this.permissions[permission]) {
          enabledPermissions.push(permission);
        }
      }
      try {
        await this.$store.dispatch('roles/save', {
          roleId: this.role.id,
          data: {
            enabledPermissions,
          },
        });
        return true;
      } catch (error) {
        return false;
      }
    },
    async setDefaultRole() {
      try {
        await functions.httpsCallable('adminSetDefaultRole')({ roleId: this.role.id });
        return true;
      } catch (error) {
        return false;
      }
    },
  },
};
</script>
