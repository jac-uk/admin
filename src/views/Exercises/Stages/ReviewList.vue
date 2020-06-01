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
      <table>
        <tr 
          v-for="item in applicationRecords" 
          :key="item.application.id"
        >
          <td>
            <CheckboxGroup
              :id="`item-${item.application.id}`"
              v-model="selectedItems"
              label=""
              hint=""
              value=""
            >
              <CheckboxItem
                :value="item.application.id"
                label=""
              />
            </CheckboxGroup>
          </td>
          <td>
            {{ item.candidate.fullName }}, {{ item.status }}
          </td>
        </tr>
      </table>
    </form>
  </div>
</template>

<script>
import Banner from '@/components/Page/Banner';
import CheckboxGroup from '@/components/Form/CheckboxGroup';
import CheckboxItem from '@/components/Form/CheckboxItem';

export default {
  components: {
    Banner,
    CheckboxGroup,
    CheckboxItem,
  },
  data() {
    return {
      message: null,
      selectedItems: null,
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
  },
  async created() {
    this.$store.dispatch('stageReview/bind', { exerciseId: this.exercise.id });
    this.message = await this.$store.dispatch('stageReview/getMessages');
    this.$store.dispatch('stageReview/storeItems', { items: [] });
  },
  methods: {
    checkForm() {
      this.$store.dispatch('stageReview/storeItems', { items: this.selectedItems });
      this.$router.push({ name: 'exercise-stages-review-edit' });
    },
  },
};
</script>
