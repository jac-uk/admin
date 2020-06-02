<template>
  <div>
    <Banner :message="message" />
    <h1>Recommended</h1>
    <ul>
      <li 
        v-for="item in applicationRecords" 
        :key="item.application.id"
      >
        <RouterLink
          :to="{ name: 'exercise-stages-recommended-edit', params: { applicationId: item.application.id } }"
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
  data() {
    return {
      message: null,
    };
  },
  computed: {
    applicationRecords() {
      return this.$store.state.stageRecommended.records;
    },
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
  },
  async created() {
    this.$store.dispatch('stageRecommended/bind', { exerciseId: this.exercise.id });
    this.message = await this.$store.dispatch('stageRecommended/getMessages');
  },
};
</script>
