<template>
  <div>
    <h1>Handover</h1>
    <ul>
      <li 
        v-for="item in applicationRecords" 
        :key="item.id"
      >
        <RouterLink
          :to="{ name: 'exercise-show-application', params: { applicationId: item.id } }"
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
          id: 'Ux8mmRuOxzTs0Rgf9BNP',
          candidate: {
            fullName: 'Jimmy Jones Handover',
          },
        },
      ],
    };
  },
};
</script>
