<template>
  <div>
    <h1 class="govuk-heading-l">
      Selection day
    </h1>
    <PanelPack type="selection" />
  </div>
</template>

<script>
import PanelPack from '@/components/PanelPacks/PanelPacks.vue';

export default {
  name: 'SelectionDays',
  components: {
    PanelPack,
  },
  data() {
    return {
      selection: null,
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
