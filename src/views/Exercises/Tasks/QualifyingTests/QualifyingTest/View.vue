<template>
  <div>
    <div class="govuk-grid-column-one-half">
      <div
        class="background-light-grey govuk-!-padding-4 govuk-!-margin-bottom-3"
      >
        <h2 class="govuk-heading-l">
          Number of candidates
        </h2>
        <p class="govuk-body">
          Overall List
          <span 
            class="display-block govuk-heading-l govuk-!-margin-top-1"
          >345</span>
        </p>
      </div>

      <div 
        v-if="true"
        class="background-light-grey govuk-!-padding-4 govuk-!-margin-bottom-3"
      >
        <h2 class="govuk-heading-l">
          Number of applications
        </h2>
        <p class="govuk-body">
          <span class="govuk-heading-l govuk-!-margin-top-1">20</span>
        </p>
      </div>
    </div>

    <div class="govuk-grid-column-one-half">
      <h3 
        class="govuk-heading-m"
      >
        Qualifying Test
      </h3>
      <div>{{ $route.params.qualifyingTestId }}</div>
      <div>
        <button
          v-if="true"
          :disabled="false"
          class="govuk-button govuk-button--secondary govuk-!-margin-right-3"
          @click="btnAllCandidates"
        >
          All Candidates
        </button>
      </div>
    </div>

    <div class="govuk-grid-column-full govuk-!-margin-bottom-2">
      <button
        v-if="true"
        :disabled="false"
        class="govuk-button govuk-button--secondary govuk-!-margin-right-3"
        @click="edit"
      >
        Edit
      </button>
      <button
        v-if="true"
        class="govuk-button govuk-button--secondary govuk-!-margin-right-3"
        @click="sendInvites"
      >
        Send invites
      </button>
      <button
        v-if="true"
        :disabled="false"
        class="govuk-button govuk-!-margin-right-3"
        @click="initialize"
      >
        Initialize
      </button>
      <button
        v-if="true"
        :disabled="true"
        class="govuk-button govuk-button--secondary govuk-!-margin-right-3"
        @click="pause"
      >
        Pause
      </button>
    </div>
  </div>
</template>

<script>

export default {
  methods: {
    edit() {
      // eslint-disable-next-line no-console
      console.log('Button clicked: EDIT');
    },
    sendInvites() {
      // eslint-disable-next-line no-console
      console.log('Button clicked: SEND INVITES');
    },
    initialize() {
      // eslint-disable-next-line no-console
      console.log('Button clicked: INITIALIZE');
    },
    pause() {
      // eslint-disable-next-line no-console
      console.log('Button clicked: PAUSE');
    },
    btnAllCandidates() {
      // eslint-disable-next-line no-console
      console.log('Button clicked: PAUSE');
      this.$router.push({ name: 'qualifying-test-responses', params: { qualifyingTestId: this.$route.params.qualifyingTestId, status: 'all' } });
    },
  },  
};
</script>
