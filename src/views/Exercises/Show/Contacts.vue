<template>
  <div>
    <div class="text-right">
      <router-link 
        class="govuk-link"
        :to="{name: 'exercise-edit-contacts'}"
      >
        Update exercise contacts
      </router-link>
    </div>

    <h2 class="govuk-heading-l">
      JAC contacts
    </h2>

    <p class="govuk-body">
      <strong>Exercise mailbox</strong>
      <span class="display-block">{{ exercise.exerciseMailbox }}</span>
    </p>

    <h2 class="govuk-heading-l">
      JAC contacts
    </h2>
    <table class="govuk-table">
      <tbody class="govuk-table__body">
        <tr class="govuk-table__row">
          <th class="govuk-table__header">
            Senior selection exercise manager
          </th>
          <td class="govuk-table__cell">
            {{ exercise.seniorSelectionExerciseManager }}
          </td>
        </tr>
        <tr class="govuk-table__row">
          <th class="govuk-table__header">
            Selection exercise manager
          </th>
          <td class="govuk-table__cell">
            {{ exercise.selectionExerciseManager }}
          </td>
        </tr>
        <tr class="govuk-table__row">
          <th class="govuk-table__header">
            Selection exercise officers
          </th>
          <td class="govuk-table__cell">
            <ul class="govuk-list">
              <li
                v-for="item in exercise.selectionExerciseOfficer"
                :key="item.name"
              >
                {{ item.name }}
              </li>
            </ul>
          </td>
        </tr>
        <tr class="govuk-table__row">
          <th class="govuk-table__header">
            Assigned commissioners
          </th>
          <td class="govuk-table__cell">
            <ul class="govuk-list">
              <li
                v-for="item in exercise.assignedCommissioner"
                :key="item.name"
              >
                {{ item.name }}
              </li>
            </ul>
          </td>
        </tr>
      </tbody>
    </table>

    <h2 class="govuk-heading-l govuk-!-margin-top-9">
      Other contacts
    </h2>
    <table class="govuk-table">
      <tbody class="govuk-table__body">
        <tr class="govuk-table__row">
          <th class="govuk-table__header">
            Appropriate authority
          </th>
          <td class="govuk-table__cell">
            <ul class="govuk-list">
              <li
                v-for="item in exercise.appropriateAuthority"
                :key="item"
              >
                {{ item }}
              </li>
            </ul>
          </td>
        </tr>
        <tr class="govuk-table__row">
          <th class="govuk-table__header">
            HMCTS or Welsh Government lead contact
          </th>
          <td class="govuk-table__cell">
            {{ exercise.hmctsWelshGovLead }}
          </td>
        </tr>
        <tr class="govuk-table__row">
          <th class="govuk-table__header">
            Judicial Office contact
          </th>
          <td class="govuk-table__cell">
            {{ exercise.judicialOfficeContact }}
          </td>
        </tr>
        <tr class="govuk-table__row">
          <th class="govuk-table__header">
            Lead judge
          </th>
          <td class="govuk-table__cell">
            {{ exercise.leadJudge }}
          </td>
        </tr>
        <tr class="govuk-table__row">
          <th class="govuk-table__header">
            Drafting judges
          </th>
          <td class="govuk-table__cell">
            <ul class="govuk-list">
              <li
                v-for="item in exercise.draftingJudge"
                :key="item.name"
              >
                {{ item.name }}
              </li>
            </ul>
          </td>
        </tr>
        <tr class="govuk-table__row">
          <th class="govuk-table__header">
            Statutory consultees
          </th>
          <td class="govuk-table__cell">
            <ul class="govuk-list">
              <li
                v-for="item in exercise.statutoryConsultee"
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
