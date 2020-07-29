<template>
  <div
    class="govuk-form-group"
    :class="{'govuk-form-group--error': hasError}"
  >
    <label
      :for="id"
      class="govuk-heading-m govuk-!-margin-bottom-2"
    >
      {{ label }}
    </label>
    <span
      v-if="hint"
      class="govuk-hint"
    >
      {{ hint }}
    </span>
    <FormFieldError
      :id="id"
      :error-message="errorMessage"
    />
    <p
      v-if="haveFile && !isReplacing && !file"
      class="govuk-body-m"
    >
      Your file has been received.
      <a
        href="javascript:void(0)"
        class="govuk-link"
        @click.prevent="replaceFile"
      >Replace</a>
    </p>
    <p v-else-if="isUploading">
      Uploading...
    </p>
    <input
      v-else
      :id="id"
      ref="file"
      type="file"
      class="govuk-file-upload"
      :class="{'govuk-input--error': hasError}"
      @change="fileSelected"
    >
  </div>
</template>

<script>
import firebase from '@firebase/app';
import '@firebase/storage';
import FormField from '@/components/Form/FormField';
import FormFieldError from '@/components/Form/FormFieldError';

export default {
  components: {
    FormFieldError,
  },
  extends: FormField,
  props: {
    path: {
      type: String,
      required: true,
      default: '',
    },
    value: {
      default: '',
      type: String,
    },
    name: {
      type: String,
      required: true,
      default: '',
    },
    messages: {
      type: Object,
      default: () => {
        return {
          required: 'Please choose a file to upload',
        };
      },
    },
  },
  data() {
    return {
      file: '',
      isReplacing: false,
      isUploading: false,
    };
  },
  computed: {
    haveFile() {
      return this.value ? true : false;
    },
    fileName: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      },
    },
  },
  async mounted () {
    if (typeof this.fileName === 'string' && this.fileName.length) {
      const isUploaded = await this.verifyFile(this.fileName);

      if (!isUploaded) {
        this.fileName = '';
        this.resetFile();
      }
    }
  },
  methods: {
    replaceFile() {
      this.isReplacing = true;
    },
    fileSelected() {
      const file = this.$refs.file.files[0];
      this.setError('');
      return this.upload(file);
    },
    generateFileName(originalName) {
      const parts = originalName.split('.');
      if ( parts.length === 1 || ( parts[0] === '' && parts.length === 2 )) {
        return this.name;
      }

      return [this.name, parts.pop()].join('.');
    },
    resetFile() {
      this.$refs.file = null;
      this.isUploading = false;
    },
    async upload(file) {
      // @todo return more useful error messages

      if (!file) {
        this.setError('File upload failed, please try again');
        return false;
      }

      this.isUploading = true;
      const fileName = this.generateFileName(file.name);
      const uploadRef = firebase.storage().ref(`${this.path}/${fileName}`);

      try {
        const fileUploaded = await uploadRef.put(file);
        if (fileUploaded && fileUploaded.state === 'success') {
          this.isReplacing = false;
          this.fileName = fileName;

          return true;
        } else {
          this.setError('File upload failed, please try again');

          return false;
        }
      } catch (e) {
        this.setError('File upload failed, please try again');

        return false;
      } finally {
        this.resetFile();
      }
    },
    async verifyFile(fileName) {
      if (!fileName) {
        return false;
      }
      const fileRef = firebase.storage().ref(`${this.path}/${fileName}`);

      // Check if file exists in storage
      try {
        const downloadUrl = await fileRef.getDownloadURL();

        if (typeof downloadUrl === 'string' && downloadUrl.length) {
          return true;
        }
        return false;
      } catch (e) {
        return false;
      }
    },
  },
};
</script>
