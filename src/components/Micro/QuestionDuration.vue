<template>
  <div class="question-duration">
    <p
      v-if="start"
      class="govuk-body-s"
    >
      Start: {{ start | formatDate('datetime') }}
    </p>
    <p
      v-if="end"
      class="govuk-body-s"
    >
      End: {{ end | formatDate('datetime') }}
    </p>
    <p
      v-if="duration"
      class="govuk-body-s"
    >
      Duration: {{ duration }}
    </p>
  </div>
</template>

<script>
export default {
  props: {
    start: {
      type: Date,
      default: null,
    },
    end: {
      type: Date,
      default: null,
    },
  },
  computed: {
    duration() {
      const timeDiff = this.end - this.start;
      let durationReturn = '';
      if (timeDiff !== undefined && this.end) {
        const timeDiffFormatted = new Date(timeDiff).toISOString().substr(11, 8);
        durationReturn = timeDiffFormatted === '00:00:00' ? '' : timeDiffFormatted;
      }
      return durationReturn;
    },
  },
};
</script>

<style type="text/css" rel="stylesheet/scss" lang="scss" scoped>
.question-duration p {
  margin: 0;
  color: #505a5f;
}
</style>
