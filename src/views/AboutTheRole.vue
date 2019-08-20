<template>
  <main class="govuk-main-wrapper">
    <form
      class="form"
      action="combined-eligibility"
      method="post"
    >
      <div class="govuk-grid-row">
        <div class="govuk-grid-column-two-thirds">
          <!--PAGE TITLE-->
          <span class="govuk-caption-xl">Step 2 of 4</span>
          <h1 class="govuk-heading-xl">
            About the role
          </h1>

          <h2 class="govuk-heading-m">
            Number of vacancies
          </h2>
          <!--TEXT INPUT-->
          <div class="govuk-form-group">
            <label
              class="govuk-heading-s"
              for="exercise-name"
              style="margin-bottom:0px;"
            >
              Immediate start
            </label>
            <span
              id="event-name-hint"
              class="govuk-hint"
            >
              These are also called section 87 (S87) vacancies
            </span>
            <input
              id="width-5"
              class="govuk-input govuk-input--width-5"
              name="width-5"
              type="text"
            >
          </div>

          <!--TEXT INPUT-->
          <div class="govuk-form-group">
            <label
              class="govuk-heading-s"
              for="exercise-name"
              style="margin-bottom:0px;"
            >
              Future start
            </label>
            <span
              id="event-name-hint"
              class="govuk-hint"
            >
              These are also called section 94 (S94) vacancies
            </span>
            <input
              id="width-5"
              class="govuk-input govuk-input--width-5"
              name="width-5"
              type="text"
            >
          </div>

          <!--TEXT INPUT-->
          <div class="govuk-form-group">
            <label
              class="govuk-heading-m"
              for="exercise-name"
              style="margin-bottom:10px;"
            >
              Location
            </label>
            <input
              id="exercise-name"
              class="govuk-input"
              name="exercise-name"
              type="text"
            >
          </div>

          <!--RADIO CONDITIONAL GROUP-->
          <div class="govuk-form-group">
            <fieldset
              class="govuk-fieldset"
              aria-describedby="how-contacted-conditional-hint"
            >
              <legend class="govuk-fieldset__legend govuk-fieldset__legend--m">
                <h2 class="govuk-fieldset__heading">
                  Appointment type
                </h2>
              </legend>
              <div
                class="govuk-radios govuk-radios--conditional"
                data-module="govuk-radios"
              >
                <div class="govuk-radios__item">
                  <input
                    id="how-contacted-conditional"
                    class="govuk-radios__input"
                    name="how-contacted"
                    type="radio"
                    value="email"
                    aria-controls="conditional-how-contacted-conditional"
                    aria-expanded="false"
                  >
                  <label
                    class="govuk-label govuk-radios__label"
                    for="how-contacted-conditional"
                  >
                    Salaried
                  </label>
                </div>
                <div
                  id="conditional-how-contacted-conditional"
                  class="govuk-radios__conditional govuk-radios__conditional--hidden"
                >
                  <div class="govuk-form-group">
                    <!--CURRENCY-->
                    <div class="govuk-form-group">
                      <fieldset
                        class="govuk-fieldset"
                        aria-describedby="passport-issued-hint"
                        role="group"
                      >
                        <label
                          class="govuk-fieldset__legend--s"
                          for="contact-by-email"
                        >
                          Salary
                        </label>
                        <div
                          id="passport-issued"
                          class="govuk-date-input"
                        >
                          <div class="govuk-date-input__item">
                            <div class="govuk-form-group">
                              <input
                                id="passport-issued-year"
                                class="govuk-input govuk-date-input__input govuk-input--width-5"
                                name="passport-issued-year"
                                type="number"
                                pattern="[0-9]*"
                                placeholder="£"
                              >
                            </div>
                          </div>
                          <div class="govuk-date-input__item">
                            <p class="govuk-body">
                              .
                            </p>
                          </div>
                          <div
                            class="govuk-date-input__item"
                            style="margin-right: 0.75rem;"
                          >
                            <div class="govuk-form-group">
                              <input
                                id="passport-issued-hour"
                                class="govuk-input govuk-date-input__input govuk-input--width-2"
                                name="passport-issued-hour"
                                type="number"
                                pattern="[0-9]*"
                              >
                            </div>
                          </div>
                        </div>
                      </fieldset>
                    </div>
                  </div>
                </div>
                <div class="govuk-radios__item">
                  <input
                    id="how-contacted-conditional-2"
                    class="govuk-radios__input"
                    name="how-contacted"
                    type="radio"
                    value="phone"
                    aria-controls="conditional-how-contacted-conditional-2"
                    aria-expanded="false"
                  >
                  <label
                    class="govuk-label govuk-radios__label"
                    for="how-contacted-conditional-2"
                  >
                    Fee paid
                  </label>
                </div>
                <div
                  id="conditional-how-contacted-conditional-2"
                  class="govuk-radios__conditional govuk-radios__conditional--hidden"
                >
                  <!--CURRENCY-->
                  <div class="govuk-form-group">
                    <fieldset
                      class="govuk-fieldset"
                      aria-describedby="passport-issued-hint"
                      role="group"
                    >
                      <label
                        class="govuk-fieldset__legend--s"
                        for="contact-by-email"
                      >
                        Fee
                      </label>
                      <div
                        id="passport-issued"
                        class="govuk-date-input"
                      >
                        <div class="govuk-date-input__item">
                          <div class="govuk-form-group">
                            <input
                              id="passport-issued-year"
                              class="govuk-input govuk-date-input__input govuk-input--width-5"
                              name="passport-issued-year"
                              type="number"
                              pattern="[0-9]*"
                              placeholder="£"
                            >
                          </div>
                        </div>
                        <div class="govuk-date-input__item">
                          <p class="govuk-body">
                            .
                          </p>
                        </div>
                        <div
                          class="govuk-date-input__item"
                          style="margin-right: 0.75rem;"
                        >
                          <div class="govuk-form-group">
                            <input
                              id="passport-issued-hour"
                              class="govuk-input govuk-date-input__input govuk-input--width-2"
                              name="passport-issued-hour"
                              type="number"
                              pattern="[0-9]*"
                            >
                          </div>
                        </div>
                      </div>
                    </fieldset>
                  </div>
                </div>
                <div class="govuk-radios__item">
                  <input
                    id="how-contacted-conditional-3"
                    class="govuk-radios__input"
                    name="how-contacted"
                    type="radio"
                    value="phone"
                  >
                  <label
                    class="govuk-label govuk-radios__label"
                    for="how-contacted-conditional-3"
                  >
                    Unpaid
                  </label>
                </div>
              </div>
            </fieldset>
          </div>

          <!--RADIO GROUP-->
          <div class="govuk-form-group">
            <fieldset
              class="govuk-fieldset"
              aria-describedby="how-contacted-conditional-hint"
            >
              <legend class="govuk-fieldset__legend govuk-fieldset__legend--m">
                <h2 class="govuk-fieldset__heading">
                  Is salaried part-time working (SPTW) offered?
                </h2>
              </legend>
              <div
                class="govuk-radios govuk-radios--conditional"
                data-module="govuk-radios"
              >
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
                    Yes
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
                      Description
                    </label>
                    <span
                      id="waste-hint"
                      class="govuk-hint"
                    >
                      This will be in the vacancy request (VR)
                    </span>
                    <input
                      id="contact-by-text"
                      class="govuk-input govuk-!-width-full"
                      name="contact-by-text"
                      type="tel"
                    >
                  </div>
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
                    No
                  </label>
                </div>
              </div>
            </fieldset>
          </div>



          <!--CHECKBOX GROUP-->
          <div class="govuk-form-group">
            <fieldset
              class="govuk-fieldset"
              aria-describedby="waste-hint"
            >
              <legend class="govuk-fieldset__legend govuk-fieldset__legend--m">
                <h2 class="govuk-fieldset__heading">
                  Welsh requirement
                </h2>
              </legend>
              <span
                id="waste-hint"
                class="govuk-hint"
              >
                Select all that apply
              </span>
              <div class="govuk-checkboxes">
                <div class="govuk-checkboxes__item">
                  <input
                    id="waste"
                    class="govuk-checkboxes__input"
                    name="waste"
                    type="checkbox"
                    value="carcasses"
                  >
                  <label
                    class="govuk-label govuk-checkboxes__label"
                    for="waste"
                  >
                    Welsh language
                  </label>
                </div>
                <div class="govuk-checkboxes__item">
                  <input
                    id="waste-2"
                    class="govuk-checkboxes__input"
                    name="waste"
                    type="checkbox"
                    value="mines"
                  >
                  <label
                    class="govuk-label govuk-checkboxes__label"
                    for="waste-2"
                  >
                    Devolution questions
                  </label>
                </div>
              </div>
            </fieldset>
          </div>

          <!--TEXT AREA-->
          <div class="govuk-form-group">
            <label
              class="govuk-fieldset__legend govuk-fieldset__legend--m"
              for="more-detail"
            >
              Overview of the role
            </label>
            <span
              id="waste-hint"
              class="govuk-hint"
            >
              This will be in the 'Any other information' box in the vacancy request (VR)
            </span>
            <textarea
              id="more-detail"
              class="govuk-textarea"
              name="more-detail"
              rows="10"
              aria-describedby="more-detail-hint"
            />
          </div>

          <!--BUTTON-->
          <button
            type="submit"
            class="govuk-button"
            data-module="govuk-button"
          >
            Add eligibility information
          </button>

          <!--END MAIN WRAPPER-->
        </div>
      </div>
    </form>
  </main>
</template>

<script>
export default {
};
</script>
