<template>
  <div>
    <div
      v-if="exercise.aSCApply"
      class="govuk-!-margin-top-9"
    >
      <h2 class="govuk-heading-l">
        Additional Selection Criteria
      </h2>

      <dl
        v-if="application.selectionCriteriaAnswers || editable"
        class="govuk-summary-list"
      >
        <div
          v-for="(item, index) in exercise.selectionCriteria"
          :key="index"
          class="govuk-summary-list__row"
        >
          <dt class="govuk-summary-list__key">
            {{ item.title }}
          </dt>
          <dd class="govuk-summary-list__value">
            <InformationReviewRenderer
              :data="application.selectionCriteriaAnswers[index].answer"
              :edit="editable"
              :index="index"
              extension="answer"
              :data-default="emptyASCObject"
              type="selection"
              :options="[true, false]"
              field="selectionCriteriaAnswers"
              @changeField="changeAssessmentInfo"
            />
            <InformationReviewRenderer
              v-if="application.selectionCriteriaAnswers[index].answer"
              :data="application.selectionCriteriaAnswers[index].answerDetails"
              :edit="editable"
              :index="index"
              :data-default="emptyASCObject"
              extension="answerDetails"
              field="selectionCriteriaAnswers"
              @changeField="changeAssessmentInfo"
            />
            <span v-else>
              Does not meet this requirement
            </span>
          </dd>
        </div>
      </dl>
      <span v-else>No answers provided</span>
    </div>
    
    <div
      v-if="hasStatementOfSuitability"
      class="govuk-!-margin-top-9"
    >
      <h2 class="govuk-heading-l">
        Statement of suitability
      </h2>

      <dl class="govuk-summary-list">
        <div
          class="govuk-summary-list__row"
        >
          <dt class="govuk-summary-list__key">
            Uploaded statement of suitability
          </dt>
          <dd class="govuk-summary-list__value">
            <div v-if="application.uploadedSuitabilityStatement">
              <DownloadLink
                :file-name="application.uploadedSuitabilityStatement"
                :exercise-id="exercise.id"
                :user-id="application.userId"
                :title="application.uploadedSuitabilityStatement"
              />
            </div>
            <span v-else>Not yet received</span>
            <div>
              <FileUpload
                v-if="editable"
                id="suitability-statement-file"
                ref="suitability-statement"
                v-model="application.uploadedSuitabilityStatement"
                name="suitability-statement"
                :path="`/exercise/${exercise.id}/user/${application.userId}`"
                @input="val => doFileUpload(val, 'uploadedSuitabilityStatement')"
              />
            </div>
          </dd>
        </div>
      </dl>
    </div>
      
    <div
      v-if="hasSelfAssessment"
      class="govuk-!-margin-top-9"
    >
      <h2 class="govuk-heading-l">
        Self assessment competencies
      </h2>

      <dl
        v-if="application.selectionCriteriaAnswers || editable"
        class="govuk-summary-list"
      >
        <div
          v-for="(item, index) in exercise.selectionCriteria"
          :key="index"
          class="govuk-summary-list__row"
        >
          <dt class="govuk-summary-list__key">
            {{ item.title }}
          </dt>
          <dd class="govuk-summary-list__value">
            <InformationReviewRenderer
              :data="application.selectionCriteriaAnswers[index].answer"
              :edit="editable"
              :index="index"
              extension="answer"
              :data-default="emptyASCObject"
              type="selection"
              :options="[true, false]"
              field="selectionCriteriaAnswers"
              @changeField="changeAssessmentInfo"
            />
            <InformationReviewRenderer
              v-if="application.selectionCriteriaAnswers[index].answer"
              :data="application.selectionCriteriaAnswers[index].answerDetails"
              :edit="editable"
              :index="index"
              :data-default="emptyASCObject"
              extension="answerDetails"
              field="selectionCriteriaAnswers"
              @changeField="changeAssessmentInfo"
            />
            <span v-else>
              Does not meet this requirement
            </span>
          </dd>
        </div>
      </dl>
      <span v-else>No answers provided</span>
    </div>

    <div
      v-if="hasCV"
      class="govuk-!-margin-top-9"
    >
      <h2 class="govuk-heading-l">
        Curriculum vitae (CV)
      </h2>

      <dl class="govuk-summary-list">
        <div
          class="govuk-summary-list__row"
        >
          <dt class="govuk-summary-list__key">
            Uploaded CV
          </dt>
          <dd class="govuk-summary-list__value">
            <div v-if="application.uploadedCV">
              <DownloadLink
                :file-name="application.uploadedCV"
                :exercise-id="exercise.id"
                :user-id="application.userId"
                title="CV"
              />
            </div>
            <span v-else>Not yet received</span>
            <div>
              <FileUpload
                v-if="editable"
                id="cv-upload"
                ref="cv"
                v-model="application.uploadedCV"
                name="cv"
                :path="uploadPath"
              />
            </div>
          </dd>
        </div>
      </dl>
    </div>

    <div
      v-if="hasCoveringLetter"
      class="govuk-!-margin-top-9"
    >
      <h2 class="govuk-heading-l">
        Covering letter
      </h2>

      <dl class="govuk-summary-list">
        <div
          class="govuk-summary-list__row"
        >
          <dt class="govuk-summary-list__key">
            Uploaded Covering Letter
          </dt>
          <dd class="govuk-summary-list__value">
            <div v-if="application.uploadedCoveringLetter">
              <DownloadLink
                :file-name="application.uploadedCoveringLetter"
                :exercise-id="exercise.id"
                :user-id="application.userId"
                title="Covering Letter"
              />
            </div>
            <span v-else>Not yet received</span>
            <div>
              <FileUpload
                v-if="editable"
                id="covering-letter-file"
                ref="covering-letter-upload"
                v-model="application.uploadedCoveringLetter"
                name="covering-letter"
                :path="`/exercise/${exercise.id}/user/${application.userId}`"
                @input="val => doFileUpload(val, 'uploadedCoveringLetter')"
              />
            </div>
          </dd>
        </div>
      </dl>
    </div>
  </div>
</template>
<script>
import {
  hasStatementOfSuitability,
  hasCV,
  hasCoveringLetter,
  hasSelfAssessment
} from '@/helpers/exerciseHelper';
// import InformationReviewSectionRenderer from '@/components/Page/InformationReviewSectionRenderer'; fs
import InformationReviewRenderer from '@/components/Page/InformationReviewRenderer';
import DownloadLink from '@jac-uk/jac-kit/draftComponents/DownloadLink';
import FileUpload from '@jac-uk/jac-kit/draftComponents/Form/FileUpload';

export default {
  components: {
    DownloadLink,
    FileUpload,
    // InformationReviewSectionRenderer,
    InformationReviewRenderer,
  },
  props: {
    application: {
      type: Object,
      required: true,
      default: () => {},
    },
    editable: {
      type: [Boolean, Function, Promise],
      required: true,
      default: false,
    },
  },
  data() {
    return {
      assessorDetails: {},
    };
  },
  computed: {
    hasStatementOfSuitability() {
      return hasStatementOfSuitability(this.exercise);
    },
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    hasSelfAssessment() {
      return hasSelfAssessment(this.exercise);
    },
    hasCV() {
      return hasCV(this.exercise);
    },
    hasCoveringLetter() {
      return hasCoveringLetter(this.exercise);
    },
    emptyASCObject() {
      return {
        'title': '',
        'answer': false,
      };
    },
    uploadPath() {
      return `/exercise/${this.exercise.id}/user/${this.application.userId}`;
    },
    userId() {
      return this.$store.state.auth.currentUser.uid;
    },
    applicationId() {
      return this.$route.params.applicationId;
    },
  },
  methods: {
    changeAssessmentInfo(obj) {
      console.log(obj);
    },
    doFileUpload(val, field) {
      if (val) {
        this.$store.dispatch('application/update', { data: { [field]: val }, id: this.applicationId });
      }
    },
  },
};
</script>
