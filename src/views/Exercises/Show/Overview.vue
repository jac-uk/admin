<template>
  <div>
    <div class="govuk-grid-column-one-half">
      <div class="background-light-grey govuk-!-padding-4 govuk-!-margin-bottom-3">
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
        v-if="!isDraft"
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
        <span class="display-block govuk-!-font-size-27">Pre launch</span>
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
      v-if="taskList"
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
                :to="{name: task.id}"
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
    taskList() {
      let data = [];
      if (this.exerciseProgress) {
        data.push({ title: 'Name of exercise', id: 'exercise-edit-name', done: this.exerciseProgress.exerciseName });
        data.push({ title: 'Vacancy information', id: 'exercise-edit-vacancy', done: this.exerciseProgress.vacancyInformation });
        data.push({ title: 'Contacts', id: 'exercise-edit-contacts', done: this.exerciseProgress.contacts });
        data.push({ title: 'Timeline', id: 'exercise-edit-timeline', done: this.exerciseProgress.timeline });
        data.push({ title: 'Shortlisting', id: 'exercise-edit-shortlisting', done: this.exerciseProgress.shortlisting });
        data.push({ title: 'Eligibility information', id: 'exercise-edit-eligibility', done: this.exerciseProgress.eligibility });
        data.push({ title: 'Working preferences', id: 'exercise-edit-working-preferences', done: this.exerciseProgress.workingPreferences });
        data.push({ title: 'Assessment options', id: 'exercise-edit-assessment-options', done: this.exerciseProgress.assessmentOptions });
        data.push({ title: 'Exercise downloads', id: 'exercise-edit-downloads', done: this.exerciseProgress.downloads });
      }
      return data;
    },    
  },
};
</script>
