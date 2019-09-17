<template>
  <div>
    <div class="text-right">
      <router-link
        class="govuk-link"
        :to="{name: 'exercise-edit-shortlisting'}"
      >
        Update shortlisting methods
      </router-link>
    </div>
    <h2 class="govuk-heading-l">
      Shortlisting methods
    </h2>
    <table class="govuk-table">
      <tbody class="govuk-table__body">
        <tr class="govuk-table__row">
          <th class="govuk-table__header">
            Shortlisting methods
          </th>
          <td class="govuk-table__cell">
            <ul class="govuk-list">
              <li
                v-for="item in exercise.shortlistingMethods"
                :key="item"
              >
                {{ item }}
              </li>
              <li
                v-for="item in exercise.otherShortlistingMethod"
                :key="item.name"
              >
                {{ item.name }}
              </li>
            </ul>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  computed: {
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
  },
};
</script>
