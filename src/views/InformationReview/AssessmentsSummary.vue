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
          </dt>
          <dd class="govuk-summary-list__value">
            <InformationReviewRenderer
              :data="hasAscAnswers(index) ? application.selectionCriteriaAnswers[index].answer : null"
              :edit="editable && authorisedToPerformAction"
              :index="index"
              extension="answer"
              type="selection"
              :options="[true, false]"
              field="selectionCriteriaAnswers"
              :is-asked="isApplicationPartAsked('statementOfSuitability')"
              @change-field="changeAssessmentInfo"
            />
            <div
              v-if="hasAscAnswers(index)"

              class="govuk-body"
            >
              <dt class="govuk-summary-list__key">
                Answer ({{ item.wordLimit ? item.wordLimit : '250' }} words)
              </dt>
              <InformationReviewRenderer
                v-if="application.selectionCriteriaAnswers[index] && application.selectionCriteriaAnswers[index].answer === true"
                :data="hasAscAnswerDetails(index) ? application.selectionCriteriaAnswers[index].answerDetails : null"
                :edit="editable && authorisedToPerformAction"
                :index="index"
                extension="answerDetails"
                field="selectionCriteriaAnswers"
                type="textarea"
                :is-asked="isApplicationPartAsked('statementOfSuitability')"
                @change-field="changeAssessmentInfo"
              />
            </div>
          </dd>
        </div>
      </div>

      <dl v-else>
        <p class="govuk-body">
          No information
          <span v-if="!isApplicationPartAsked('statementOfSuitability')">
            (not asked)
          </span>
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
            <span v-else>
              No information
              <span v-if="!isApplicationPartAsked('statementOfSuitability')">
                (not asked)
              </span>
            </span>
            <div>
              <FileUpload
                v-if="editable"
                id="suitability-statement-file"
                ref="suitability-statement"
                v-model="application.uploadedSuitabilityStatement"
                name="suitability-statement"
                :path="uploadPath"
                @update:model-value="val => doFileUpload(val, 'uploadedSuitabilityStatement')"
              />
            </div>
          </dd>
        </div>
      </dl>
    </div>

    <!-- SELF ASSESSMENT COMPETENCIES -->
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
            Uploaded self assessment with competencies
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

            <!-- UPLOAD SELF ASSESSMENT -->
            <div>
              <FileUpload
                v-if="editable"
                id="self-assessment-upload"
                ref="self-assessment"
                v-model="application.uploadedSelfAssessment"
                name="self-assessment"
                :path="uploadPath"
                label="Upload finished self assessment"
                required
                :acceptable-extensions="['docx']"
                @update:model-value="val => doFileUpload(val, 'uploadedSelfAssessment')"
              />
            </div>
          </dd>
        </div>
        <!-- SELF ASSESSMENT SECTIONS -->
        <div
          class="govuk-summary-list__row"
        >
          <dt class="govuk-summary-list__key">
            Self assessment content
            <Spinner
              v-if="isExtractingSelfAssessment"
              class="govuk-!-margin-left-2"
            />
          </dt>
          <dd class="govuk-summary-list__value">
            <div v-if="selfAssessmentSections">
              <div
                v-for="(section, i) in selfAssessmentSections"
                :key="i"
                style="white-space: pre-line;"
              >
                <AssessmentSection
                  :application="application"
                  :section="section"
                  :content="application.uploadedSelfAssessmentContent[i]||''"
                  :editable="editable"
                  :index="i"
                  @update-application="changeSelfAssessmentAnswer"
                />
                <hr
                  v-if="i !== selfAssessmentSections.length - 1"
                  class="govuk-!-margin-top-3 govuk-!-margin-bottom-3"
                >
              </div>
            </div>
            <span v-else>Not yet received</span>
          </dd>
        </div>
      </dl>
    </div>

    <!-- CV -->
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
            <span v-else>
              No information
              <span v-if="!isApplicationPartAsked('cv')">
                (not asked)
              </span>
            </span>
            <div>
              <FileUpload
                v-if="editable"
                id="cv-upload"
                ref="cv"
                v-model="application.uploadedCV"
                name="cv"
                :path="uploadPath"
                @update:model-value="val => doFileUpload(val, 'uploadedCV')"
              />
            </div>
          </dd>
        </div>
      </dl>
    </div>

    <!-- COVERING LETTER -->
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
            <span v-else>
              No information
              <span v-if="!isApplicationPartAsked('coveringLetter')">
                (not asked)
              </span>
            </span>
            <div>
              <FileUpload
                v-if="editable"
                id="covering-letter-file"
                ref="covering-letter-upload"
                v-model="application.uploadedCoveringLetter"
                name="covering-letter"
                :path="uploadPath"
                @update:model-value="val => doFileUpload(val, 'uploadedCoveringLetter')"
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
  hasSelfAssessment,
  isApplicationPartAsked
} from '@/helpers/exerciseHelper';
import InformationReviewRenderer from '@/components/Page/InformationReviewRenderer.vue';
import DownloadLink from '@jac-uk/jac-kit/draftComponents/DownloadLink.vue';
import FileUpload from '@jac-uk/jac-kit/draftComponents/Form/FileUpload.vue';
import Spinner from '@jac-uk/jac-kit/components/Spinner.vue';
import AssessmentSection from '@/components/RepeatableFields/AssessmentSection.vue';
export default {
  name: 'AssessmentsSummary',
  components: {
    DownloadLink,
    FileUpload,
    InformationReviewRenderer,
    Spinner,
    AssessmentSection,
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
    authorisedToPerformAction: {
      type: [Boolean, Function, Promise],
      required: true,
      default: false,
    },
  },
  emits: ['updateApplication'],
  data() {
    return {
      assessorDetails: {},
      isLoadingFile: false,
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
    selfAssessmentSections() {
      return this.exercise.selfAssessmentWordLimits || [];
    },
    isExtractingSelfAssessment() {
      return this.$store.state.application.isExtractingSelfAssessment;
    },
  },
  methods: {
    hasAscAnswerDetails(index){
      if (this.application.selectionCriteriaAnswers) {
        if (this.application.selectionCriteriaAnswers[index]) {
          return this.application.selectionCriteriaAnswers[index].hasOwnProperty('answerDetails');
        }
      }
    },
    hasAscAnswers(index){
      if (this.application.selectionCriteriaAnswers) {
        if (this.application.selectionCriteriaAnswers[index]) {
          return this.application.selectionCriteriaAnswers[index].hasOwnProperty('answer');
        }
      }
    },
    changeAssessmentInfo(obj) {
      let changedObj = this.application[obj.field] || [];
      if (!changedObj[obj.index]) {
        changedObj = {
          [obj.index]: {
            [obj.extension]: obj.change,
          },
        };
      } else {
        changedObj[obj.index][obj.extension] = obj.change;
      }
      this.$emit('updateApplication', { [obj.field]: changedObj });
    },
    changeSelfAssessmentAnswer(obj) {
      this.$emit('updateApplication', obj);
    },

    async doFileUpload(val, field) {
      if (val) {
        this.$emit('updateApplication', { [field]: val });
      }
    },
    isApplicationPartAsked(part) {
      return isApplicationPartAsked(this.exercise, part);
    },
  },
};
</script>
<style scoped>
.widerColumn {
  width: 70%;
}
</style>
