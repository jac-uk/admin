<template>
  <div class="govuk-grid-row">
    <div class="govuk-grid-column-full">
      <h2 class="govuk-heading-l">
        Downloads
      </h2>

      <ErrorSummary :errors="errors" />

      <div v-if="true">
        <div
          class="govuk-grid-column-full govuk-!-margin-top-5 govuk-!-margin-bottom-2"
        >
          <table class="govuk-table">
            <tbody class="govuk-table__body">
              <tr
                v-for="upload in uploadList"
                :key="upload.id"
                :ref="`${upload.id}-group`"
                class="govuk-table__row"
              >
                <th class="govuk-table__header">
                  {{ upload.title }}
                </th>
                <td class="govuk-table__cell">
                  <div>
                    <a
                      :class="`govuk-link moj-download-button ${!upload.mandatory ? 'optional' : ''}`"
                      href="#"
                      @click.prevent="modalUploadOpen({ ...upload })"
                    >
                      Add
                    </a>
                    <span
                      v-for="item in formData.downloads[upload.id]"
                      :key="item.id"
                    >
                      <a
                        class="govuk-link moj-download-link"
                        href="#"
                        @click.prevent="modalUploadOpen({ ...upload, fileRef: item.file, fileTitle: item.title })"
                      >
                        {{ item.title }}
                      </a>
                    </span>
                    <span
                      :id="`${upload.id}-error`"
                      :ref="`${upload.id}-error`"
                      class="govuk-error-message"
                    ><span class="govuk-visually-hidden">Error:</span> Please upload file: {{ upload.title }} </span>
                  </div>
                </td>
                <td class="govuk-table__cell text-right">
                  <strong
                    v-if="formData.downloads[upload.id] && formData.downloads[upload.id].length > 0"
                    class="govuk-tag"
                  >
                    Done
                  </strong>
                  <span
                    v-else
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <button
            class="govuk-button"
            @click="submitForm('continue')"
          >
            Save and continue
          </button>
        </div>
        <button
          class="govuk-button govuk-button--secondary govuk-!-margin-left-3"
          @click="submitForm('skip')"
        >
          Save and Skip
        </button>
        <Modal
          ref="modalRef"
        >
          <component
            :is="`UploadFiles`"
            v-bind="uploadProps"
            @close="modalUploadClose"
          />
        </Modal>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { hasIndependentAssessments } from '@/helpers/exerciseHelper';
import Form from '@jac-uk/jac-kit/draftComponents/Form/Form.vue';
import ErrorSummary from '@jac-uk/jac-kit/draftComponents/Form/ErrorSummary.vue';
import RepeatableFields from '@jac-uk/jac-kit/draftComponents/RepeatableFields.vue';
import MultiFileUpload from '@/components/RepeatableFields/MultiFileUpload.vue';
import Modal from '@jac-uk/jac-kit/components/Modal/Modal.vue';
import UploadFiles from '@/components/ModalViews/UploadFiles.vue';

export default {
  name: 'DownloadsEdit',
  components: {
    ErrorSummary,
    RepeatableFields,
    Modal,
    UploadFiles,
  },
  extends: Form,
  data() {
    const defaults = {
      downloads: {
        jobDescriptions: [],
        termsAndConditions: [],
        competencyFramework: [],
        pensionsInformation: [],
        skillsAndAbilitiesCriteria: [],
        independentAssessors: [],
        candidateAssessementForms: [],
        welshTranslation: [],
        statutoryConsultationGuidanceLetter: [],
        otherDownloads: [],
      },
    };
    const formData = this.$store.getters['exerciseDocument/data'](defaults);
    return {
      formData: formData,
      repeatableFields: {
        MultiFileUpload,
      },
      uploadProps: {},
    };
  },
  computed: {
    ...mapState({
      userId: state => state.auth.currentUser.uid,
    }),
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    exerciseId() {
      return this.exercise.id;
    },
    hasIndependentAssessments() {
      return hasIndependentAssessments(this.exercise);
    },
    uploadPath() {
      return `/exercise/${this.exerciseId}`;
    },
    uploadList() {
      const data = [];

      data.push({
        title: 'Job Description',
        id: 'jobDescriptions',
        name: 'job-descriptions',
        mandatory: true,
      });

      data.push({
        title: 'Terms and Conditions',
        id: 'termsAndConditions',
        name: 'terms-and-conditions',
        mandatory: true,
      });

      data.push({
        title: 'Competency Framework',
        id: 'competencyFramework',
        name: 'competency-framework',
        mandatory: false,
      });

      data.push({
        title: 'Pensions Information',
        id: 'pensionsInformation',
        name: 'pensions-information',
        mandatory: false,
      });

      data.push({
        title: 'Skills and Abilities Criteria',
        id: 'skillsAndAbilitiesCriteria',
        name: 'skills-and-abilities-criteria',
        mandatory: false,
      });

      if (this.hasIndependentAssessments) {
        data.push({
          title: 'Independent Assessors',
          id: 'independentAssessors',
          name: 'independent-assessors',
          mandatory: true,
          types: '.doc,.docx',
        });
      }

      data.push({
        title: 'Candidate Assessment Form',
        id: 'candidateAssessementForms',
        name: 'candidate-assessement-forms',
        mandatory: false,
        types: '.docx',
      });

      data.push({
        title: 'Welsh Translation',
        id: 'welshTranslation',
        name: 'welsh-translation',
        mandatory: false,
      });

      data.push({
        title: 'Statutory Consultation Guidance Letter',
        id: 'statutoryConsultationGuidanceLetter',
        name: 'statutory-consultation-guidance-letter',
        mandatory: false,
      });

      data.push({
        title: 'Other Downloads',
        id: 'otherDownloads',
        name: 'other-downloads',
        mandatory: false,
      });

      return data;
    },
    hasJourney() {
      return this.$store.getters['exerciseCreateJourney/hasJourney'];
    },
  },
  methods: {
    async save() {
      this.validate();
      if (this.isValid()) {
        this.formData['progress.downloads'] = true;
        await this.$store.dispatch('exerciseDocument/save', this.formData);
        this.$router.push(this.$store.getters['exerciseCreateJourney/nextPage']('exercise-show-downloads'));
      }
    },
    modalUploadOpen(obj) {
      this.validateUI(obj.id, false);
      this.uploadProps = {
        ...obj,
        filePath: this.uploadPath,
        fileTitle: obj.fileTitle ? obj.fileTitle : `${obj.title} - ${this.exercise.referenceNumber}`,
        data: this.formData.downloads,
        exerciseId: this.exerciseId,
      };
      this.$refs.modalRef.openModal();
    },
    modalUploadClose() {
      this.$refs.modalRef.closeModal();
    },
    async submitForm(action) {
      this.validateDownloads();
      const noErrors = this.errors.length === 0;
      if (noErrors) {
        this.formData['progress.downloads'] = true;
      } else {
        this.formData['progress.downloads'] = false;
      }
      await this.$store.dispatch('exerciseDocument/save', this.formData);
      if (noErrors || action === 'skip') {
        this.$router.push(this.$store.getters['exerciseCreateJourney/nextPage']('exercise-details-downloads'));
      }
    },
    validateDownloads() {
      this.errors = [];
      this.validateItem('jobDescriptions');
      this.validateItem('termsAndConditions');
      // this.validateItem('competencyFramework');
      // pensionsInformation: this.validateItem('pensionsInformation');
      // this.validateItem('skillsAndAbilitiesCriteria');
      if (this.hasIndependentAssessments) {
        this.validateItem('independentAssessors');
      }
      // this.validateItem('candidateAssessementForms');
      // this.validateItem('welshTranslation');
      // this.validateItem('otherDownloads');

      // govuk-form-group--error
      // <span id="candidate-assessement-forms_0--title-error" class="govuk-error-message"><span class="govuk-visually-hidden">Error:</span> Please enter a value for Title of file </span>
    },
    validateItem(downloadId) {
      const isValid = this.formData.downloads[downloadId] && this.formData.downloads[downloadId].length > 0;
      if (!isValid) {
        this.errors.push({ id: downloadId, message: `Please add ${this.getDownloadTitle(downloadId)}` });
        this.validateUI(downloadId, true);
      }
      return isValid;
    },
    getDownloadTitle(downloadId) {
      const theList = this.uploadList.filter( item => item.id === downloadId)[0];
      return theList ? theList.title : '';
    },
    validateUI(downloadId, add) {
      const wrapperCssClass = this.$refs[`${downloadId}-group`][0].classList;
      const itemCssClass = this.$refs[`${downloadId}-error`][0].classList;
      if (add) {
        itemCssClass.add('active');
        wrapperCssClass.add('govuk-form-group--error');
      } else {
        itemCssClass.remove('active');
        wrapperCssClass.remove('govuk-form-group--error');
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.moj-download-link {
  background-color: #f3f2f1;
  padding: 5px;
  margin: 0 5px 5px 5px;
  display: inline-block;
}
.moj-download-button {
  @extend .moj-download-link;
  background-color: #00703c;
  text-decoration: none;

  &:visited,
  &:link {
    color: #ffffff;
  }

  &.optional {
    background-color: #f3f2f1;
    color: #0b0c0c;
  }
}
.govuk-form-group--error th {
  padding-left: .5em;
}
.govuk-error-message {
  display: none;

  &.active {
    display: inherit;
  }
}
</style>
