<template>
  <a
    class="govuk-back-link"
    @click="$router.back()"
  >
    Back
  </a>
</template>
<style scoped >
 .govuk-back-link {
   cursor: pointer;
 }
</style>
