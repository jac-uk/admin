<template>
  <div>
    <div class="text-right">
      <router-link
        v-if="isEditable"
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
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters('exerciseDocument', {
      isEditable: 'isEditable',
    }),
    exercise() {
      return this.$store.getters['exerciseDocument/data']();
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
<style type="text/css" rel="stylesheet/scss" lang="scss" scoped>
.govuk-summary-list__value,
.govuk-summary-list__value:last-child,
.govuk-summary-list__key {
  @include govuk-media-query($from: tablet) {
    width: auto;
  }
}
</style>
