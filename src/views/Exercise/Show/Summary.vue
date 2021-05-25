<template>
  <div>
    <div class="text-right">
      <router-link
        v-if="isEditable"
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
          <span
            v-if="exercise.inviteOnly"
          >
            -
            <b>
              Invite only exercise
            </b>
          </span>
        </dd>
      </div>
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Launch date
        </dt>
        <dd class="govuk-summary-list__value">
          <span v-if="exercise.estimatedLaunchDate">
            {{ exercise.estimatedLaunchDate | formatEstimatedDate }}
          </span>
          <span v-else>
            TBC
          </span>
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
          Are there Welsh posts?
        </dt>
        <dd class="govuk-summary-list__value">
          {{ exercise.welshPosts | toYesNo }}
        </dd>
      </div>
      <div
        v-if="exercise.welshPosts"
        class="govuk-summary-list__row"
      >
        <dt class="govuk-summary-list__key">
          Role summary (Welsh)
        </dt>
        <dd class="govuk-summary-list__value">
          {{ exercise.roleSummaryWelsh }}
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
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters('exerciseDocument', {
      isEditable: 'isEditable',
    }),
    exercise() {
      return this.$store.getters['exerciseDocument/data']();
    },
    isPublished() {
      return this.exercise.published;
    },
    canPublish() {
      return this.exercise.progress && this.exercise.progress.vacancySummary;
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

<style type="text/css" rel="stylesheet/scss" lang="scss" scoped>
.govuk-summary-list__value,
.govuk-summary-list__value:last-child,
.govuk-summary-list__key {
  @include govuk-media-query($from: tablet) {
    width: auto;
  }
}
</style>
