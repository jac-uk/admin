<template>
  <div>
    <ul
      v-for="item in events"
      :key="item.name"
      class="govuk-list"
    >
      <li class="govuk-body govuk-!-font-weight-bold">
        {{ item.title }}<span v-if="item.title"> - </span>{{ item.date | formatDate }}
      </li>
      <li v-if="item.details">
        {{ item.details }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    events: {
      type: Array,
      required: true,
      default: new Array(),
    },
  },
};
</script>
