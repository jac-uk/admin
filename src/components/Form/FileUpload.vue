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
  methods: {
    replaceFile() {
      this.isReplacing = true;
    },
    fileSelected() {
      this.file = this.$refs.file.files[0];
      this.fileName = `${this.name}.${this.file.name.split('.')[1]}`;
      this.setError('');
    },
    resetFile() {
      this.file = '';
      this.isUploading = false;
    },
    async upload() {
      if (this.file) {
        this.isUploading = true;
        const uploadRef = firebase.storage().ref(`${this.path}/${this.fileName}`);
        try {
          await uploadRef.put(this.file);
          this.isReplacing = false;
          this.resetFile();
          return true;
        } catch (e) {
          // @todo return more useful error message
          this.resetFile();
          this.setError('File upload failed, please try again');
          return false;
        }
      }
      return true;
    },
  },
};
</script>
