<template>
  <div>
    <label class="screenshot-label govuk-heading-m govuk-!-margin-bottom-2">Capture Screenshot</label>

    <a
      class="screenshot-link"
      title="Capture Screenshot"
      alt="Capture Screenshot"
      @click="captureScreenshot"
    ><img
      src="@/assets/screenshot.svg"
      style="width: 30px"
    ></a>
    <div>
      <img
        v-if="thumbnail"
        :src="thumbnail"
        :style="thumbnailStyle"
        class="dashed-border"
        alt="Screenshot Thumbnail"
      >
    </div>
  </div>
</template>

<script>
import html2canvas from 'html2canvas';
export default {
  name: 'CaptureScreenshot',
  data() {
    return {
      thumbnail: null,
      thumbnailStyle: {
        height: '100px',
        width: 'auto', // Maintain aspect ratio
      },
    };
  },
  computed: {
    screenshotUploadPath() {
      //return `/exercise/${this.exercise.id}/user/${this.application.userId}`;
      return 'test';
    },
  },
  methods: {
    async captureScreenshot() {
      //const elementToCapture = this.$el.querySelector('div:first-child');
      const elementToCapture = document.body;

      try {
        const canvas = await html2canvas(elementToCapture);
        const thumbnail = canvas.toDataURL('image/png');
        this.thumbnail = thumbnail;

        //const fileName = this.generateFileName(file.name);
        //const uploadRef = firebase.storage().ref(`${this.path}/${fileName}`);
        // try {
        //   const fileUploaded = await uploadRef.put(file);
        //   if (fileUploaded && fileUploaded.state === 'success') {
        //     this.isReplacing = false;
        //     this.fileName = fileName;

        //     return true;
        //   } else {
        //     this.setError('File upload failed, please try again [2]');

        //     return false;
        //   }
        // } catch (e) {
        //   this.setError('File upload failed, please try again [3]');

        //   return false;
        // } finally {
        //   this.resetFile();
        // }

        // console.log(`height: ${canvas.height}`);
        // console.log(`width: ${canvas.width}`);

      } catch (error) {
        console.error('Error capturing screenshot:', error);
      }
    },
  },
};
</script>
<style type="text/css" rel="stylesheet/scss" lang="scss" scoped>
.dashed-border {
  border: 3px solid black;
  border-style: dashed;
}
.screenshot-link {
  cursor: pointer;
  vertical-align: middle;
}
.screenshot-label {
  display: inline-block;
  margin-right: 30px;
}
</style>
