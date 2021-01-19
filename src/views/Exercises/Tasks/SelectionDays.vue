<template>
  <div>
    <h1 class="govuk-heading-l">
      Selection Days
    </h1>
    <PanelPack type="selection-days" />
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
