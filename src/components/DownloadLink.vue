<template>
  <a
    class="govuk-link"
    :class="{'download-visited' : visited }"
    href="javascript:void(0)"
    @click.prevent="download(fileName)"
  >
    {{ fileName }}
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
      default: null,
    },
    exerciseId: {
      required: true,
      type: String,
      default: null,
    },
  },
  data () {
    return {
      visited: false,
    };
  },
  methods: {
    download(fileName) {
      this.visited = true;
      // Create a reference to the file we want to download
      const fileSavePath = `exercise-${this.exerciseId}/${fileName}`;

      // Get a reference to the storage service, which is used to create references in your storage bucket
      const storage = firebase.storage();

      // Create a storage reference from our storage service
      const storageRef = storage.ref();

      // Create a reference with an initial file path and name
      const fileNameRef = storageRef.child(fileSavePath);

      // Get the download URL
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
