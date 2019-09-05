<template>
  <div>
    <!-- title -->
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-full">
        <span class="govuk-caption-xl">118
          <span class="govuk-tag govuk-tag-dark">
            Legal
          </span>
        </span>
        <h1
          class="govuk-heading-xl"
          style="margin-bottom:0px;"
        >
          Senior circuit judge of the Employment Appeal Tribunal
        </h1>
        <div style="text-align: right;">
          <a
            href="#"
            class="govuk-button govuk-button--secondary"
          >
            ☆ Add 118 to your exercises
          </a>
        </div>
      </div>
    </div>
    <!-- number of vacancies, number of applications and the timeline -->
    <div class="govuk-grid-row">
      <div class="panel-container">
        <div class="govuk-grid-column-two-thirds">
          <!-- PANELS -->
          <div class="govuk-panel--s govuk-panel--grey govuk-!-padding-3 govuk-!-margin-bottom-3">
            <div class="govuk-panel__body">
              <span>Number of vacancies</span>
            </div>
            <span class="govuk-panel__title">90</span>
          </div>

          <div class="govuk-panel--s govuk-panel--grey govuk-!-padding-3 govuk-!-margin-bottom-8">
            <div class="govuk-panel__body">
              <span>Number of applications</span>
            </div>
            <span class="govuk-panel__title">76</span>
            <div>
              <a
                href="#"
                class="govuk-link"
              >View applications</a>
            </div>
          </div>

          <!-- Left column info -->
          <h2 class="govuk-heading-m govuk-!-margin-bottom-0">
            Senior Selection Exercise Manager
          </h2>
          <div class="govuk-body">
            <span>Phillippa Samuels</span>
            <div>
              <a
                class="govuk-link"
                href="#"
              >
                phillippa.samuels@jac.gov.uk
              </a>
            </div>
            <span>0208 123 4567</span>
          </div>

          <h2 class="govuk-heading-m govuk-!-margin-bottom-0">
            Shortlisting methods
          </h2>
          <ul class="govuk-body">
            <li>Situational judgment test</li>
            <li>Critical analysis test</li>
          </ul>

          <h2 class="govuk-heading-m govuk-!-margin-bottom-0">
            Jurisdiction
          </h2>
          <p class="govuk-body">
            Employment
          </p>

          <h2 class="govuk-heading-m govuk-!-margin-bottom-0">
            Location
          </h2>
          <p class="govuk-body">
            England and Wales
          </p>

          <h2 class="govuk-heading-m govuk-!-margin-bottom-0">
            Appointment type
          </h2>
          <p class="govuk-body">
            Salaried
          </p>

          <h2 class="govuk-heading-m govuk-!-margin-bottom-0">
            Does additional selection criteria (ASC) apply?
          </h2>
          <p class="govuk-body">
            Yes
          </p>
        </div>

        <div class="govuk-grid-column-one-third">
          <!--BLUE PANEL-->
          <div class="govuk-panel--s govuk-panel--highlight govuk-!-padding-3 govuk-!-margin-bottom-3">
            <div class="govuk-panel__body--s">
              STATUS
            </div>
            <span class="govuk-panel__body">Open for applications</span>
          </div>

          <Timeline 
            :data="timeline1" 
          />

          <!--LINK-->
          <p class="govuk-body">
            <a
              target="blank"
              href="https://www.judicialappointments.gov.uk/138-deputy-judge-upper-tribunal-immigration-and-asylum-chamber-information-page"
            >
              View info page
            </a>
          </p>
          <p class="govuk-body">
            <a
              target="blank"
              href="https://www.judicialappointments.gov.uk/138-deputy-judge-upper-tribunal-immigration-and-asylum-chamber-information-page"
            >
              View application form
            </a>
          </p>

          <a
            href="#"
            class="govuk-button govuk-button--warning"
          >
            Delete exercise
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Timeline from '@/components/Page/Timeline';

export default {
  components: {
    Timeline,
  },
  data() {
    return {
      timeline1: [
        { 'entry': 'Closed for applications', 'date': '6 August 2019' },
        { 'entry': 'Situational judgment test, Critical analysis test', 'date': '17 September 2019' },
      ],
    };
  },
};
</script>

<style>
  /* panel */
  .govuk-panel--grey {
    color: #0b0c0c;
    background: #f3f2f1;
  }

  .govuk-panel--highlight {
    color: #ffffff;
    background: #1d70b8;
  }

  .govuk-tag-dark {
    background-color: #0b0c0c;
  }
</style>
