<template>
  <ol class="dwp-timeline govuk-list">
    <li 
      v-for="(item, index) in data"
      :key="index"
      class="dwp-timeline__entry govuk-!-margin-top-0 govuk-!-margin-bottom-8" 
    >
      <h3 class="govuk-heading-s govuk-!-margin-bottom-1">
        {{ item.entry }}
      </h3>
      <p class="dwp-timeline__info govuk-!-margin-top-0">
        <span class="dwp-timeline__date">{{ item.date }}</span>
      </p>
    </li>
  </ol>
</template>

<script>
export default {
  props: {
    data: {
      required: true,
      validator: value => value instanceof Array,
    },
  },
};
</script>

<style>
  .dwp-timeline {
    border-left: 5px solid #1d70b8;
  }

  .dwp-timeline__entry {
    margin: 2em 0;
    padding-left: 1em;
    position: relative;
  }

  .dwp-timeline__entry::before {
    background-color: #1d70b8;
    content: "";
    height: 5px;
    left: 0;
    position: absolute;
    top: 0.625em;
    width: 0.625em;
  }

  .dwp-timeline__date {
    color: #0b0c0c;
    display: block;
  }
</style>
