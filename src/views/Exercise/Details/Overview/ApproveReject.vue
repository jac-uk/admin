<template>
  <div class="background-light-grey govuk-!-padding-left-4 govuk-!-padding-top-4 govuk-!-padding-bottom-4 govuk-!-margin-bottom-4">
    <div class="govuk-warning-text govuk-!-margin-0">
      <span
        class="govuk-warning-text__icon"
        aria-hidden="true"
      >!</span>
      <strong class="govuk-warning-text__text">
        <span class="govuk-warning-text__assistive">Warning</span>
        This exercise is waiting for your approval.
      </strong>

      <div class="govuk-!-padding-left-8">
        <template v-if="rejectionResponse">
          <p>The requester has replied to the original rejection reason below:</p>
          <div
            id="messages"
          >
            <div class="moj-message-list">
              <div
                v-if="rejectionMessage"
                class="moj-message-item moj-message-item--sent"
              >
                <div class="moj-message-item__text moj-message-item__text--sent">
                  {{ rejectionMessage }}
                </div>
              </div>
              <div
                v-if="rejectionResponse"
                class="moj-message-item moj-message-item--received"
              >
                <div class="moj-message-item__text moj-message-item__text--received">
                  {{ rejectionResponse }}
                </div>
              </div>
            </div>
          </div>
        </template>
        <p>Please verify the content of the exercise and Approve or Reject.</p>
        <div
          v-if="hasChanges"
          class="govuk-inset-text"
        >
          The following fields have changed: {{ formattedChanges }}
        </div>
        <div>
          <button
            :disabled="!isReadyForApprovalFromAdvertType"
            class="govuk-button govuk-button--warning govuk-!-margin-right-3 govuk-!-margin-bottom-0"
            @click="reject"
          >
            Reject
          </button>
          <button
            :disabled="!isReadyForApprovalFromAdvertType"
            class="govuk-button govuk-!-margin-bottom-0"
            @click="approve"
          >
            Approve
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import permissionMixin from '@/permissionMixin';
import { isReadyForApprovalFromAdvertType } from '@/helpers/exerciseHelper';
import { deepKeysDiff } from '@jac-uk/jac-kit/helpers/object';
import { mapState } from 'vuex';
import _has from 'lodash/has.js';
import _get from 'lodash/get.js';
export default {
  name: 'ApproveReject',
  mixins: [permissionMixin],
  emits: ['reject'],
  data() {
    return {
      changes: [],
    };
  },
  computed: {
    ...mapState({
      userId: state => state.auth.currentUser.uid,
      displayName: state => state.auth.currentUser.displayName,
    }),
    exercise() {
      return this.$store.getters['exerciseDocument/data']();
    },
    exerciseId() {
      return this.$store.state.exerciseDocument.record.id;
    },
    isReadyForApprovalFromAdvertType() {
      return isReadyForApprovalFromAdvertType(this.exercise);
    },
    rejectionResponse() {
      return _get(this.exercise, '_approval.rejected.response', null);
    },
    rejectionMessage() {
      return _get(this.exercise, '_approval.rejected.message', null);
    },
    exerciseWasPreviouslyApproved() {
      return _has(this.exercise, '_approval.approved.date');
    },
    vacancy() {
      return this.$store.getters['vacancy/data']();
    },
    formattedChanges() {
      return this.changes.map(element => {
        return element.replace(/([A-Z])/g, ' $1').replace(/^./, (str) =>{ return str.toUpperCase(); });
      }).join(', ');
    },
    hasChanges() {
      return this.changes.length > 0;
    },
  },
  mounted() {
    this.$store.dispatch('vacancy/bind', this.exerciseId).then(() => {
      // Below only compares fields that exist in the first object
      this.changes = deepKeysDiff(this.vacancy, this.exercise, ['state']);
    });
  },
  methods: {
    async approve() {
      await this.$store.dispatch('exerciseDocument/updateApprovalProcess', {
        userId: this.userId,
        userName: this.displayName,
        decision: 'approved',
      });
    },
    reject() {
      this.$emit('reject');
    },
  },
};
</script>
<style scoped>
  .moj-message-item--received {
    background-color: #fff;
  }
  .moj-message-list {
    min-height: auto;
  }
</style>
