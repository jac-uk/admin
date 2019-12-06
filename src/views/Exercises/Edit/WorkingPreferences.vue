<template>
  <div class="govuk-grid-row">
    <form @submit.prevent="save">
      <div class="govuk-grid-column-two-thirds">
        <BackLink />
        <h1 class="govuk-heading-xl">
          Working preferences
        </h1>

        <p class="govuk-body-l">
          [form]
        </p>

        <button class="govuk-button">
          Save and continue
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import BackLink from '@/components/BackLink';

export default {
  components: {
    BackLink,
  },
  data() {
    const exercise = this.$store.getters['exerciseDocument/data']();
    return {
      exercise: exercise,
    };
  },
  methods: {
    async save() {
      await this.$store.dispatch('exerciseDocument/save', this.exercise);
      this.$router.push(this.$store.getters['exerciseCreateJourney/nextPage']);
    },
  },
};
</script>
