<template>
  <div>
    <div class="modal__title govuk-!-padding-2 govuk-heading-m">
      Upload Scenario QT Scores
    </div>
    <div class="modal__content govuk-!-padding-4" v-if="!fileName">
      <p class="modal__message govuk-body-l">
        <FileUpload
          id="qt-scores-file"
          v-model="fileName"
          :name="`${$attrs.name}-${getNumericalFileName()}`"
          :path="buildFileFolder"
          :file-path="$attrs.filePath"
          label="Please upload the XLSX containing the Qualifying Test Scores"
          required
          @input="changeFileName"
        />
      </p>
      <p>
        <button
          class="govuk-button govuk-button--secondary govuk-!-margin-right-3"
          @click="closeModal"
        >
          Cancel
        </button>
      </p>
    </div>

    <div class="modal__content govuk-!-padding-4" v-if="this.fileName && !this.importResults">
      Processing file...

    </div>
    <div class="modal__content govuk-!-padding-4" v-if="this.importResults">
      <p>Successfully imported {{ importResults.data.successfullyImported }} records.</p>
      <p>The following row numbers were not imported: </p>
      <ul>
        <li
          v-for="(row, index) in importResults.data.rowsNotImported.slice().reverse()"
          :key="index"
        >
          Row {{ row.rowNumber }} - {{ row.rowError }}
        </li>
      </ul>
      <p>
        <button
          class="govuk-button govuk-button--secondary govuk-!-margin-right-3"
          @click="closeModal"
        >
          Close
        </button>
      </p>
    </div>
  </div>
</template>

<script>
import FileUpload from '@jac-uk/jac-kit/draftComponents/Form/FileUpload';
import { functions } from '@/firebase';

export default {
  name: 'UploadScores',
  components: {
    FileUpload,
  },
  data() {
    return {
      fileName: '',
      importResults: null,
    };
  },
  computed: {
    buildFileFolder() {
      return this.$attrs.filePath;
    },
  },
  methods: {
    closeModal() {
      this.$emit('close');
      this.importResults = null;
    },
    confirmModal() {
      this.modalOpen = false;
      this.$emit('confirmed');
      document.body.style.overflow = '';
    },
    changeFileName(val) {
      console.log(val);
      this.fileName = val;
      this.save();
    },
    async save() {
      this.importResults = await functions.httpsCallable('processQualifyingTestScores')({ qualifyingTestId: this.$attrs.qualifyingTestId, fullFilePath: this.$attrs.filePath + this.fileName });
    },
    getNumericalFileName() {
      const dateNow = new Date();
      const dateToNumber = `${dateNow.getFullYear()}${dateNow.getMonth() + 1}${dateNow.getUTCDate()}${dateNow.getHours()}${dateNow.getMinutes()}${dateNow.getSeconds()}`;
      return dateToNumber;
    },

  },
};
</script>
