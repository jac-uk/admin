<template>
  <div>
    <div class="govuk-grid-column-full govuk-!-margin-bottom-1">
      <h2 class="govuk-heading-m">
        Qualifying Test Response: 
        <routerLink :to="{ name: 'qualifying-test-view', params: { qualifyingTestId: $route.params.qualifyingTestId } }">
          {{ qualifyingTest.title | showAlternative(qualifyingTest.id) }}
        </routerLink>
      </h2>
      <h3 class="govuk-heading-l">
        {{ candidate && candidate.fullName | showAlternative(candidate && candidate.id) }}
      </h3>

      <h2 class="govuk-heading-m">
        Test details
      </h2>

      <dl class="govuk-summary-list">
        <div class="govuk-summary-list__row">
          <dt class="govuk-summary-list__key">
            Type
          </dt>
          <dd class="govuk-summary-list__value">
            {{ qualifyingTest.type | lookup }}
          </dd>
        </div>
        <div class="govuk-summary-list__row">
          <dt class="govuk-summary-list__key">
            Status
          </dt>
          <dd class="govuk-summary-list__value">
            {{ qualifyingTest.status | lookup }}
          </dd>
        </div>
        <div class="govuk-summary-list__row">
          <dt class="govuk-summary-list__key">
            Start date
          </dt>
          <dd class="govuk-summary-list__value">
            {{ qualifyingTest.startDate | formatDate('datetime') }}
          </dd>
        </div>
        <div class="govuk-summary-list__row">
          <dt class="govuk-summary-list__key">
            End date
          </dt>
          <dd class="govuk-summary-list__value">
            {{ qualifyingTest.endDate | formatDate('datetime') }}
          </dd>
        </div>
        <div class="govuk-summary-list__row">
          <dt class="govuk-summary-list__key">
            Additional instructions
          </dt>
          <dd class="govuk-summary-list__value">
            <ul class="govuk-list">
              <li
                v-for="(item, index) in qualifyingTest.additionalInstructions"
                :key="index"
              >
                {{ item.text }}
              </li>
            </ul>
          </dd>
        </div>
        <div class="govuk-summary-list__row">
          <dt class="govuk-summary-list__key">
            Duration
          </dt>
          <dd class="govuk-summary-list__value">
            {{ qualifyingTest.testDuration }} minutes
          </dd>
        </div>
        <div class="govuk-summary-list__row">
          <dt class="govuk-summary-list__key">
            Reasonable Adjustments
          </dt>
          <dd 
            v-if="response"
            class="govuk-summary-list__value" 
          >
            <EditableField 
              :value="response.duration.reasonableAdjustment"
              field="reasonableAdjustment"
              @changefield="(obj) => actionReasonableAdjustment(obj, response.duration, responseId)"
            />
            {{ response.duration.testDurationAdjusted }} minutes: 
            {{ response.candidate.reasonableAdjustmentsDetails }}
          </dd>
        </div>
      </dl>

      <h2 class="govuk-heading-m">
        Questions
      </h2>
      
      <dl class="govuk-summary-list">
        <div
          v-if="qualifyingTest.testQuestions.introduction"
          class="govuk-summary-list__row"
        >
          <dt
            class="govuk-summary-list__key"
          >
            Introduction
          </dt>
          <dd class="govuk-summary-list__value">
            {{ qualifyingTest.testQuestions.introduction }}
          </dd>
        </div>

        <div
          v-for="(testQuestion, index) in qualifyingTest.testQuestions.questions"
          :key="index"
          class="govuk-summary-list__row"
        >
          <dt class="govuk-summary-list__key">
            {{ questionLabel }} {{ index + 1 }}
          </dt>
          <dd class="govuk-summary-list__value">
            <!-- eslint-disable -->
            <div
              v-html="testQuestion.details"
            />
            <!-- eslint-enable -->

            <hr class="govuk-section-break govuk-section-break--visible">
            <ol>
              <li
                v-for="(res, i) in responses"
                :key="i"
              >
                {{ res.text }}
              </li>
            </ol>
          </dd>
        </div>
      </dl>
    </div>
  </div>
</template>

<script>
import { QUALIFYING_TEST } from '@/helpers/constants';
import EditableField from '@/components/EditableField';

export default {
  components: {
    EditableField,
  },
  computed: {
    responseId() {
      const id = this.$route.params.responseId;
      // eslint-disable-next-line no-console
      // console.log('id', id);
      return id;
    },
    response() {
      const qtList = this.$store.state.qualifyingTestResponses.record;
      // eslint-disable-next-line no-console
      // console.log('qtList response', qtList);
      return qtList;
    },
    qualifyingTest() {
      const qtList = this.$store.state.qualifyingTest.record;
      // eslint-disable-next-line no-console
      // console.log('qtList qualifyingTest', qtList);
      return qtList;
    },
    candidate() {
      return this.response ? this.response.candidate : null;
    },
    responses() {
      return this.response ? this.response.responses : null;
    },
    questionLabel() {
      let label = 'Question';

      if (this.qualifyingTest.type === QUALIFYING_TEST.TYPE.SCENARIO) {
        label = 'Scenario';
      }
      return label;
    },
  },
  async created() {
    // eslint-disable-next-line no-console
    // console.log('created');
    this.$store.dispatch('qualifyingTestResponses/bindRecord', { id: this.responseId });
  },
};
</script>

