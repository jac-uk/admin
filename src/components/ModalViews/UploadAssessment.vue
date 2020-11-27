<template>
  <div>
    <div class="modal__title govuk-!-padding-2 govuk-heading-m">
      Upload Assessment
    </div>
    <div class="modal__content govuk-!-padding-4">
      <p class="modal__message govuk-body-l">
        <FileUpload
          id="independent-assessment-file"
          ref="independent-assessment-file"
          v-model="fileName"
          :name="$attrs.id"
          :path="buildFileFolder"
          :file-path="$attrs.filePath"
          label="Upload Independent Assessment file"
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
  </div>
</template>

<script>
import FileUpload from '@/components/Form/FileUpload';

export default {
  name: 'UploadAssessment',
  components: {
    FileUpload,
  },
  data() {
    return {
      fileName: this.$attrs.fileRef,
      uuid: this.$attrs.uuid,
    };
  },
  computed: {
    userId() {
      const assessorId = this.$attrs.assessor.id;
      return assessorId ? assessorId : this.$attrs.uuid;
    },
    buildFileFolder() {
      return `/exercise/${this.$attrs.exercise.id}/application/${this.$attrs.application.id}/jac/`;
    },
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },          
    confirmModal() {
      this.modalOpen = false;
      this.$emit('confirmed');
      document.body.style.overflow = '';
    },  
    changeFileName(val) {
      this.fileName = val;
      this.save();
    },  
    async save() {
      const assessment = {
        id: this.$attrs.id,
        status: 'completed',
        fileRef: this.fileName,
        filePath: this.buildFileFolder + this.fileName,
        approved: true,
      };
      await this.$store.dispatch('assessment/save', assessment);
      this.closeModal();
    },     
  },
};
</script>
