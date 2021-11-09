<template>
  <div>
    <div
      v-if="exercise.aSCApply"
      class="govuk-!-margin-top-9"
    >
      <h2 class="govuk-heading-l">
        Additional Selection Criteria
      </h2>

      <div
        v-if="editable || (application.selectionCriteriaAnswers && exercise.selectionCriteria)"
      >
        <div
          v-for="(item, index) in exercise.selectionCriteria"
          :key="index"
          class="govuk-summary-list govuk-!-margin-bottom-0"
        >
          <dt class="govuk-summary-list__key widerColumn">
            {{ item.title }}
            <br>
            {{ item.wordLimit }} words
          </dt>
          <dd class="govuk-summary-list__value">
            <InformationReviewRenderer
              :data="application.selectionCriteriaAnswers[index].answer"
              :edit="editable"
              :index="index"
              extension="answer"
              type="selection"
              :options="[true, false]"
              field="selectionCriteriaAnswers"
              @changeField="changeAssessmentInfo"
            />
            <div
              v-if="hasAscAnswers(index)"
            >
              <InformationReviewRenderer
                v-if="application.selectionCriteriaAnswers[index] && application.selectionCriteriaAnswers[index].answer === true"
                :data="application.selectionCriteriaAnswers[index].answerDetails"
                :edit="editable"
                :index="index"
                extension="answerDetails"
                field="selectionCriteriaAnswers"
                type="textarea"
                @changeField="changeAssessmentInfo"
              /> 
              <span v-else>
                Does not meet this requirement
              </span>
            </div>
          </dd>
        </div>
      </div>

      <dl v-else>
        <p class="govuk-body">
          No answers provided
        </p>
      </dl>
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
          <dt class="govuk-summary-list__key widerColumn">
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

      <dl class="govuk-summary-list">
        <div
          class="govuk-summary-list__row"
        >
          <dt class="govuk-summary-list__key">
            Uploaded self assessment
          </dt>
          <dd class="govuk-summary-list__value">
            <div v-if="application.uploadedSelfAssessment">
              <DownloadLink
                :file-name="application.uploadedSelfAssessment"
                :exercise-id="exercise.id"
                :user-id="application.userId"
                :title="application.uploadedSelfAssessment"
              />
            </div>
            <span v-else>Not yet received</span>
            <div v-if="editable">
              <FileUpload
                id="self-assessment-upload"
                ref="self-assessment"
                v-model="application.uploadedSelfAssessment"
                name="self-assessment"
                :path="`/exercise/${exercise.id}/user/${application.userId}`"
                required
                @input="val => doFileUpload(val, 'uploadedSelfAssessment')"
              />
            </div>
          </dd>
        </div>
      </dl>
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
          <dt class="govuk-summary-list__key widerColumn">
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
          <dt class="govuk-summary-list__key widerColumn">
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
import InformationReviewRenderer from '@/components/Page/InformationReviewRenderer';
import DownloadLink from '@jac-uk/jac-kit/draftComponents/DownloadLink';
import FileUpload from '@jac-uk/jac-kit/draftComponents/Form/FileUpload';

export default {
  name: 'AssessmentsSummary',
  components: {
    DownloadLink,
    FileUpload,
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
    hasAscAnswers(index){
      if (this.application.selectionCriteriaAnswers) {
        return this.application.selectionCriteriaAnswers[index] && 'answer' in this.application.selectionCriteriaAnswers[index];
      } else {
        return false;
      }
    },
    changeAssessmentInfo(obj) {

      let objChanged = this.application[obj.field] || [];

      if (obj.extension && obj.hasOwnProperty('index')) { //nested field
        if (!objChanged[obj.index]) {
          objChanged = {
            [obj.index]: {
              [obj.extension]: obj.change,
            },
          };
        } else {
          objChanged[obj.index][obj.extension] = obj.change;
        }
      } else if (obj.change && obj.hasOwnProperty('index')) { //direct field
        objChanged[obj.index] = obj.change;
      } else if (obj.hasOwnProperty('index') && obj.remove) { // REMOVE
        if (objChanged.length > 0){
          objChanged.splice(obj.index, 1);
        } else {
          objChanged = [];
        } 
      } else {
        objChanged = obj;
      }

      const updatedApplication = { ...this.application, ...{ [obj.field]: objChanged } };

      this.$store.dispatch('application/update', { data: updatedApplication, id: this.applicationId });
    },
    doFileUpload(val, field) {
      if (val) {
        this.$store.dispatch('application/update', { data: { [field]: val }, id: this.applicationId });
      }
    },
  },
};
</script>
<style scoped>
.widerColumn {
  width: 70%;
}
</style>
