<template>
  <div class="background-light-grey govuk-!-padding-4 govuk-!-margin-bottom-3">
    <h2 class="govuk-heading-m">
      {{ title }}
    </h2>
    <div class="govuk-body">
      <slot />
    </div>
  </div>
</template>
<script>
export default {
  name: 'SimpleBannerDetails',
  props: {
    title: {
      type: String,
      required: true,
    },
  },
};
</script>
