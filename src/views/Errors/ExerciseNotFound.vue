<template>
  <div class="govuk-grid-row">
    <div class="govuk-grid-column-two-thirds">
      <h1 class="govuk-heading-xl">
        Exercise not found
      </h1>
      <p class="govuk-body">
        There is not an exercise associated with this link address.
      </p>
      <p class="govuk-body">
        You could check:
      </p>
      <ul class="govuk-list">
        <li>
          you've copied and pasted the entire link address
        </li>
        <li>there are no obvious misspellings</li>
      </ul>
      <p class="govuk-body">
        If your link still does not work, try searching for the exercise by name.
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ExerciseNotFound',
};
</script>
