<template>
  <div>
    <h1 class="govuk-heading-l">
      {{ type | lookup }} test
    </h1>
    <!-- <p class="govuk-body-l">Please choose a status for each application.</p> -->
    <p class="govuk-body-l">The scores for this test are available to download</p>
    <ActionButton
      class="govuk-!-margin-bottom-0"
      type="primary"
      @click="downloadScores"
    >
      Download scores
    </ActionButton>
  </div>
</template>

<script>
import { beforeRouteEnter, btnNext } from './helper';
import ActionButton from '@jac-uk/jac-kit/draftComponents/ActionButton';
// import { functions } from '@/firebase';

export default {
  beforeRouteEnter: beforeRouteEnter,
  components: {
    ActionButton,
  },
  props: {
    type: {
      required: true,
      type: String,
    },
  },
  computed: {
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    task() {
      return this.$store.getters['tasks/getTask'](this.type);
    },
  },
  methods: {
    btnNext,
    downloadScores() {
      console.log('TODO download scores');
    },
    // async updateQualifyingTestScores() {
    //   const response = await functions.httpsCallable('updateQualifyingTestScores')({
    //     exerciseId: this.exercise.id,
    //     type: this.type,
    //   });
    //   if (response && response.data && response.data.success) {
    //     this.btnNext();
    //   }
    // },
  },
};
</script>
