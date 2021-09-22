<template>
  <div
    v-if="exercise.roles && exercise.roles.length > 1"
    class="govuk-grid-row"
  >
    <div
      class="govuk-grid-column-full"
    >
      <div
        class="float-right"
      >
        <h4
          class="govuk-heading-s govuk-!-margin-right-3"
          style="display: inline-block;"
        >
          Viewing data for
        </h4>
        <select
          v-model="selectedRole"
          class="govuk-select"
          style="display:inline-block"
        >
          <option
            v-for="(role, roleIndex) in exercise.roles"
            :key="roleIndex"
            :value="roleIndex"
          >
            {{ role }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RoleSelector',
  computed: {
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    selectedRole: {
      get() {
        return this.$store.state.exerciseDocument.role;
      },
      set(value) {
        this.updateSelectedRole(value);
      },
    },
    selectedRoleExercise() {
      return this.$store.state.exerciseDocument.roleExerciseId;
    },
  },
  created: function() {
    let selectedRoleIndex = null;
    // if it is a multi role exercise
    if (this.exercise.roles) {
      // if the selected role is not set in the store, or the exercise ID has changed
      if (this.selectedRole === null || this.selectedRoleExercise !== this.exercise.id) {
        selectedRoleIndex = 0; // set it to the first role
        this.updateSelectedRole(selectedRoleIndex);
      } else {
        selectedRoleIndex = this.selectedRole; // else reuse previously set selection
      }
    } else if (this.selectedRole !== null) {
      this.updateSelectedRole(selectedRoleIndex);
    }

  },
  methods: {
    updateSelectedRole(roleIndex) {
      this.$store.dispatch('exerciseDocument/updateSelectedRole', roleIndex);
    },
  },
};
</script>

<style scoped>

</style>
