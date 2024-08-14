<template>
  <div>
    <h1>Predictive Search Component Sandbox</h1>
    <PredictiveSearch
      id="application"
      v-model="formData.application"
      label="Find an application"
      hint="Type any part of reference number or candidate name"
      :data="applications"
      :search-fields="['name', 'referenceNumber']"
      @update:modelValue="handleSelection"
    />
    <div v-if="formData.application">
      <h2>Selected Application:</h2>
      <pre>{{ formData.application }}</pre>
    </div>
  </div>
</template>

<script>
import PredictiveSearch from './PredictiveSearch.vue';

export default {
  components: {
    PredictiveSearch,
  },
  data() {
    return {
      formData: {
        application: null,
      },
      applications: [
        { id: '001', name: 'Tom Johnson', referenceNumber: 'ABC1234' },
        { id: '002', name: 'Alice Brown', referenceNumber: 'DEF5678' },
        { id: '003', name: 'Tommy Lee', referenceNumber: 'GHI9101' },
        { id: '004', name: 'Emma Watson', referenceNumber: 'JKL1121' },
        { id: '005', name: 'Tom Riddle', referenceNumber: 'MNO3141' },
        { id: '006', name: 'Michael Scott', referenceNumber: 'PQR5161' },
        { id: '007', name: 'Tom Hanks', referenceNumber: 'STU7181' },
        { id: '008', name: 'Sarah Connor', referenceNumber: 'VWX9202' },
        { id: '009', name: 'Tom Ford', referenceNumber: 'YZA1232' },
        { id: '010', name: 'Lucy Hale', referenceNumber: 'BCD2343' },
        { id: '011', name: 'Tom Hardy', referenceNumber: 'EFG3454' },
        { id: '012', name: 'David Beckham', referenceNumber: 'HIJ4565' },
        { id: '013', name: 'Tomas Anderson', referenceNumber: 'KLM5676' },
        { id: '014', name: 'Jessica Alba', referenceNumber: 'NOP6787' },
        { id: '015', name: 'Tom Cruise', referenceNumber: 'QRS7898' },
        { id: '016', name: 'Natalie Portman', referenceNumber: 'TUV8909' },
        { id: '017', name: 'Tom Segura', referenceNumber: 'WXY9010' },
        { id: '018', name: 'Rachel Green', referenceNumber: 'ZAB0121' },
        { id: '019', name: 'Tom Green', referenceNumber: 'CDE1233' },
        { id: '020', name: 'Megan Fox', referenceNumber: 'FGH2344' },
        { id: '123', name: 'John Smith', referenceNumber: 'ABC0001' },
        { id: '456', name: 'Prunela Underlay', referenceNumber: 'ABC0005' },
        { id: '789', name: 'Emma Doe', referenceNumber: 'XYZ1234' },
        { id: '101', name: 'Michael Scott', referenceNumber: 'LMN5678' },
      ],
    };
  },
  methods: {
    handleSelection(selectedItem) {
      this.formData.application = selectedItem;
    },
  },
};
</script>

<style scoped>
</style>
