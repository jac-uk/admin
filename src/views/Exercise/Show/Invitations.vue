<template>
  <div>
    <div class="text-right">
      <router-link
        v-if="isEditable"
        class="govuk-link"
        :to="{name: 'exercise-edit-invitations'}"
      >
        Update exercise invitations
      </router-link>
    </div>
    <h1 class="govuk-heading-xl">
      Exercise invitations
    </h1>
    <table
      class="govuk-table"
    >
      <tbody class="govuk-table__body">
        <tr
          v-for="invite in invitations"
          :key="invite.id"
          class="govuk-table__row"
        >
          <td
            scope="col"
            class="govuk-table__header"
          >
            {{ invite.candidate.email }}
          </td>
          <div v-if="!isEditable">
            <td
              scope="col"
              class="govuk-table__header govuk-table__header--numeric"
            >
              <strong
                :id="`${invite.candidate.id}-invite`"
                :class="tagClass(invite.status)"
              >
                {{ invite.status }}
              </strong>
            </td>
            <td
              scope="col"
              class="govuk-table__header govuk-table__header--numeric"
            >
              {{ invite.statusLog[invite.status] | formatDate }}
            </td>
          </div>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      invitationsSent: false,
    };
  },
  computed: {
    ...mapGetters('exerciseDocument', {
      isEditable: 'isEditable',
    }),
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    invitations() {
      return this.$store.state.invitations.records;
    },
  },
  created() {
    this.$store.dispatch('invitations/bind', { exerciseId: this.exercise.id });
  },
  methods: {
    tagClass(status){
      let result = 'govuk-tag';
      if (status === 'invited'){
        result += '--yellow';
      } else if (status === 'accepted'){
        result += '--green';
      } else if (status === 'rejected'){
        result += '--red';
      }
      return result;
    },
  },
};
</script>

<style type="text/css" rel="stylesheet/scss" lang="scss" scoped>
  .govuk-summary-list__value,
  .govuk-summary-list__value:last-child,
  .govuk-summary-list__key {
    @include govuk-media-query($from: tablet) {
      width: auto;
    }
  }
</style>
