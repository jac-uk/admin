<template>
  <main class="govuk-main-wrapper">
      <form class="form" action="detail-temp" method="post">
        <div class="govuk-grid-row">
          <div class="govuk-grid-column-two-thirds">

            <span class="govuk-caption-xl">Step 4 of 4</span>
            <h1 class="govuk-heading-xl">
              Selection process
            </h1>
            <div class="govuk-form-group">
              <fieldset class="govuk-fieldset" aria-describedby="passport-issued-hint" role="group">
                <legend class="govuk-fieldset__legend govuk-fieldset__legend--m">
                  Launch date and time
                </legend>
                <span id="waste-hint" class="govuk-hint">
                  For example, 31 05 2020 at 09:00
                </span>
                <div class="govuk-date-input" id="passport-issued">
                  <div class="govuk-date-input__item">
                    <div class="govuk-form-group">
                      <label class="govuk-label govuk-date-input__label" for="passport-issued-day">
                        Day
                      </label>
                      <input class="govuk-input govuk-date-input__input govuk-input--width-2" id="passport-issued-day" name="passport-issued-day" type="number" pattern="[0-9]*">
                    </div>
                  </div>
                  <div class="govuk-date-input__item">
                    <div class="govuk-form-group">
                      <label class="govuk-label govuk-date-input__label" for="passport-issued-month">
                        Month
                      </label>
                      <input class="govuk-input govuk-date-input__input govuk-input--width-2" id="passport-issued-month" name="passport-issued-month" type="number" pattern="[0-9]*">
                    </div>
                  </div>
                  <div class="govuk-date-input__item">
                    <div class="govuk-form-group">
                      <label class="govuk-label govuk-date-input__label" for="passport-issued-year">
                        Year
                      </label>
                      <input class="govuk-input govuk-date-input__input govuk-input--width-4" id="passport-issued-year" name="passport-issued-year" type="number" pattern="[0-9]*">
                    </div>
                  </div>
                  <div class="govuk-date-input__item">
                    <p class="govuk-body">at</p>
                  </div>
                  <div class="govuk-date-input__item" style="margin-right: 0.75rem;">
                    <div class="govuk-form-group">
                      <label class="govuk-label govuk-date-input__label" for="passport-issued-hour">
                        Hour
                      </label>
                      <input class="govuk-input govuk-date-input__input govuk-input--width-2" id="passport-issued-hour" name="passport-issued-hour" type="number" pattern="[0-9]*">
                    </div>
                  </div>
                  <div class="govuk-date-input__item" style="margin-right: 0.75rem;">
                    <p class="govuk-body" style="display: inline;">:</p>
                  </div>
                  <div class="govuk-date-input__item">
                    <div class="govuk-form-group">
                      <label class="govuk-label govuk-date-input__label" for="passport-issued-minute">
                        Minute
                      </label>
                      <input class="govuk-input govuk-date-input__input govuk-input--width-2" id="passport-issued-minute" name="passport-issued-minute" type="number" pattern="[0-9]*">
                    </div>
                  </div>
                </div>
              </fieldset>
            </div>
            <div class="govuk-form-group">
              <fieldset class="govuk-fieldset" aria-describedby="passport-issued-hint" role="group">
                <legend class="govuk-fieldset__legend govuk-fieldset__legend--m">
                  Closing date and time
                </legend>
                <span id="waste-hint" class="govuk-hint">
                  For example, 14 06 2020 at 20:00
                </span>
                <div class="govuk-date-input" id="passport-issued">
                  <div class="govuk-date-input__item">
                    <div class="govuk-form-group">
                      <label class="govuk-label govuk-date-input__label" for="passport-issued-day">
                        Day
                      </label>
                      <input class="govuk-input govuk-date-input__input govuk-input--width-2" id="passport-issued-day" name="passport-issued-day" type="number" pattern="[0-9]*">
                    </div>
                  </div>
                  <div class="govuk-date-input__item">
                    <div class="govuk-form-group">
                      <label class="govuk-label govuk-date-input__label" for="passport-issued-month">
                        Month
                      </label>
                      <input class="govuk-input govuk-date-input__input govuk-input--width-2" id="passport-issued-month" name="passport-issued-month" type="number" pattern="[0-9]*">
                    </div>
                  </div>
                  <div class="govuk-date-input__item">
                    <div class="govuk-form-group">
                      <label class="govuk-label govuk-date-input__label" for="passport-issued-year">
                        Year
                      </label>
                      <input class="govuk-input govuk-date-input__input govuk-input--width-4" id="passport-issued-year" name="passport-issued-year" type="number" pattern="[0-9]*">
                    </div>
                  </div>
                  <div class="govuk-date-input__item">
                    <p class="govuk-body">at</p>
                  </div>
                  <div class="govuk-date-input__item" style="margin-right: 0.75rem;">
                    <div class="govuk-form-group">
                      <label class="govuk-label govuk-date-input__label" for="passport-issued-hour">
                        Hour
                      </label>
                      <input class="govuk-input govuk-date-input__input govuk-input--width-2" id="passport-issued-hour" name="passport-issued-hour" type="number" pattern="[0-9]*">
                    </div>
                  </div>
                  <div class="govuk-date-input__item" style="margin-right: 0.75rem;">
                    <p class="govuk-body" style="display: inline;">:</p>
                  </div>
                  <div class="govuk-date-input__item">
                    <div class="govuk-form-group">
                      <label class="govuk-label govuk-date-input__label" for="passport-issued-minute">
                        Minute
                      </label>
                      <input class="govuk-input govuk-date-input__input govuk-input--width-2" id="passport-issued-minute" name="passport-issued-minute" type="number" pattern="[0-9]*">
                    </div>
                  </div>
                </div>
              </fieldset>
            </div>
            <div class="govuk-form-group">
              <fieldset class="govuk-fieldset" aria-describedby="citizenship-conditional-hint">
                <legend class="govuk-fieldset__legend govuk-fieldset__legend--m">
                  <h2 class="govuk-fieldset__heading">
                    Shortlisting type
                  </h2>
                </legend>
                <span id="citizenship-conditional-hint" class="govuk-hint">
                  Select all that apply
                </span>
                <div class="govuk-checkboxes" data-module="govuk-checkboxes">
                  <div class="govuk-checkboxes__item">
                    <input class="govuk-checkboxes__input" id="citizenship-conditional-3" name="citizen" type="checkbox" value="text message" aria-controls="conditional-citizenship-conditional-3" aria-expanded="false">
                    <label class="govuk-label govuk-checkboxes__label" for="citizenship-conditional-3">
                      Qualifying tests (QT)
                    </label>
                  </div>
                  <div class="govuk-checkboxes__conditional govuk-checkboxes__conditional--hidden" id="conditional-citizenship-conditional-3">
                    <div class="govuk-form-group">
                      <fieldset class="govuk-fieldset" aria-describedby="waste-hint">
                        <legend class="govuk-fieldset__legend govuk-fieldset__legend--xl">

                        </legend>
                        <div class="govuk-checkboxes">
                          <div class="govuk-checkboxes__item">
                            <input class="govuk-checkboxes__input" id="waste" name="waste" type="checkbox" value="carcasses">
                            <label class="govuk-label govuk-checkboxes__label" for="waste">
                              Situational judgement
                            </label>
                          </div>
                          <div class="govuk-checkboxes__item">
                            <input class="govuk-checkboxes__input" id="waste-2" name="waste" type="checkbox" value="mines">
                            <label class="govuk-label govuk-checkboxes__label" for="waste-2">
                              Critical analysis
                            </label>
                          </div>
                          <div class="govuk-checkboxes__item">
                            <input class="govuk-checkboxes__input" id="waste-3" name="waste" type="checkbox" value="farm">
                            <label class="govuk-label govuk-checkboxes__label" for="waste-3">
                              Scenario test
                            </label>
                          </div>
                        </div>
                      </fieldset>
                    </div>
                  </div>
                  <div class="govuk-checkboxes__item">
                    <input class="govuk-checkboxes__input" id="citizenship-conditional" name="citizen" type="checkbox" value="email" data-aria-controls="conditional-citizenship-conditional">
                    <label class="govuk-label govuk-checkboxes__label" for="citizenship-conditional">
                      Paper sift
                    </label>
                  </div>
                </div>
              </fieldset>
            </div>
            <button type="submit" class="govuk-button" data-module="govuk-button">
              Create exercise
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
