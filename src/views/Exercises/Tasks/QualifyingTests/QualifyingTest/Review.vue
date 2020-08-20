<template>
  <div class="govuk-grid-column-full">
    <BackLink />

    <div class="text-right">
      <router-link
        class="govuk-link"
        :to="{name: 'qualifying-test-edit'}"
      >
        Update details
      </router-link>
    </div>

    <h2 class="govuk-heading-l">
      Review qualifying test
    </h2>

    <dl class="govuk-summary-list">
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Type
        </dt>
        <dd class="govuk-summary-list__value">
          {{ qualifyingTest.type | lookup }}
        </dd>
      </div>
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Status
        </dt>
        <dd class="govuk-summary-list__value">
          {{ qualifyingTest.status | lookup }}
        </dd>
      </div>
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Title
        </dt>
        <dd class="govuk-summary-list__value">
          {{ qualifyingTest.title }}
        </dd>
      </div>
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Start date
        </dt>
        <dd class="govuk-summary-list__value">
          {{ qualifyingTest.startDate | formatDate('datetime') }}
        </dd>
      </div>
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          End date
        </dt>
        <dd class="govuk-summary-list__value">
          {{ qualifyingTest.endDate | formatDate('datetime') }}
        </dd>
      </div>
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Duration
        </dt>
        <dd class="govuk-summary-list__value">
          {{ qualifyingTest.testDuration }} minutes
        </dd>
      </div>
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Additional instructions
        </dt>
        <dd class="govuk-summary-list__value">
          <ul class="govuk-list">
            <li
              v-for="(item, index) in qualifyingTest.additionalInstructions"
              :key="index"
            >
              {{ item.text }}
            </li>
          </ul>
        </dd>
      </div>
    </dl>

    <button
      v-if="isDraft"
      class="govuk-button govuk-!-margin-right-3"
      @click="submitForApproval"
    >
      Submit for Approval
    </button>
    <button
      v-if="isReadyForApproval"
      class="govuk-button govuk-!-margin-right-3"
      @click="approve"
    >
      Approve
    </button>
  </div>
</template>

<script>
import BackLink from '@/components/BackLink';
import { mapState } from 'vuex';
import { QUALIFYING_TEST } from '@/helpers/constants';

export default {
  components: {
    BackLink,
  },
  computed: {
    ...mapState({
      qualifyingTest: state => state.qualifyingTest.record,
    }),
    isDraft() {
      return this.qualifyingTest && this.qualifyingTest.status && this.qualifyingTest.status !== QUALIFYING_TEST.STATUS.CREATED;
    },
    isReadyForApproval() {
      return this.qualifyingTest && this.qualifyingTest.status && this.qualifyingTest.status === QUALIFYING_TEST.STATUS.SUBMITTED;
    },
  },
  methods: {
    submitForApproval() {
      this.$store.dispatch('qualifyingTest/submitForApproval');
    },
    approve() {
      this.$store.dispatch('qualifyingTest/approve');
    },
  },
};
</script>
