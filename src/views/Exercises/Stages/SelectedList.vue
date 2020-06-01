<template>
  <div>
    <Banner :message="message" />
    <h1>Selected</h1>
    <ul>
      <li 
        v-for="item in applicationRecords" 
        :key="item.application.id"
      >
        <RouterLink
          :to="{ name: 'exercise-stages-selected-edit', params: { applicationId: item.application.id } }"
        >
          {{ item.candidate.fullName }}, {{ item.status }}
        </RouterLink>
      </li>
    </ul>
  </div>
</template>

<script>
import Banner from '@/components/Page/Banner';

export default {
  components: {
    Banner,
  },
  computed: {
    applicationRecords() {
      return this.$store.state.stageSelected.records;
    },
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
  },
  async created() {
    this.$store.dispatch('stageSelected/bind', { exerciseId: this.exercise.id });
    this.message = await this.$store.dispatch('stageSelected/getMessages');
  },
};
</script>
