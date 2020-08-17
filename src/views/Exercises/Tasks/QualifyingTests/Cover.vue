<template>
  <div>
    QTs Cover Page [{{exerciseId}}]
    <ul>
      <li>
        <RouterLink
          :to="{ name: 'exercise-tasks-qualifying-tests-create' }"
        >
          Create QT
        </RouterLink>
      </li>
      <li>
        <RouterLink
          :to="{ name: 'qualifying-test-view', params: { qualifyingTestId: 'l0w8PeHoi06IpAXjFdEC' } }"
        >
          QT Dash
        </RouterLink>
      </li>
      <li>
        <RouterLink
          :to="{ name: 'qualifying-test-edit', params: { qualifyingTestId: '12345' } }"
        >
          QT Edit
        </RouterLink>
      </li>
      <li>
        <RouterLink
          :to="{ name: 'qualifying-test-review', params: { qualifyingTestId: '12345' } }"
        >
          QT Review
        </RouterLink>
      </li>
      <li>
        <RouterLink
          :to="{ name: 'qualifying-test-responses', params: { qualifyingTestId: '12345', status: 'all' } }"
        >
          QT Responses all
        </RouterLink>
      </li>
      <li>
        <RouterLink
          :to="{ name: 'qualifying-test-responses', params: { qualifyingTestId: '12345', status: 'in-progress' } }"
        >
          QT Responses in progress
        </RouterLink>
      </li>
      <li>
        <RouterLink
          :to="{ name: 'qualifying-test-responses', params: { qualifyingTestId: '12345', status: 'completed' } }"
        >
          QT Responses completed
        </RouterLink>
      </li>
      <li>
        <RouterLink
          :to="{ name: 'qualifying-test-responses', params: { qualifyingTestId: '12345', status: 'adjustments' } }"
        >
          QT Responses adjustments 
        </RouterLink>
      </li>
      <li>
        <RouterLink
          :to="{ name: 'qualifying-test-response-view', params: { qualifyingTestId: '12345', responseId: '54321', status: 'all' } }"
        >
          QT Response
        </RouterLink>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  computed: {
    exerciseId() {
      return this.$route.params.id;
    },
  },
};
</script>
