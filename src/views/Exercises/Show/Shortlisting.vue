<template>
  <div>
    <div class="text-right">
      <router-link
        v-if="canEdit"
        class="govuk-link"
        :to="{name: 'exercise-edit-shortlisting'}"
      >
        Update shortlisting methods
      </router-link>
    </div>
    <h2 class="govuk-heading-l">
      Shortlisting methods
    </h2>
    <table class="govuk-table">
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Shortlisting methods
        </dt>
        <dd class="govuk-summary-list__value">
          <ul class="govuk-list">
            <li
              v-for="method in methods"
              :key="method"
            >
              {{ method | lookup }}
            </li>
          </ul>
        </dd>
      </div>
    </table>
  </div>
</template>

<script>
export default {
  computed: {
    exercise() {
      return this.$store.getters['exerciseDocument/data']();
    },
    isApproved() {
      if (this.exercise) {
        switch (this.exercise.state) {
        case 'draft':
        case 'ready':
          return false;
        default:
          return true;
        }
      }
      return false;
    },
    canEdit() {
      return !this.isApproved;
    },    
    methods() {
      const methods = this.exercise.shortlistingMethods;
      if (!(methods instanceof Array)) {
        return [];
      }
      const list = methods.filter(value => (value !== 'other'));
      list.sort();

      if (methods.includes('other')) {
        this.exercise.otherShortlistingMethod.forEach((method) => {
          return list.push(method.name);
        });
      }
      
      return list;
    },
  },
};
</script>
<style lang="scss" scoped>
  .govuk-summary-list__value,
  .govuk-summary-list__value:last-child,
  .govuk-summary-list__key {
    @include govuk-media-query($from: tablet) {
      width: auto;
    }
  }
</style>
