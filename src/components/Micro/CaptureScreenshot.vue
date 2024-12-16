<template>
  <div>
    <a
      class="screenshot-link govuk-!-margin-bottom-2"
      title="Capture Screenshot"
      alt="Capture Screenshot"
      @click="captureScreenshot"
    >
      <label class="screenshot-label govuk-heading-m">
        Capture Screenshot
      </label>
      <img
        src="@/assets/screenshot.png"
        style="width: 25px"
      >
    </a>
    <div
      v-if="thumbnail"
      ref="thumbnailContainer"
    >
      <img
        v-if="thumbnail"
        :src="thumbnail"
        :style="thumbnailStyle"
        class="dashed-border"
        alt="Screenshot Thumbnail"
      >
      <a
        class="govuk-link"
        @click="removeScreenshot()"
      ><img src="@/assets/remove.png"></a>
    </div>
  </div>
</template>

<script>
import { ref, getDownloadURL, uploadBytes } from '@firebase/storage';
import { storage } from '@/firebase';
import html2canvas from 'html2canvas';
import FormField from '@jac-uk/jac-kit/draftComponents/Form/FormField.vue';
export default {
  name: 'CaptureScreenshot',
  extends: FormField,
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
    bugReportId() {
      return this.$store.state.bugReport.record ? this.$store.state.bugReport.record.id : null;
    },
    filePath() {
      return this.bugReportId ? `/bugReport/${this.bugReportId}/screenshot.png` : '';
    },
  },
  methods: {
    async captureScreenshot() {
      const elementToCapture = document.body;
      try {
        const canvas = await html2canvas(elementToCapture);
        canvas.getContext('2d', {
          willReadFrequently: true, // => faster multiple readback operations
        });
        this.thumbnail = canvas.toDataURL('image/png');
      } catch (error) {
        console.error('Error capturing screenshot:', error);
      }
    },
    dataURLtoBlob(dataurl) {
      const arr = dataurl.split(',');
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--){
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], { type: mime });
    },
    async uploadScreenshot() {
      // Get the file path
      const uploadRef = ref(storage, `${this.filePath}`);
      try {
        // Convert the base64 image to a blob
        const blob = this.dataURLtoBlob(this.thumbnail);

        // Upload the blob to file storage
        await uploadBytes(uploadRef, blob);
        const downloadUrl = await getDownloadURL(uploadRef);
        return {
          downloadUrl: downloadUrl,
          filePath: this.filePath,
        };
      } catch (e) {
        this.setError('File upload failed, please try again. If the problem persist please remove the screenshot and report the problem.');
        return false;
      }
    },
    removeScreenshot() {
      this.thumbnail = null;
    },
  },
  expose: ['uploadScreenshot'],
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
  cursor: pointer;
  display: inline-block;
  margin-right: 30px;
}
.govuk-link {
  cursor: pointer;
  margin-left: 10px;
  position: absolute;
}
</style>
