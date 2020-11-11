<template>
  <a
    v-if="fileName && linkHref"
    class="govuk-link govuk-body-m"
    :class="{'download-visited' : visited, 'govuk-button govuk-button--secondary': type === 'button' }"
    :download="fileName"
    :href="linkHref"
  >
    {{ linkText }}
  </a>
  <span
    v-else
    class="govuk-body"
  >
    File not available
  </span>
</template>

<script>
import firebase from '@firebase/app';
import '@firebase/storage';

export default {
  props: {
    fileName: {
      required: true,
      type: String,
      default: '',
    },
    exerciseId: {
      required: true,
      type: String,
      default: '',
    },
    applicationId: {
      required: false,
      type: String,
      default: '',
    },
    userId: {
      required: false,
      type: String,
      default: null,
    },
    assessorId: {
      required: false,
      type: String,
      default: '',
    },
    title: {
      required: false,
      type: String,
      default: '',
    },
    type: {
      required: false,
      type: String,
      default: 'link',
    },
  },
  data () {
    return {
      visited: false,
      linkHref: '',
    };
  },
  computed: {
    linkText() {
      return this.title ? this.title : this.fileName;
    },
    savePath() {
      let savePath = `exercise/${this.exerciseId}/`;
      if (this.applicationId) {
        savePath += `application/${this.applicationId}/`;
      }
      if (this.userId) {
        savePath += `user/${this.userId}/`;
      }
      if (this.assessorId) {
        savePath += `assessor/${this.assessorId}/`;
      }

      return savePath;
    },
  },
  async mounted() {
    const downloadUrl = await this.getDownloadURL();

    if (downloadUrl) {
      this.linkHref = downloadUrl;
    }
  },
  methods: {
    async getDownloadURL() {
      const fileRef = firebase.storage().ref(this.savePath + this.fileName);

      console.log('getDownloadURL: ', fileRef);

      try {
        const downloadUrl = await fileRef.getDownloadURL();

        if (typeof downloadUrl === 'string' && downloadUrl.length) {
          return downloadUrl;
        }
        return false;
      } catch (e) {
        return false;
      }
    },
  },
};
</script>

<style scoped>
.download-visited {
  color: #4c2c92;
}
</style>
