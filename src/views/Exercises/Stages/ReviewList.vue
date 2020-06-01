<template>
  <div>
    <Banner :message="message" />
    <h1>Review</h1>
    <form @submit.prevent="validateAndSave">
      <button class="govuk-button govuk-!-margin-right-2">
        Set status
      </button>
      <table>
        <tr 
          v-for="item in applicationRecords" 
          :key="item.application.id"
        >
          <td>
            <CheckboxGroup
              id="selectedItems"
              v-model="selectedItems"
              label=""
              hint=""
              value=""
            >
              <CheckboxItem
                :value="selectedItemStatus"
                label=""
              />
            </CheckboxGroup>
          </td>
          <td>
            <RouterLink
              :to="{ name: 'exercise-stages-review-edit', params: { applicationId: item.application.id } }"
            >
              {{ item.candidate.fullName }}, {{ item.status }}
            </RouterLink>
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
      selectedItemStatus: null,
    };
  },
  computed: {
    applicationRecords() {
      return this.$store.state.stageReview.records;
    },
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
  },
  async created() {
    this.$store.dispatch('stageReview/bind', { exerciseId: this.exercise.id });
    this.message = await this.$store.dispatch('stageReview/getMessages');
  },
};
</script>
