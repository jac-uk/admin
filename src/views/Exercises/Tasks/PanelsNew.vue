<template>
  <div>
    <h1 class="govuk-heading-l">
      {{ title }}
    </h1>
    <p>Under construction</p>
  </div>
</template>

<script>

export default {
  components: {

  },
  data() {
    return {
      sift: null,
    };
  },
  computed: {
    isSift() {
      const route = this.$route.fullPath.includes('/tasks/sift/');
      return route;
    },
    isSelectionDay() {
      const route = this.$route.fullPath.includes('/tasks/selection-days/');
      return route;
    },
    title() {
      let returnTitle = 'New Panel for';
      if (this.isSift) {
        returnTitle = `${returnTitle} Sift`; 
      }
      if (this.isSelectionDay) {
        returnTitle = `${returnTitle} Selection Days`; 
      }
      return returnTitle;
    },
  },
  methods: {
    
  },
};
</script>

<style scoped>

</style>
