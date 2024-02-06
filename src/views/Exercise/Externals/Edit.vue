<template>
  <div class="govuk-grid-row">
    <form @submit.prevent="validateAndSave">
      <div class="govuk-grid-column-full">
        <h2 class="govuk-heading-l">
          External Vacancy
        </h2>

        <ErrorSummary
          :errors="errors"
          :show-save-button="true"
          @save="save"
        />

        <TextField
          id="exercise-name"
          v-model="formData.name"
          label="Exercise name"
          required
        />

        <DateInput
          id="open-for-applications"
          v-model="formData.applicationOpenDate"
          label="Open for applications"
          required
        />
        <DateInput
          id="closed-for-applications"
          v-model="formData.applicationCloseDate"
          label="Closed for applications"
          required
        />

        <TextField
          id="subscriber-alerts-url"
          v-model="formData.subscriberAlertsUrl"
          label="Subscriber alerts url"
          type="url"
        />

        <TextField
          id="contact"
          v-model="formData.exerciseMailbox"
          label="Contact"
          type="email"
        />

        <Checkbox
          id="welsh-posts"
          v-model="formData.welshPosts"
          label="Are there Welsh posts?"
          hint="If this exercise has any posts in Wales you should tick this box. You then need to complete the Brief Overview (Welsh)."
        />

        <RichTextInput
          id="brief-overview"
          v-model="formData.roleSummary"
          label="Brief Overview"
          hint="Short summary of the role for the vacancies listing page."
          class="custom-html"
          required
        />

        <RichTextInput
          v-if="formData.welshPosts"
          id="brief-overview-welsh"
          v-model="formData.roleSummaryWelsh"
          label="Brief Overview (Welsh)"
          hint="Fersywn Cymraeg"
          class="custom-html"
          required
        />

        <RichTextInput
          id="about-the-role"
          v-model="formData.aboutTheRole"
          label="About the role"
          hint="Short summary of the role for the vacancies listing page."
          class="custom-html"
        />

        <RichTextInput
          v-if="formData.welshPosts"
          id="about-the-role-welsh"
          v-model="formData.aboutTheRoleWelsh"
          label="About the role (Welsh)"
          hint="Fersywn Cymraeg"
          class="custom-html"
          required
        />

        <Select
          id="advert-type"
          v-model="formData.advertType"
          label="Advert Type"
          hint="Type of advert when published."
          required
        >
          <option
            v-for="exerciseAdvertType in exerciseAdvertTypes"
            :key="exerciseAdvertType"
            :value="exerciseAdvertType"
          >
            {{ $filters.lookup(exerciseAdvertType) }}
          </option>
        </Select>

        <RadioGroup
          id="appointment-type"
          v-model="formData.appointmentType"
          label="Appointment type"
        >
          <RadioItem
            v-if="formData.salaryGrouping"
            value="salaried"
            label="Salaried"
          >
            <div class="govuk-form-group">
              <label
                class="govuk-heading-m govuk-!-margin-bottom-2"
                for="salary-group"
              >
                Salary group
              </label>
              <Select
                id="salary-group"
                v-model="formData.salaryGrouping"
                class="govuk-select"
              >
                <option value="">
                  Select an option
                </option>
                <option value="group-1">
                  Group 1 - £262,264
                </option>
                <option value="group-1.1">
                  Group 1.1 - £234,184
                </option>
                <option value="group-2">
                  Group 2 - £226,193
                </option>
                <option value="group-3">
                  Group 3 - £215,094
                </option>
                <option value="group-4">
                  Group 4 - £188,901
                </option>
                <option value="group-5">
                  Group 5 - £151,497
                </option>
                <option value="group-5+">
                  Group 5+ - £160,377
                </option>
                <option value="group-6.1">
                  Group 6.1 - £140,289
                </option>
                <option value="group-6.2">
                  Group 6.2 - £132,075
                </option>
                <option value="group-7">
                  Group 7 - £112,542
                </option>
                <option value="group-8">
                  Group 8 - £89,428
                </option>
              </Select>
            </div>
          </RadioItem>

          <RadioItem
            v-else
            value="salaried"
            label="Salary Group"
          >
            <Currency
              id="salary"
              v-model="formData.salary"
              label="Amount"
              :required="formData.appointmentType == 'salaried'"
            />
          </RadioItem>

          <RadioItem
            value="fee-paid"
            label="Fee paid"
          >
            <Currency
              id="fee-paid-fee"
              v-model="formData.feePaidFee"
              label="Fee"
              :required="formData.appointmentType == 'fee-paid'"
            />
          </RadioItem>
          <RadioItem
            value="unpaid"
            label="Unpaid"
          />
        </RadioGroup>

        <TextareaInput
          id="location"
          v-model="formData.location"
          label="Location"
          rows="2"
        />

        <h2 class="govuk-label-input">
          Number of vacancies
        </h2>

        <TextField
          id="immediate-start"
          v-model="formData.immediateStart"
          label="Immediate start"
          input-class="govuk-input--width-3"
          hint="These are also called Section 87 (S87) vacancies."
        />

        <TextField
          id="future-start"
          v-model="formData.futureStart"
          label="Future start"
          input-class="govuk-input--width-3"
          hint="These are also called Section 94 (S94) vacancies."
        />

        <h2 class="govuk-label-input">
          Downloads
        </h2>

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

        <ListingPreview
          class="govuk-!-margin-bottom-4"
          :exercise="{...exercise, ...formData }"
        />
        <DetailPreview
          v-if="{...exercise, ...formData }.advertType !== 'listing'"
          class="govuk-!-margin-bottom-4"
          :exercise="{...exercise, ...formData }"
        />

        <button class="govuk-button">
          Save and continue
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import Form from '@jac-uk/jac-kit/draftComponents/Form/Form.vue';
import ErrorSummary from '@jac-uk/jac-kit/draftComponents/Form/ErrorSummary.vue';
import TextField from '@jac-uk/jac-kit/draftComponents/Form/TextField.vue';
import RichTextInput from '@jac-uk/jac-kit/draftComponents/Form/RichTextInput.vue';
import DateInput from '@jac-uk/jac-kit/draftComponents/Form/DateInput.vue';
import { ADVERT_TYPES } from '@/helpers/constants';
import Checkbox from '@jac-uk/jac-kit/draftComponents/Form/Checkbox.vue';
import ListingPreview from '@/components/Previews/ListingPreview.vue';
import DetailPreview from '@/components/Previews/DetailPreview.vue';
import exerciseMixin from '@/views/Exercise/exerciseMixin.js';
import RadioGroup from '@jac-uk/jac-kit/draftComponents/Form/RadioGroup.vue';
import RadioItem from '@jac-uk/jac-kit/draftComponents/Form/RadioItem.vue';
import Select from '@jac-uk/jac-kit/draftComponents/Form/Select.vue';
import Currency from '@jac-uk/jac-kit/draftComponents/Form/Currency.vue';
import TextareaInput from '@jac-uk/jac-kit/draftComponents/Form/TextareaInput.vue';
import Modal from '@jac-uk/jac-kit/components/Modal/Modal.vue';
import UploadFiles from '@/components/ModalViews/UploadFiles.vue';
import MultiFileUpload from '@/components/RepeatableFields/MultiFileUpload.vue';
import { exerciseAdvertTypes } from '@/helpers/exerciseHelper';

export default {
  name: 'SummaryEdit',
  components: {
    ErrorSummary,
    TextField,
    RichTextInput,
    DateInput,
    Checkbox,
    ListingPreview,
    DetailPreview,
    RadioGroup,
    RadioItem,
    Select,
    Currency,
    TextareaInput,
    Modal,
    UploadFiles,
  },
  extends: Form,
  mixins: [exerciseMixin],
  data() {
    const defaults = {
      name: null,
      applicationOpenDate: null,
      applicationCloseDate: null,
      isExternalVacancy: true,
      exerciseMailbox: null,
      welshPosts: false,
      roleSummary: '',
      roleSummaryWelsh: '',
      aboutTheRole: '',
      aboutTheRoleWelsh: '',
      appointmentType: null,
      salaryGrouping: null,
      salary: null,
      location: null,
      immediateStart: null,
      futureStart: null,
      subscriberAlertsUrl: null,
      advertType: ADVERT_TYPES.FULL,
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
      setDay: true,
      exerciseAdvertTypes: exerciseAdvertTypes(formData),
      repeatableFields: {
        MultiFileUpload,
      },
      uploadProps: {},
    };
  },
  computed: {
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    exerciseId() {
      return this.exercise.id;
    },
    applicationOpenDate: {
      get() {
        return this.parseDate({ ...this.exercise, ...this.formData }.applicationOpenDate);
      },
      set(val) {
        if (!val || !(val instanceof Date)){
          return;
        }

        let dateString = `${val.getUTCFullYear()}-${val.getUTCMonth() + 1}`;
        if (this.setDay) {
          dateString = `${dateString}-${val.getUTCDate()}`;
        }

        this.formData.applicationOpenDate = dateString;
      },
    },
    applicationCloseDate: {
      get() {
        return this.parseDate({ ...this.exercise, ...this.formData }.applicationCloseDate);
      },
      set(val) {
        if (!val || !(val instanceof Date)){
          return;
        }

        let dateString = `${val.getUTCFullYear()}-${val.getUTCMonth() + 1}`;
        if (this.setDay) {
          dateString = `${dateString}-${val.getUTCDate()}`;
        }

        this.formData.applicationCloseDate = dateString;
      },
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
        mandatory: false,
      });

      data.push({
        title: 'Terms and Conditions',
        id: 'termsAndConditions',
        name: 'terms-and-conditions',
        mandatory: false,
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

      data.push({
        title: 'Candidate Assessment Form',
        id: 'candidateAssessementForms',
        name: 'candidate-assessement-forms',
        mandatory: false,
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
    toggleLabel() {
      if (this.setDay) {
        return 'Remove launch day';
      }
      return 'Add launch day';
    },
    hasJourney() {
      return this.$store.getters['exerciseCreateJourney/hasJourney'];
    },
  },
  methods: {
    async save(isValid) {
      this.formData['progress.vacancySummary'] = isValid ? true : false;
      await this.$store.dispatch('exerciseDocument/save', this.formData);
      this.$router.push({ name: 'exercise-external' });
    },
    toggleDay() {
      this.setDay = !this.setDay;
    },
    parseDate(value) {
      if (value instanceof Date) {
        return value;
      }

      if (typeof value != 'string') {
        return;
      }
      const parts = value.split('-');
      if (parts.length === 3) {
        this.setDay = true;
      }
      const [year, month, day] = [...parts, 1];
      const date = new Date(Date.UTC(year, month - 1, day));

      return date;
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
