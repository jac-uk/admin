<template>
  <div class="exercise-stages">
    <Router-view />
  </div>
</template>

<script>
export default {
};
</script>

<style>
  .exercise-stages .moj-page-header-actions__actions {
    /* This is a hack as the align: `justify` is not working here */ 
    float: right;
  }
</style>
