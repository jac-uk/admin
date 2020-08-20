<template>
  <div>
    <div class="govuk-grid-column-full govuk-!-margin-bottom-1">
      <h3 
        class="govuk-heading-m"
      >
        Qualifying Test: Recorder 2020 Qualifying Test [{{ $route.params.qualifyingTestId }}]
      </h3>

      <table class="govuk-table">
        <tbody class="govuk-table__body">
          <tr class="govuk-table__row">
            <th class="govuk-table__header">
              Type
            </th>
            <td class="govuk-table__cell">
              scenario
            </td>
            <th class="govuk-table__header">
              State
            </th>
            <td class="govuk-table__cell">
              activated
            </td>
          </tr>
          <tr class="govuk-table__row">
            <th class="govuk-table__header">
              Start Date
            </th>
            <td class="govuk-table__cell">
              August 31, 2020 at 6:00:00 PM UTC+1
            </td>
            <th class="govuk-table__header">
              End Date
            </th>
            <td class="govuk-table__cell">
              August 31, 2020 at 6:00:00 PM UTC+1
            </td>
          </tr>
        </tbody>
      </table>
    </div>    

    <div class="govuk-grid-column-one-half">
      <div
        class="background-light-grey govuk-!-padding-4 govuk-!-margin-bottom-3"
      >
        <h2 class="govuk-heading-l">
          Number of Participants
        </h2>
        <p class="govuk-body">
          <RouterLink
            :to="{ name: 'qualifying-test-responses', params: { qualifyingTestId: this.$route.params.qualifyingTestId, status: 'all', }}"
          >
            Initialized
          </RouterLink>
          / 
          <RouterLink
            :to="{ name: 'qualifying-test-responses', params: { qualifyingTestId: this.$route.params.qualifyingTestId, status: 'activated', }}"
          >
            Activated
          </RouterLink>
          <span 
            class="display-block govuk-heading-l govuk-!-margin-top-1"
          >345 / 345</span>
        </p>
        <p class="govuk-body">
          <RouterLink
            :to="{ name: 'qualifying-test-responses', params: { qualifyingTestId: this.$route.params.qualifyingTestId, status: 'completed', }}"
          >
            Completed
          </RouterLink>
          <span 
            class="display-block govuk-heading-l govuk-!-margin-top-1"
          >100</span>
        </p>
      </div>
    </div>

    <div class="govuk-grid-column-one-half">
      <div 
        v-if="true"
        class="background-light-grey govuk-!-padding-4 govuk-!-margin-bottom-3"
      >
        <h2 class="govuk-heading-l">
          Progress
        </h2>
        <p class="govuk-body">
          <RouterLink
            :to="{ name: 'qualifying-test-responses', params: { qualifyingTestId: this.$route.params.qualifyingTestId, status: 'started', }}"
          >
            Started
          </RouterLink>
          <span class="govuk-heading-l govuk-!-margin-top-1">39</span>
        </p>
        <p class="govuk-body">
          <RouterLink
            :to="{ name: 'qualifying-test-responses', params: { qualifyingTestId: this.$route.params.qualifyingTestId, status: 'started', }}"
          >
            In Progress
          </RouterLink>
          <span class="govuk-heading-l govuk-!-margin-top-1">78</span>
        </p>
      </div>
    </div>

    <div class="govuk-grid-column-full govuk-!-margin-bottom-2">
      <button
        v-if="true"
        :disabled="false"
        class="govuk-button govuk-button--secondary govuk-!-margin-right-3"
        @click="btnEdit"
      >
        Edit
      </button>
      <button
        v-if="true"
        class="govuk-button govuk-button--secondary govuk-!-margin-right-3"
        @click="btnSendInvites"
      >
        Send invites
      </button>
      <ActionButton
        v-if="true"
        type="primary"
        :disabled="false"
        class="govuk-!-margin-right-3"
        @click="btnInitialize"
      >
        Initialize
      </ActionButton>
      <ActionButton
        v-if="true"
        :disabled="false"
        class="govuk-!-margin-right-3"
        @click="btnActivate"
      >
        Activate
      </ActionButton>

      <button
        v-if="true"
        :disabled="true"
        class="govuk-button govuk-button--secondary govuk-!-margin-right-3"
        @click="btnPause"
      >
        Pause
      </button>

      <button
        v-if="true"
        :disabled="false"
        class="govuk-button govuk-!-margin-right-3"
        @click="btnResponses('all')"
      >
        Responses
      </button>
      <button
        v-if="true"
        :disabled="false"
        class="govuk-button govuk-button--secondary govuk-!-margin-right-3"
        @click="btnResponses('all')"
      >
        All Candidates
      </button>

      <button
        v-if="true"
        :disabled="false"
        class="govuk-button govuk-button--secondary govuk-!-margin-right-3"
        @click="btnResponses('all')"
      >
        Reasonable Adjustments
      </button>
    </div>
  </div>
</template>

<script>
import { functions } from '@/firebase';
import ActionButton from '@/components/ActionButton';

export default {
  components: {
    ActionButton,
  },
  computed: {
    qualifyingTestId() {
      return this.$route.params.qualifyingTestId;
    },
  },
  methods: {
    btnEdit() {
      this.$router.push({ name: 'qualifying-test-edit', params: { qualifyingTestId: this.qualifyingTestId } });
    },
    btnSendInvites() {
      // eslint-disable-next-line no-console
      console.log('Button clicked: SEND INVITES');
    },
    async btnInitialize() {
      // @TODO allow user to select stage (maybe status too) they want to include in the test
      await functions.httpsCallable('initialiseQualifyingTest')({ qualifyingTestId: this.qualifyingTestId, stage: 'review' });
    },
    async btnActivate() {
      await functions.httpsCallable('activateQualifyingTest')({ qualifyingTestId: this.qualifyingTestId });
    },
    btnPause() {
      // eslint-disable-next-line no-console
      console.log('Button clicked: PAUSE');
    },
    btnResponses(status) {
      const route = { 
        name: 'qualifying-test-responses', 
        params: { 
          qualifyingTestId: this.$route.params.qualifyingTestId, 
          status: status, 
        },
      };
      // eslint-disable-next-line no-console
      console.log('Button clicked: PAUSE');
      
      this.$router.push(route);
    },
  },  
};
</script>
