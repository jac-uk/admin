<template>
  <div>
    <div class="text-right">
      <router-link
        v-if="isEditable && hasPermissions([PERMISSIONS.exercises.permissions.canUpdateExercises.value])"
        class="govuk-link"
        :to="{name: 'exercise-details-summary-edit'}"
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
          <!-- <span
            v-if="exercise.inviteOnly"
          >
            -
            <b>
              Invite only exercise
            </b>
          </span> -->
        </dd>
      </div>
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Launch date
        </dt>
        <dd class="govuk-summary-list__value">
          <span v-if="exercise.estimatedLaunchDate">
            {{ $filters.formatEstimatedDate(exercise.estimatedLaunchDate) }}
          </span>
          <span v-else>
            TBC
          </span>
        </dd>
      </div>
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Brief Overview
        </dt>
        <dd class="govuk-summary-list__value">
          <CustomHTML
            class="govuk-body"
            :value="exercise.roleSummary"
          />
        </dd>
      </div>
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Advert type
        </dt>
        <dd class="govuk-summary-list__value editable-field">
          <span>
            {{ $filters.lookup(advertType) }}
          </span>
          <span>
            <a
              class="govuk-link govuk-!-font-size-14"
              @click="changeAdvertType"
            >
              Change
            </a>
          </span>
        </dd>
      </div>
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Are there Welsh posts?
        </dt>
        <dd class="govuk-summary-list__value">
          {{ $filters.toYesNo(exercise.welshPosts) }}
        </dd>
      </div>
      <div
        v-if="exercise.welshPosts"
        class="govuk-summary-list__row"
      >
        <dt class="govuk-summary-list__key">
          Brief Overview (Welsh)
        </dt>
        <dd class="govuk-summary-list__value">
          <CustomHTML
            class="govuk-body"
            :value="exercise.roleSummaryWelsh"
          />
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
      v-if="!isPublished && hasPermissions([
        PERMISSIONS.exercises.permissions.canPublishExercise.value
      ])"
      :disabled="!canPublish"
      class="govuk-button govuk-button--secondary"
      @click="publish"
    >
      Publish on website
    </button>
    <button
      v-if="isPublished && hasPermissions([
        PERMISSIONS.exercises.permissions.canPublishExercise.value
      ])"
      class="govuk-button govuk-button--secondary"
      @click="unPublish"
    >
      Remove from apply website
    </button>
    <Modal
      ref="modalChangeExerciseAdvertType"
    >
      <ChangeExerciseAdvertType
        :advert-type="exercise.advertType"
        @close="$refs['modalChangeExerciseAdvertType'].closeModal()"
      />
    </Modal>
    <ListingPreview
      class="govuk-!-margin-bottom-4"
      :exercise="exercise"
    />
    <DetailPreview
      v-if="advertType !== 'listing'"
      :exercise="exercise"
    />
  </div>
</template>

<script>
import { logEvent } from '@/helpers/logEvent';
import { isEditable, isArchived } from '@/helpers/exerciseHelper';
import permissionMixin from '@/permissionMixin';
import Modal from '@jac-uk/jac-kit/components/Modal/Modal.vue';
import ChangeExerciseAdvertType from '@/components/ModalViews/ChangeExerciseAdvertType.vue';
import { ADVERT_TYPES } from '@/helpers/constants';
import CustomHTML from '@/components/CustomHTML.vue';
import ListingPreview from '@/components/Previews/ListingPreview.vue';
import DetailPreview from '@/components/Previews/DetailPreview.vue';
import exerciseMixin from '@/views/Exercise/exerciseMixin.js';

export default {
  name: 'SummaryView',
  components: {
    Modal,
    ChangeExerciseAdvertType,
    CustomHTML,
    ListingPreview,
    DetailPreview,
  },
  mixins: [permissionMixin, exerciseMixin],
  computed: {
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    isEditable() {
      return isEditable(this.exercise);
    },
    exerciseId() {
      return this.$store.state.exerciseDocument.record ? this.$store.state.exerciseDocument.record.id : null;
    },
    isPublished() {
      return this.exercise.published;
    },
    isArchived() {
      return isArchived(this.exercise);
    },
    canPublish() {
      return this.exercise.progress && this.exercise.progress.vacancySummary && !this.isArchived;
    },
  },
  methods: {
    isAdvertTypeListing(value) {
      const returnValue = value && value === ADVERT_TYPES.LISTING;
      return returnValue;
    },
    async publish() {
      await this.$store.dispatch('exerciseDocument/publish');
      logEvent('info', 'Exercise published', {
        exerciseId: this.exerciseId,
        exerciseRef: this.exercise.referenceNumber,
      });
    },
    async unPublish() {
      await this.$store.dispatch('exerciseDocument/unpublish');
      logEvent('info', 'Exercise unpublished', {
        exerciseId: this.exerciseId,
        exerciseRef: this.exercise.referenceNumber,
      });
    },
    changeAdvertType() {
      this.$refs['modalChangeExerciseAdvertType'].openModal();
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
.editable-field {
  display: flex;
  justify-content: space-between;
}
.capitalize {
  text-transform: capitalize;
}
.govuk-link {
  cursor: pointer;
}
</style>
