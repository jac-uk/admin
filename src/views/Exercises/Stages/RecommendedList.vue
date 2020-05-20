<template>
  <div>
    <h1>Recommended</h1>
    <ul>
      <li 
        v-for="item in applicationRecords" 
        :key="item.id"
      >
        <RouterLink
          :to="{ name: 'exercise-stages-recommended-edit', params: { applicationId: item.id } }"
          class=""
        >
          {{ item.candidate.fullName }}
        </RouterLink>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      applicationRecords: [
        {
          id: 'application1',
          candidate: {
            fullName: 'Jonny James',
          },
        },
      ],
    };
  },
};
</script>
