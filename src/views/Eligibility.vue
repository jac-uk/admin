<template lang="html">
  <form
    class="form"
    action="combined-selection"
    method="post"
  >
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <span class="govuk-caption-xl">Step 3 of 4</span>
        <!--PAGE TITLE-->
        <h3 class="govuk-heading-xl">
          Eligibility
        </h3>

        <!--CONDITIONAL CHECKBOX GROUP-->
        <div class="govuk-form-group">
          <fieldset
            class="govuk-fieldset"
            aria-describedby="citizenship-conditional-hint"
          >
            <legend class="govuk-fieldset__legend govuk-fieldset__legend--m">
              <h1 class="govuk-fieldset__heading">
                Professions
              </h1>
            </legend>
            <span
              id="citizenship-conditional-hint"
              class="govuk-hint"
            >
              Select all that apply
            </span>
            <div
              class="govuk-checkboxes"
              data-module="govuk-checkboxes"
            >
              <div class="govuk-checkboxes__item">
                <input
                  id="citizenship-conditional"
                  class="govuk-checkboxes__input"
                  name="citizen"
                  type="checkbox"
                  value="email"
                  data-aria-controls="conditional-citizenship-conditional"
                >
                <label
                  class="govuk-label govuk-checkboxes__label"
                  for="citizenship-conditional"
                >
                  Advocate (enrolled with the Scottish bar)
                </label>
              </div>
              <div class="govuk-checkboxes__item">
                <input
                  id="citizenship-conditional"
                  class="govuk-checkboxes__input"
                  name="citizen"
                  type="checkbox"
                  value="email"
                  data-aria-controls="conditional-citizenship-conditional"
                >
                <label
                  class="govuk-label govuk-checkboxes__label"
                  for="citizenship-conditional"
                >
                  Barrister
                </label>
              </div>
              <div class="govuk-checkboxes__item">
                <input
                  id="citizenship-conditional"
                  class="govuk-checkboxes__input"
                  name="citizen"
                  type="checkbox"
                  value="email"
                  data-aria-controls="conditional-citizenship-conditional"
                >
                <label
                  class="govuk-label govuk-checkboxes__label"
                  for="citizenship-conditional"
                >
                  CILEx
                </label>
              </div>
              <div class="govuk-checkboxes__item">
                <input
                  id="citizenship-conditional-2"
                  class="govuk-checkboxes__input"
                  name="citizen"
                  type="checkbox"
                  value="phone"
                  data-aria-controls="conditional-citizenship-conditional-2"
                >
                <label
                  class="govuk-label govuk-checkboxes__label"
                  for="citizenship-conditional-2"
                >
                  Solicitor
                </label>
              </div>
              <div class="govuk-checkboxes__item">
                <input
                  id="citizenship-conditional-3"
                  class="govuk-checkboxes__input"
                  name="citizen"
                  type="checkbox"
                  value="text message"
                  aria-controls="conditional-citizenship-conditional-3"
                  aria-expanded="false"
                >
                <label
                  class="govuk-label govuk-checkboxes__label"
                  for="citizenship-conditional-3"
                >
                  Other
                </label>
              </div>
              <div
                id="conditional-citizenship-conditional-3"
                class="govuk-checkboxes__conditional govuk-checkboxes__conditional--hidden"
              >
                <div class="govuk-form-group">
                  <label
                    class="govuk-fieldset__legend--s"
                    for="contact-by-text"
                  >
                    Add details of other relevant professions, qualifications or experience
                  </label>
                  <span
                    id="citizenship-conditional-hint"
                    class="govuk-hint"
                    style="margin-bottom:0px;"
                  >
                    For example, Patent agent, Medical
                  </span>
                  <input
                    id="contact-by-text"
                    class="govuk-input govuk-!-width-full"
                    name="contact-by-text"
                    type="tel"
                  >
                </div>
              </div>
            </div>
          </fieldset>
        </div>

        <!--CONDITIONAL RADIO GROUP-->
        <div class="govuk-form-group">
          <fieldset
            class="govuk-fieldset"
            aria-describedby="how-contacted-conditional-hint"
          >
            <legend class="govuk-fieldset__legend govuk-fieldset__legend--m">
              <h1 class="govuk-fieldset__heading">
                Post-qualification experience (PQE)
              </h1>
            </legend>
            <span
              id="event-name-hint"
              class="govuk-hint"
            >
              This is the minimum number of years of law-related work experience the candidate must have
            </span>
            <div
              class="govuk-radios govuk-radios--conditional"
              data-module="govuk-radios"
            >
              <div class="govuk-radios__item">
                <input
                  id="how-contacted-conditional-0"
                  class="govuk-radios__input"
                  name="how-contacted"
                  type="radio"
                  value="email"
                  data-aria-controls="conditional-how-contacted-conditional-0"
                >
                <label
                  class="govuk-label govuk-radios__label"
                  for="how-contacted-conditional-0"
                >
                  Not applicable
                </label>
              </div>
              <div class="govuk-radios__item">
                <input
                  id="how-contacted-conditional"
                  class="govuk-radios__input"
                  name="how-contacted"
                  type="radio"
                  value="email"
                  data-aria-controls="conditional-how-contacted-conditional"
                >
                <label
                  class="govuk-label govuk-radios__label"
                  for="how-contacted-conditional"
                >
                  5 years
                </label>
              </div>
              <div class="govuk-radios__item">
                <input
                  id="how-contacted-conditional-2"
                  class="govuk-radios__input"
                  name="how-contacted"
                  type="radio"
                  value="phone"
                  data-aria-controls="conditional-how-contacted-conditional-2"
                >
                <label
                  class="govuk-label govuk-radios__label"
                  for="how-contacted-conditional-2"
                >
                  7 years
                </label>
              </div>
              <div class="govuk-radios__item">
                <input
                  id="how-contacted-conditional-3"
                  class="govuk-radios__input"
                  name="how-contacted"
                  type="radio"
                  value="text"
                  aria-controls="conditional-how-contacted-conditional-3"
                  aria-expanded="false"
                >
                <label
                  class="govuk-label govuk-radios__label"
                  for="how-contacted-conditional-3"
                >
                  Other
                </label>
              </div>
              <div
                id="conditional-how-contacted-conditional-3"
                class="govuk-radios__conditional govuk-radios__conditional--hidden"
              >
                <div class="govuk-form-group">
                  <label
                    class="govuk-label govuk-!-font-weight-bold"
                    for="contact-by-text"
                  >
                    Number of years
                  </label>
                  <input
                    id="contact-by-text"
                    class="govuk-input govuk-!-width-one-quarter"
                    name="contact-by-text"
                    type="tel"
                  >
                </div>
              </div>
            </div>
          </fieldset>
        </div>


        <!--CONDITIONAL RADIO GROUP-->
        <div class="govuk-form-group">
          <fieldset
            class="govuk-fieldset"
            aria-describedby="additional-selection-conditional-hint"
          >
            <legend class="govuk-fieldset__legend govuk-fieldset__legend--m">
              <h1 class="govuk-fieldset__heading">
                Does Schedule 2 apply? (Tribunal only)
              </h1>
            </legend>
            <span
              id="event-name-hint"
              class="govuk-hint"
            >
              Hint text
            </span>
            <div
              class="govuk-radios govuk-radios--conditional"
              data-module="govuk-radios"
            >
              <div class="govuk-radios__item">
                <input
                  id="additional-selection-conditional-3"
                  class="govuk-radios__input"
                  name="additional-selection"
                  type="radio"
                  value="text"
                  data-aria-controls="conditional-additional-selection-conditional-3"
                >
                <label
                  class="govuk-label govuk-radios__label"
                  for="additional-selection-conditional-3"
                >
                  Yes
                </label>
              </div>
              <div class="govuk-radios__item">
                <input
                  id="additional-selection-conditional"
                  class="govuk-radios__input"
                  name="additional-selection"
                  type="radio"
                  value="email"
                  data-aria-controls="conditional-additional-selection-conditional"
                >
                <label
                  class="govuk-label govuk-radios__label"
                  for="additional-selection-conditional"
                >
                  No
                </label>
              </div>
            </div>
          </fieldset>
        </div>

        <!--CONDITIONAL RADIO GROUP-->
        <div class="govuk-form-group">
          <fieldset
            class="govuk-fieldset"
            aria-describedby="additional-selection-conditional-hint"
          >
            <legend class="govuk-fieldset__legend govuk-fieldset__legend--m">
              <h1 class="govuk-fieldset__heading">
                Additional selection criteria (ASC)
              </h1>
            </legend>
            <span
              id="event-name-hint"
              class="govuk-hint"
            >
              This is the specific skills or experience the candidate must have
            </span>
            <div
              class="govuk-radios govuk-radios--conditional"
              data-module="govuk-radios"
            >
              <div class="govuk-radios__item">
                <input
                  id="additional-selection-conditional-3"
                  class="govuk-radios__input"
                  name="additional-selection"
                  type="radio"
                  value="text"
                  aria-controls="conditional-additional-selection-conditional-3"
                  aria-expanded="false"
                >
                <label
                  class="govuk-label govuk-radios__label"
                  for="additional-selection-conditional-3"
                >
                  Yes
                </label>
              </div>
              <div
                id="conditional-additional-selection-conditional-3"
                class="govuk-radios__conditional govuk-radios__conditional--hidden"
              >
                <div class="govuk-form-group">
                  <label
                    class="govuk-label govuk-!-font-weight-bold"
                    for="contact-by-text"
                  >
                    Add the additional experience the candidate must have
                  </label>
                  <div class="govuk-form-group">
                    <textarea
                      id="more-detail"
                      class="govuk-textarea"
                      name="more-detail"
                      rows="5"
                      aria-describedby="more-detail-hint"
                    />
                  </div>
                </div>
              </div>
              <div class="govuk-radios__item">
                <input
                  id="additional-selection-conditional"
                  class="govuk-radios__input"
                  name="additional-selection"
                  type="radio"
                  value="email"
                  data-aria-controls="conditional-additional-selection-conditional"
                >
                <label
                  class="govuk-label govuk-radios__label"
                  for="additional-selection-conditional"
                >
                  No
                </label>
              </div>
            </div>
          </fieldset>
        </div>

        <!--TEXT INPUT-->
        <div class="govuk-form-group">
          <label
            class="govuk-heading-m"
            for="exercise-name"
          >
            Retirement age
          </label>
          <input
            id="width-5"
            class="govuk-input govuk-input--width-5"
            name="width-5"
            type="text"
          ><span
            class="govuk-body"
            style="margin-left: 10px;"
          >years old</span>
        </div>

        <!--CONDITIONAL RADIO GROUP-->
        <div class="govuk-form-group">
          <fieldset
            class="govuk-fieldset"
            aria-describedby="reasonable-length-conditional-hint"
          >
            <legend class="govuk-fieldset__legend govuk-fieldset__legend--m">
              <h1 class="govuk-fieldset__heading">
                Reasonable length of service
              </h1>
            </legend>
            <span
              id="event-name-hint"
              class="govuk-hint"
            >
              This is the minimum number of years the candidate must work
            </span>
            <div
              class="govuk-radios govuk-radios--conditional"
              data-module="govuk-radios"
            >
              <div class="govuk-radios__item">
                <input
                  id="reasonable-length-conditional-0"
                  class="govuk-radios__input"
                  name="reasonable-length"
                  type="radio"
                  value="email"
                  data-aria-controls="conditional-reasonable-length-conditional-0"
                >
                <label
                  class="govuk-label govuk-radios__label"
                  for="reasonable-length-conditional-0"
                >
                  4 years
                </label>
              </div>
              <div class="govuk-radios__item">
                <input
                  id="reasonable-length-conditional"
                  class="govuk-radios__input"
                  name="reasonable-length"
                  type="radio"
                  value="email"
                  data-aria-controls="conditional-reasonable-length-conditional"
                >
                <label
                  class="govuk-label govuk-radios__label"
                  for="reasonable-length-conditional"
                >
                  5 years
                </label>
              </div>
              <div class="govuk-radios__item">
                <input
                  id="reasonable-length-conditional-3"
                  class="govuk-radios__input"
                  name="reasonable-length"
                  type="radio"
                  value="text"
                  aria-controls="conditional-reasonable-length-conditional-3"
                  aria-expanded="false"
                >
                <label
                  class="govuk-label govuk-radios__label"
                  for="reasonable-length-conditional-3"
                >
                  Other
                </label>
              </div>
              <div
                id="conditional-reasonable-length-conditional-3"
                class="govuk-radios__conditional govuk-radios__conditional--hidden"
              >
                <div class="govuk-form-group">
                  <label
                    class="govuk-label govuk-!-font-weight-bold"
                    for="contact-by-text"
                  >
                    Number of years
                  </label>
                  <input
                    id="contact-by-text"
                    class="govuk-input govuk-!-width-one-quarter"
                    name="contact-by-text"
                    type="tel"
                  >
                </div>
              </div>
            </div>
          </fieldset>
        </div>

        <!--BUTTON-->
        <button
          type="submit"
          class="govuk-button"
          data-module="govuk-button"
        >
          Add selection process information
        </button>

        <!--END MAIN WRAPPER-->
      </div>
    </div>
  </form>
</template>

<script>
export default {
};
</script>

<style lang="css" scoped>
</style>
