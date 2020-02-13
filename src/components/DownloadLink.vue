<template>
  <a
    class="govuk-link govuk-body-m"
    :class="{'download-visited' : visited }"
    href="javascript:void(0)"
    @click.prevent="download(fileName)"
  >
    {{ linkText }}
  </a>
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
    userId: {
      required: false,
      type: String,
      default: null,
    },
    title: {
      required: false,
      type: String,
      default: '',
    },
  },
  data () {
    return {
      visited: false,
    };
  },
  computed: {
    linkText() {
      return this.title ? this.title : this.fileName;
    },
    savePath() {
      let savePath = '';
      if (this.exerciseId) {
        savePath += `exercise/${this.exerciseId}/`;
      }
      if (this.userId) {
        savePath += `user/${this.userId}/`;
      }
      return savePath;
    },
  },
  methods: {
    download(fileName) {
      this.visited = true;
      const storageRef = firebase.storage().ref();
      const fileNameRef = storageRef.child(this.savePath + fileName);
      fileNameRef.getDownloadURL().then((url) => {
        // open url in another window
        window.open(url);
      }).catch((error) => {

        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
        case 'storage/object-not-found':
          // File doesn't exist
          break;

        case 'storage/unauthorized':
          // User doesn't have permission to access the object
          break;

        case 'storage/canceled':
          // User canceled the upload
          break;

        case 'storage/unknown':
          // Unknown error occurred, inspect the server response
          break;
        }
      });
    },
  },
};
</script>

<style scoped>
.download-visited {
  color: #4c2c92;
}
</style>
