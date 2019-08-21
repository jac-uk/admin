<template>
  <main class="govuk-main-wrapper">
    <form
      class="form"
      action="combined-role"
      method="post"
    >
      <div class="govuk-grid-row">
        <div class="govuk-grid-column-two-thirds">
          <span class="govuk-caption-xl">Step 1 of 4</span>
          <h1 class="govuk-heading-xl">
            Create an exercise
          </h1>
          <div class="govuk-form-group">
            <label
              class="govuk-heading-m"
              for="exercise-name"
              style="margin-bottom:10px;"
            >
              Exercise name
            </label>
            <input
              id="exercise-name"
              class="govuk-input"
              name="exercise-name"
              type="text"
            >
          </div>
          <div class="govuk-form-group">
            <fieldset class="govuk-fieldset">
              <legend class="govuk-fieldset__legend govuk-fieldset__legend--m">
                <h2 class="govuk-fieldset__heading">
                  Type of exercise
                </h2>
              </legend>
              <div class="govuk-radios govuk-radios">
                <div class="govuk-radios__item">
                  <input
                    id="legal-yes"
                    class="govuk-radios__input"
                    name="legal"
                    type="radio"
                    value="true"
                  >
                  <label
                    class="govuk-label govuk-radios__label"
                    for="legal-yes"
                  >
                    Legal - court
                  </label>
                </div>
                <div class="govuk-radios__item">
                  <input
                    id="legal-yes"
                    class="govuk-radios__input"
                    name="legal"
                    type="radio"
                    value="true"
                  >
                  <label
                    class="govuk-label govuk-radios__label"
                    for="legal-yes"
                  >
                    Legal - tribunal
                  </label>
                </div>
                <div class="govuk-radios__item">
                  <input
                    id="legal-no"
                    class="govuk-radios__input"
                    name="legal"
                    type="radio"
                    value="false"
                    disabled=""
                  >
                  <label
                    class="govuk-label govuk-radios__label"
                    for="legal-no"
                  >
                    Non legal
                  </label>
                </div>
                <div class="govuk-radios__item">
                  <input
                    id="legal-no"
                    class="govuk-radios__input"
                    name="legal"
                    type="radio"
                    value="false"
                    disabled=""
                  >
                  <label
                    class="govuk-label govuk-radios__label"
                    for="legal-no"
                    disabled=""
                  >
                    Senior
                  </label>
                </div>
                <div class="govuk-radios__item">
                  <input
                    id="legal-no"
                    class="govuk-radios__input"
                    name="legal"
                    type="radio"
                    value="false"
                    disabled=""
                  >
                  <label
                    class="govuk-label govuk-radios__label"
                    for="legal-no"
                    disabled=""
                  >
                    Leadership
                  </label>
                </div>
              </div>
            </fieldset>
          </div>
          <div class="govuk-form-group">
            <label
              class="govuk-heading-m"
              for="exercise-name"
              style="margin-bottom:10px;"
            >
              Exercise manager
            </label>
            <input
              id="exercise-name"
              class="govuk-input"
              name="exercise-name"
              type="text"
            >
          </div>
          <div class="govuk-form-group">
            <label
              class="govuk-heading-m"
              for="exercise-name"
              style="margin-bottom:10px;"
            >
              Judicial contact
            </label>
            <input
              id="exercise-name"
              class="govuk-input"
              name="exercise-name"
              type="text"
            >
          </div>
          <button
            type="submit"
            class="govuk-button"
            data-module="govuk-button"
          >
            Add information about the role
          </button>
        </div>
      </div>
    </form>
  </main>
</template>

<script>
export default {
};
</script>
