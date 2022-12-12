<template>
  <div class="background-light-grey govuk-!-padding-4 govuk-!-margin-bottom-3">
    <h2 class="govuk-heading-m">{{ text }}</h2>
  </div>
</template>
<script>
export default {
  name: 'SimpleBanner',
  props: {
    text: {
      type: String,
      required: true,
    },
  },
};
</script>
