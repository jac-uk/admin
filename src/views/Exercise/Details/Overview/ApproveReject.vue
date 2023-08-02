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
import { mapState } from 'vuex';
import _has from 'lodash/has.js';
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
      this.changes = this.getDeepObjectDifferences(this.vacancy, this.exercise, ['state']);
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
    getDeepObjectDifferences(obj1, obj2, keysToIgnore) {
      const differences = [];
      this.compareObjects(obj1, obj2, [], differences, keysToIgnore);
      return differences;
    },
    compareObjects(obj1, obj2, path = [], differences = [], keysToIgnore = []) {
      for (const key in obj1) {
        if (obj1.hasOwnProperty(key) && obj2.hasOwnProperty(key)) {
          const newPath = [...path, key];
          if (keysToIgnore.includes(key) || key.charAt(0) === '_') {
            // If the key is in the keysToIgnore array or begins with an underscore, skip the comparison
            continue;
          }
          //if (this.isObject(obj1[key]) && this.isObject(obj2[key]) && !this.isDate(obj2[key])) {
          if (this.isObject(obj1[key]) && this.isObject(obj2[key])) {
            this.compareObjects(obj1[key], obj2[key], newPath, differences, keysToIgnore);
          } else if (!this.isEqual(obj1[key], obj2[key])) {
            // If the values are different, store the top-level key in the differences array
            differences.push(newPath[0]);
          }
        }
      }
    },
    // Compare two values
    isEqual(value1, value2) {
      if (typeof value1 !== typeof value2) return false;
      if (typeof value1 === 'object') {
        // Use JSON.stringify to handle nested arrays and objects
        return JSON.stringify(value1) === JSON.stringify(value2);
      }
      return value1 === value2;
    },
    isObject(input) {
      return typeof input === 'object' &&
        !Array.isArray(input) &&
        input !== null &&
        //Object.keys(input).length > 0;  // Firestore timestamps are objects but have no keys
        !this.isDate(input);
    },
    isDate(input) {
      if (Object.prototype.toString.call(input) === '[object Date]')
        return true;
      return false;
    },
  },
};
</script>
