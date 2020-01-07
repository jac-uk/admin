<template>
  <div>
    <div class="govuk-grid-column-one-half">
      <div
        v-if="exercise.immediateStart"
        class="background-light-grey govuk-!-padding-4 govuk-!-margin-bottom-3"
      >
        <h2 class="govuk-heading-l">
          Number of vacancies
        </h2>
        <p class="govuk-body">
          Immediate start (S87) 
          <span 
            class="display-block govuk-heading-l govuk-!-margin-top-1"
          >{{ exercise.immediateStart }}</span>
        </p>
      </div>

      <div 
        v-if="hasOpened"
        class="background-light-grey govuk-!-padding-4 govuk-!-margin-bottom-3"
      >
        <h2 class="govuk-heading-l">
          Number of applications
        </h2>
        <p class="govuk-body">
          <span class="govuk-heading-l govuk-!-margin-top-1">0</span>
        </p>
      </div>
    </div>

    <div class="govuk-grid-column-one-half">
      <div class="background-blue govuk-!-margin-bottom-6 govuk-!-padding-3">
        <span 
          v-if="exercise.state"
          class="display-block govuk-!-font-size-27"
        >{{ exercise.state | lookup }}</span>
        <span
          v-else
          class="display-block govuk-!-font-size-27"
        >Draft</span>
      </div>
      <Timeline :data="timeline" />
      <RouterLink
        :to="{ name: 'exercise-show-timeline' }"
        class="govuk-link"
      >
        View timeline
      </RouterLink>
    </div>

    <div
      v-if="taskList && taskList.length"
      class="govuk-grid-column-full govuk-!-margin-top-5 govuk-!-margin-bottom-2"
    >
      <h2 class="govuk-heading-m">
        Task list
      </h2>
      <table class="govuk-table">
        <tbody class="govuk-table__body">
          <tr 
            v-for="task in taskList"
            :key="task.id"
            class="govuk-table__row"
          >
            <th class="govuk-table__header">
              <router-link
                class="govuk-link"
                :to="{name: task.id, params: { referrer: 'exercise-show-overview' }}"
              >
                {{ task.title }}
              </router-link>
            </th>
            <td class="govuk-table__cell text-right">
              <strong
                v-if="task.done"
                :id="`${task.id}-completed`"
                class="govuk-tag"
              >Done</strong>
              <span
                v-else
                :id="`${task.id}-completed`"
              />                          
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="govuk-grid-column-full govuk-!-margin-bottom-2">
      <button
        v-if="isDraft"
        :disabled="!isReadyToSubmit"
        class="govuk-button"
        @click="submitForApproval"
      >
        Submit for Approval
      </button>
      <button
        v-if="isReadyForApproval"
        class="govuk-button"
        @click="approve"
      >
        Approve
      </button>
      <button
        v-if="isApproved"
        class="govuk-button"
        @click="unlock"
      >
        Unlock
      </button>  
    </div>  
  </div>
</template>

<script>
import Timeline from '@/components/Page/Timeline';
import createTimeline from '@/helpers/Timeline/createTimeline';
import exerciseTimeline from '@/helpers/Timeline/exerciseTimeline';

export default {
  components: {
    Timeline,
  },
  computed: {
    exercise() {
      return this.$store.getters['exerciseDocument/data']();
    },
    isDraft() {
      // returns true unless exercise has a state that other than draft
      if (this.exercise && this.exercise.state && this.exercise.state !== 'draft') {
        return false;
      }
      return true;
    },
    isReadyForApproval() {
      return this.exercise && this.exercise.state && this.exercise.state === 'ready';
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
    hasOpened() {
      if (this.exercise) {
        switch (this.exercise.state) {
        case 'draft':
        case 'ready':
        case 'approved':
        case 'pre-launch':
          return false;
        default:
          return true;
        }
      }
      return false;
    },
    timeline() {
      let timeline = exerciseTimeline(this.exercise);
      return createTimeline(timeline, 2);
    },
    exerciseProgress() {
      if (this.exercise && this.exercise.progress) {
        return this.exercise.progress;
      } else {
        return {};
      }
    },
    approvalProgress() {
      if (this.exercise && this.exercise.approval) {
        return this.exercise.approval;
      } else {
        return {};
      }
    },    
    taskList() {
      let data = [];
      if (!this.exercise.state || this.exercise.state === 'draft' || this.exercise.state === 'ready') {
        if (this.exerciseProgress) {
          data.push({ title: 'Name of exercise', id: 'exercise-edit-name', done: this.exerciseProgress.started, approved: this.approvalProgress['started'] });
          data.push({ title: 'Vacancy information', id: 'exercise-edit-vacancy', done: this.exerciseProgress.vacancyInformation, approved: this.approvalProgress['vacancyInformation'] });
          data.push({ title: 'Contacts', id: 'exercise-edit-contacts', done: this.exerciseProgress.contacts, approved: this.approvalProgress['contacts'] });
          data.push({ title: 'Timeline', id: 'exercise-edit-timeline', done: this.exerciseProgress.timeline, approved: this.approvalProgress['timeline'] });
          data.push({ title: 'Shortlisting', id: 'exercise-edit-shortlisting', done: this.exerciseProgress.shortlisting, approved: this.approvalProgress['shortlisting'] });
          data.push({ title: 'Eligibility information', id: 'exercise-edit-eligibility', done: this.exerciseProgress.eligibility, approved: this.approvalProgress['eligibility'] });
          data.push({ title: 'Working preferences', id: 'exercise-edit-working-preferences', done: this.exerciseProgress.workingPreferences, approved: this.approvalProgress['workingPreferences'] });
          data.push({ title: 'Assessment options', id: 'exercise-edit-assessment-options', done: this.exerciseProgress.assessmentOptions, approved: this.approvalProgress['assessmentOptions'] });
          data.push({ title: 'Exercise downloads', id: 'exercise-edit-downloads', done: this.exerciseProgress.downloads, approved: this.approvalProgress['downloads'] });
        }
      }
      return data;
    },
    isReadyToSubmit() {
      return this.exerciseProgress
        && this.exerciseProgress.started
        && this.exerciseProgress.vacancyInformation
        && this.exerciseProgress.contacts
        && this.exerciseProgress.timeline
        && this.exerciseProgress.shortlisting
        && this.exerciseProgress.eligibility
        && this.exerciseProgress.workingPreferences
        && this.exerciseProgress.assessmentOptions
        && this.exerciseProgress.downloads;
    },  
  },
  methods: {
    submitForApproval() {
      this.$store.dispatch('exerciseDocument/submitForApproval');
    },
    approve() {
      this.$store.dispatch('exerciseDocument/approve');
    },
    unlock() {
      this.$store.dispatch('exerciseDocument/unlock');
    },
  },
};
</script>
