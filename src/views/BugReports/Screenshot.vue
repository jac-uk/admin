<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { storage } from '@/firebase';
import { ref as firebaseRef, getDownloadURL } from '@firebase/storage';

const route = useRoute();
const bugReportId = ref(route.params.id);
const fileUrl = ref(null);

const filePath = computed(() => {
  return bugReportId.value ? `/bugReport/${bugReportId.value}/screenshot.png` : '';
});

onMounted(async () => {
  const storageRef = firebaseRef(storage, filePath.value);
  fileUrl.value = await getDownloadURL(storageRef);
});

</script>

<template>
  <div class="govuk-grid-row">
    <div class="govuk-grid-column-two-thirds">
      <h1 class="govuk-heading-xl">
        Bug Report - Screenshot
      </h1>
      <div>
        <img
          v-if="fileUrl"
          :src="fileUrl"
          style="width: 100%"
          alt="Screenshot"
        >
      </div>
    </div>
  </div>
</template>
