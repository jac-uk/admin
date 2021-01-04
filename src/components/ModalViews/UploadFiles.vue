<template>
  <div>
    <div class="modal__title govuk-!-padding-2 govuk-heading-m">
      {{ $attrs.title }}
    </div>
    <div class="modal__content govuk-!-padding-4">
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
          :name="`${$attrs.name}-${getNumericalFileName()}`"
          :path="buildFileFolder"
          :file-path="$attrs.filePath"
          label=""
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
import firebase from '@firebase/app';
import '@firebase/storage';
import FileUpload from '@jac-uk/jac-kit/draftComponents/Form/FileUpload';
import TextField from '@jac-uk/jac-kit/draftComponents/Form/TextField';

export default {
  name: 'UploadFiles',
  components: {
    FileUpload,
    TextField,
  },
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
      this.modalOpen = false;
      this.$emit('confirmed');
      document.body.style.overflow = '';
    },
    changeFileName(val) {
      this.fileName = val;
      this.save('');
    },
    getNumericalFileName() {
      const dateNow = new Date();
      const dateToNumber = `${dateNow.getFullYear()}${dateNow.getMonth() + 1}${dateNow.getUTCDate()}${dateNow.getHours()}${dateNow.getMinutes()}${dateNow.getSeconds()}`;
      return dateToNumber;
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
      const deleteRef = firebase.storage().ref(`${path}/${filename}`);
      deleteRef.delete().then(() => {
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
