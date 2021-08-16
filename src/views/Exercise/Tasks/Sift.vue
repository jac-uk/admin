<template>
  <div>
    <h1 class="govuk-heading-l">
      Sift
    </h1>
    <PanelPack type="sift" />
  </div>
</template>

<script>
import PanelPack from '@/components/PanelPacks/PanelPacks';

export default {
  components: {
    PanelPack,
  },
  data() {
    return {
      sift: null,
    };
  },
  computed: {

  },
  methods: {
    
  },
};
</script>

<style scoped>

</style>
