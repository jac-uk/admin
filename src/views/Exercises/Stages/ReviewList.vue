<template>
  <div>
    <Banner :message="message" />
    <h1>Review</h1>
    <form @submit.prevent="checkForm">
      <button 
        class="govuk-button govuk-!-margin-right-2" 
        :disabled="isButtonDisabled"
      >
        Set status
      </button>
      <!-- <Table :data="applicationRecords" :columns="[{ heading: 'Reference number', value: 'application.referenceNumber' }]" multi-select /> -->
      <table class="govuk-table">
        <thead class="govuk-table__head">
          <tr class="govuk-table__row">
            <th
              scope="col"
              class="govuk-table__header govuk-!-padding-top-0"
            >
              <div class="govuk-checkboxes govuk-checkboxes--small">
                <div class="govuk-checkboxes__item">
                  <input
                    id="selectAll"
                    v-model="selectAll"
                    class="govuk-checkboxes__input"
                    type="checkbox"
                  >
                  <label
                    class="govuk-label govuk-checkboxes__label"
                    for="checkboxes"
                  />
                </div>
              </div>
            </th>
            <th
              scope="col"
              class="govuk-table__header"
            >
              Reference number
            </th>
            <th
              scope="col"
              class="govuk-table__header"
            >
              Name
            </th>
            <th
              scope="col"
              class="govuk-table__header"
            >
              Status
            </th>
          </tr>
        </thead>
        <tbody class="govuk-table__body">
          <tr
            v-for="item in applicationRecords"
            :key="item.id"
            class="govuk-table__row"
          >
            <td class="govuk-table__cell govuk-!-padding-top-0">
              <div class="govuk-checkboxes govuk-checkboxes--small">
                <div class="govuk-checkboxes__item">
                  <input
                    :id="`item-${item.id}`"
                    v-model="selectedItems"
                    :value="item.id"
                    class="govuk-checkboxes__input"
                    type="checkbox"
                  >
                  <label
                    class="govuk-label govuk-checkboxes__label"
                    :for="`item-${item.id}`"
                  />
                </div>
              </div>
            </td>
            <td class="govuk-table__cell">
              {{ item.application.referenceNumber }}
            </td>
            <td class="govuk-table__cell">
              {{ item.candidate.fullName }}
            </td>
            <td class="govuk-table__cell">
              {{ item.status | lookup }}
            </td>
          </tr>
        </tbody>
      </table>      
    </form>
  </div>
</template>

<script>
import Banner from '@/components/Page/Banner';

export default {
  components: {
    Banner,
  },
  data() {
    return {
      message: null,
      selectedItems: [],
    };
  },
  computed: {
    applicationRecords() {
      return this.$store.state.stageReview.records;
    },
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    isButtonDisabled() {
      const isDisabled = this.selectedItems && this.selectedItems.length;
      return !isDisabled;
    },
    selectAll: {
      get: function () {
        return this.applicationRecords ? this.selectedItems.length == this.applicationRecords.length : false;
      },
      set: function (value) {
        var selectedItems = [];
        if (value) {
          this.applicationRecords.forEach((item) => {
            selectedItems.push(item.id);
          });
        }
        this.selectedItems = selectedItems;
      },
    }, 
  },
  async created() {
    this.$store.dispatch('stageReview/bind', { exerciseId: this.exercise.id });
    this.message = await this.$store.dispatch('stageReview/getMessages');
    this.selectedItems = this.$store.state.stageReview.selectedItems;
  },
  methods: {
    checkForm() {
      this.$store.dispatch('stageReview/storeItems', { items: this.selectedItems });
      this.$router.push({ name: 'exercise-stages-review-edit' });
    },
  },
};
</script>
