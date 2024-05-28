<template>
  <div>
    <div class="modal__title govuk-!-padding-2 govuk-heading-m">
      {{ $attrs.title }}
    </div>
    <div class="modal__content govuk-!-padding-4">
      <div
        v-if="$attrs.id === 'candidateAssessementForms'"
        class="govuk-form-group"
      >
        <p class="modal__message govuk-body-l">
          <a
            href="https://firebasestorage.googleapis.com/v0/b/platform-production-9207d.appspot.com/o/Preparing%20SA%20template%20for%20upload.pdf?alt=media&token=353fad1f-fa08-4d67-a0a7-85323baed3d3"
            target="_blank"
            title="Guidance"
          >
            Preparing SA template for upload
          </a>
        </p>
      </div>
      <p class="modal__message govuk-body-l">
        <TextField
          :id="`${$attrs.name}-file-title`"
          v-model="fileTitle"
          label="Title of file"
        />
        <FileUpload
          v-if="fileTitle"
          :id="$attrs.id"
          v-model="fileName"
          :name="$attrs.name"
          :path="buildFileFolder"
          :file-path="$attrs.filePath"
          label=""
          :types="'.docx'"
          required
          @update:model-value="changeFileName"
        />
      </p>
      <p>
        <button
          class="govuk-button govuk-button--secondary govuk-!-margin-right-3"
          @click="closeModal"
        >
          Cancel
        </button>
        <a
          v-if="$attrs.fileRef"
          href="#"
          class="govuk-body-m govuk-link"
          @click.prevent="save('delete')"
        >Delete</a>
      </p>
    </div>
  </div>
</template>

<script>
import { ref, deleteObject } from '@firebase/storage';
import { storage } from '@/firebase';
import FileUpload from '@jac-uk/jac-kit/draftComponents/Form/FileUpload.vue';
import TextField from '@jac-uk/jac-kit/draftComponents/Form/TextField.vue';

export default {
  name: 'UploadFiles',
  components: {
    FileUpload,
    TextField,
  },
  emits: ['close', 'confirmed'],
  data() {
    return {
      fileName: this.$attrs.fileRef,
      uuid: this.$attrs.uuid,
      fileTitle: this.$attrs.fileTitle || null,
    };
  },
  computed: {
    buildFileFolder() {
      return `/exercise/${this.$attrs.exerciseId}`;
    },
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    confirmModal() {
      this.$emit('confirmed');
    },
    changeFileName(val) {
      this.fileName = val;
      this.save('');
    },
    async save(action) {
      let originalData = this.$attrs.data[this.$attrs.id] || null;
      if (this.$attrs.fileRef) {
        originalData = this.deleteUpload(originalData);
      }
      let extraData = null;
      if (action !== 'delete') {
        extraData = {
          title: this.fileTitle,
          file: this.fileName,
        };
      }
      await this.prepareToSave(originalData, extraData);
    },
    async deleteUpload(obj) {
      const originalDataItem = obj.filter(item => item.file === this.$attrs.fileRef)[0];
      const index = obj.indexOf(originalDataItem);
      if (index > -1) {
        obj.splice(index, 1);
      }
      await this.deleteFile(this.$attrs.filePath, originalDataItem.file);
      return Promise.resolve(obj);
    },
    deleteFile(path, filename) {
      const deleteRef = ref(storage, `${path}/${filename}`);
      deleteObject(deleteRef).then(() => {
        // File deleted successfully
      }).catch((error) => {
        // Uh-oh, an error occurred!
        // eslint-disable-next-line no-console
        console.log('error deleting a file:', error);
      });
    },
    async prepareToSave(origDataPromise, extraObj) {
      if (origDataPromise == null || (origDataPromise && origDataPromise[0] !== undefined)) {
        await this.saveDirectToFirebase(origDataPromise, extraObj);
      } else {
        Promise.resolve(origDataPromise).then(
          async obj => {
            await this.saveDirectToFirebase(obj, extraObj);
          }
        );
      }
    },
    async saveDirectToFirebase(obj, extraObj) {
      const data = {};
      data.downloads = {};
      data.downloads = this.$attrs.data;
      data.downloads[this.$attrs.id] = this.$attrs.data[this.$attrs.id] || [];
      if (obj) {
        data.downloads[this.$attrs.id] = obj;
      }
      if (extraObj) {
        data.downloads[this.$attrs.id].push(extraObj);
      }
      await this.$store.dispatch('exerciseDocument/save', data);
      this.closeModal();
    },
  },
};
</script>
