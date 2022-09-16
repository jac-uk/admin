<template>
  <div>
    <h1 class="govuk-heading-l">
      Scenario Responses
    </h1>
    <PanelPack type="scenario" />
  </div>
</template>

<script>
import PanelPack from '@/components/PanelPacks/PanelPacks';

export default {
  name: 'Scenario',
  components: {
    PanelPack,
  },
  data() {
    return {
      scenario: null,
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
