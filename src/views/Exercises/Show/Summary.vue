<template>
  <div>
    <div class="text-right">
      <router-link
        v-if="canEdit"
        class="govuk-link"
        :to="{name: 'exercise-edit-summary'}"
      >
        Update website listing
      </router-link>
    </div>

    <h2 class="govuk-heading-l">
      Website listing
    </h2>

    <dl class="govuk-summary-list"> 
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Name
        </dt>
        <dd class="govuk-summary-list__value">
          {{ exercise.name }}
        </dd>
      </div>  
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Launch date
        </dt>
        <dd class="govuk-summary-list__value">
          {{ exercise.estimatedLaunchDate | formatDate('month') }}
        </dd>
      </div>           
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Role summary
        </dt>
        <dd class="govuk-summary-list__value">
          {{ exercise.roleSummary }}
        </dd>
      </div>
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Subscriber alerts url
        </dt>
        <dd class="govuk-summary-list__value">
          {{ exercise.subscriberAlertsUrl }}
        </dd>
      </div>         
    </dl>

    <button
      v-if="!isPublished"
      :disabled="!canPublish"
      class="govuk-button govuk-button--secondary"
      @click="publish"
    >
      Publish on website
    </button>
    <button
      v-if="isPublished"
      class="govuk-button govuk-button--secondary"
      @click="unPublish"
    >
      Remove from website
    </button>
  </div>
</template>

<script>
export default {
  computed: {
    exercise() {
      return this.$store.getters['exerciseDocument/data']();
    },
    isPublished() {
      return this.exercise.published;
    }, 
    canPublish() {
      return this.exercise.progress && this.exercise.progress.vacancySummary;
    },  
    isApproved() {
      if (this.exercise) {
        switch (this.exercise.state) {
        case 'draft':
        case 'ready':
          return false;
        default:
          return true;
        }
      }
      return false;
    },
    canEdit() {
      return !this.isApproved;
    },
  },
  methods: {
    publish() {
      this.$store.dispatch('exerciseDocument/publish');
    },
    unPublish() {
      this.$store.dispatch('exerciseDocument/unpublish');
    },
  },
};
</script>

<style lang="scss" scoped>
  .govuk-summary-list__value,
  .govuk-summary-list__value:last-child,
  .govuk-summary-list__key {
    @include govuk-media-query($from: tablet) {
      width: auto;
    }
  }
</style>
