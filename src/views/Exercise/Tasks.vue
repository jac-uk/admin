<template>
  <div class="print-full-width">
    <RouterView />
  </div>
</template>

<script>

export default {
  name: 'Tasks',
  components: {
  },
  computed: {
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    stage() {
      return this.$route.params.stage;
    },
  },
  watch: {
    '$route.name': {
      handler: function(name) {
        if (!name) this.gotoTask();
      },
      deep: true,
      immediate: true,
    },
  },
  async created() {
    const exerciseId = this.$route.params.id;
    await this.$store.dispatch('tasks/bind', { exerciseId: exerciseId } );
  },
  methods: {
    gotoTask() {
      if (!this.$route.name) {
        switch (this.stage) {
        case 'shortlisting':
          this.$router.replace({ path: 'shortlisting/independent-assessments' });
          break;
        case 'selection':
          this.$router.replace({ path: 'selection/selection' }).catch(() => {});
          break;
        }
      }
    },
  },
};
</script>
