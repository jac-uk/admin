<template>
  <div class="question-duration">
    <p
      v-if="start"
      class="govuk-body-s"
    >
      First started: {{ start | formatDate('datetime') }}
    </p>
    <p
      v-if="end"
      class="govuk-body-s"
    >
      Last updated: {{ end | formatDate('datetime') }}
    </p>
  </div>
</template>

<script>
export default {
  name: 'QuestionDuration',
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
};
</script>

<style type="text/css" rel="stylesheet/scss" lang="scss" scoped>
.question-duration p {
  margin: 0;
  color: #505a5f;
}
</style>
