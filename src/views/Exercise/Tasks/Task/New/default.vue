<template>
  <div>
    <p
      class="govuk-body-l"
    >
      Please check the following details before continuing
    </p>

    <div class="govuk-grid-row">
      <div class="govuk-grid-column-one-half">
        <div class="panel govuk-!-margin-bottom-5 govuk-!-padding-4 background-light-grey">
          <div class="govuk-caption-m">
            Applications <span v-if="entryStatus">({{ entryStatus | lookup }})</span>
          </div>
          <h2
            class="govuk-heading-m govuk-!-margin-bottom-0"
          >
            {{ totalApplications }}
          </h2>
        </div>
      </div>

      <div
        v-for="(timelineTask, index) in timelineTasks"
        :key="`timelineTask-${index}`"
        class="govuk-grid-column-one-half"
      >
        <div class="panel govuk-!-margin-bottom-5 govuk-!-padding-4 background-light-grey">
          <span class="govuk-caption-m">{{ timelineTask.entry }}</span>
          <h2
            class="govuk-heading-m govuk-!-margin-bottom-0"
          >
            {{ timelineTask.dateString }}
          </h2>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { taskEntryStatus } from '@/helpers/exerciseHelper';

export default {
  props: {
    exercise: {
      required: true,
      type: Object,
    },
    type: {
      required: true,
      type: String,
    },
    timelineTasks: {
      required: true,
      type: Array,
    },
    totalApplications: {
      required: true,
      type: Number,
    },
  },
  computed: {
    entryStatus() {
      return taskEntryStatus(this.exercise, this.type);
    },
  },
};
</script>
