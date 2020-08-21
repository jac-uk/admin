<template>
  <div>
    <div class="govuk-grid-column-full govuk-!-margin-bottom-1">
      <h2 class="govuk-heading-m">
        Qualifying Test
      </h2>
      <h3 class="govuk-heading-l">
        {{ qualifyingTest.title | showAlternative(qualifyingTest.id) }}
      </h3>

      <table class="govuk-table">
        <tbody class="govuk-table__body">
          <tr class="govuk-table__row">
            <th class="govuk-table__header">
              Type
            </th>
            <td class="govuk-table__cell">
              {{ qualifyingTest.type | lookup }}
            </td>
            <th class="govuk-table__header">
              State
            </th>
            <td class="govuk-table__cell">
              {{ qualifyingTest.status | lookup }}
            </td>
          </tr>
          <tr class="govuk-table__row">
            <th class="govuk-table__header">
              Start Date
            </th>
            <td class="govuk-table__cell">
              {{ qualifyingTest.startDate | formatDate('longdatetime') }}
            </td>
            <th class="govuk-table__header">
              End Date
            </th>
            <td class="govuk-table__cell">
              {{ qualifyingTest.endDate | formatDate('longdatetime') }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>    

    <div 
      v-if="hasCounts"
      class="govuk-grid-column-one-half" 
    >
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
            :to="{ name: 'qualifying-test-responses', params: { qualifyingTestId: this.$route.params.qualifyingTestId, status: qtStatus('ACTIVATED') }}"
          >
            Activated
          </RouterLink>
          <span 
            class="display-block govuk-heading-l govuk-!-margin-top-1"
          >{{ qualifyingTest.counts.initialised }} / {{ qualifyingTest.counts.activated }}</span>
        </p>
        <p class="govuk-body">
          <RouterLink
            :to="{ name: 'qualifying-test-responses', params: { qualifyingTestId: this.$route.params.qualifyingTestId, status: qtStatus('COMPLETED') }}"
          >
            Completed
          </RouterLink>
          <span 
            class="display-block govuk-heading-l govuk-!-margin-top-1"
          >{{ qualifyingTest.counts.completed }}</span>
        </p>
      </div>
    </div>

    <div 
      v-if="hasCounts"
      class="govuk-grid-column-one-half"
    >
      <div 
        v-if="true"
        class="background-light-grey govuk-!-padding-4 govuk-!-margin-bottom-3"
      >
        <h2 class="govuk-heading-l">
          Progress
        </h2>
        <p class="govuk-body">
          <RouterLink
            :to="{ name: 'qualifying-test-responses', params: { qualifyingTestId: this.$route.params.qualifyingTestId, status: qtStatus('ACTIVATED'), }}"
          >
            Started
          </RouterLink>
          <span class="govuk-heading-l govuk-!-margin-top-1">{{ qualifyingTest.counts.started }}</span>
        </p>
        <p class="govuk-body">
          <RouterLink
            :to="{ name: 'qualifying-test-responses', params: { qualifyingTestId: this.$route.params.qualifyingTestId, status: qtStatus('STARTED'), }}"
          >
            In Progress
          </RouterLink>
          <span class="govuk-heading-l govuk-!-margin-top-1">{{ qualifyingTest.counts.inProgress }}</span>
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
        Reasonable Adjustments
      </button>

      <ActionButton
        v-if="true"
        type="secondary"
        :disabled="false"
        class="govuk-!-margin-right-3"
        @click="btnSendInvites"
      >
        Send invites
      </ActionButton>
    </div>
  </div>
</template>

<script>
import { functions } from '@/firebase';
import ActionButton from '@/components/ActionButton';
import { QUALIFYING_TEST } from '@/helpers/constants';

export default {
  components: {
    ActionButton,
  },
  computed: {
    qualifyingTestId() {
      return this.$route.params.qualifyingTestId;
    },
    qualifyingTest() {
      const qtList = this.$store.state.qualifyingTest.record;
      // eslint-disable-next-line no-console
      // console.log('qtList', qtList);
      return qtList;
    },
    hasCounts() {
      return this.qualifyingTest.counts;
    },
    isActive() {
      return this.qualifyingTest.status === QUALIFYING_TEST.INITIALISED || this.qualifyingTest.status === QUALIFYING_TEST.APPROVED;
    },
  },
  methods: {
    btnEdit() {
      this.$router.push({ name: 'qualifying-test-edit', params: { qualifyingTestId: this.qualifyingTestId } });
    },
    async btnSendInvites() {
      await functions.httpsCallable('sendQualifyingTestReminders')({ qualifyingTestId: this.qualifyingTestId });
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
    qtStatus(status) {
      return QUALIFYING_TEST.STATUS[status];
    },
  },  
};
</script>
