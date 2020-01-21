<template>
  <div>
    <table class="govuk-table">
      <caption class="govuk-table__caption">
        Applications
      </caption>
      <thead class="govuk-table__head">
        <tr class="govuk-table__row">
          <th
            scope="col"
            class="govuk-table__header app-custom-class"
          >
            Application Ref
          </th>
          <th
            scope="col"
            class="govuk-table__header app-custom-class"
          >
            Name
          </th>
          <!--<th
            scope="col"
            class="govuk-table__header app-custom-class"
          >
            Email
          </th> -->
          <th
            scope="col"
            class="govuk-table__header app-custom-class"
          >
            Status
          </th>
          <!-- <th
            scope="col"
            class="govuk-table__header app-custom-class"
          >
            Notes
          </th> -->
        </tr>
      </thead>
      <tbody class="govuk-table__body">
        <tr
          v-for="application in applications"
          :key="application.id"
          class="govuk-table__row"
        >
          <th
            scope="row"
            class="govuk-table__header"
          >
            <router-link
              class="govuk-link"
              :to="{name: 'exercise-show-application', params: { applicationId: application.id }}"
            >
              {{ application.referenceNumber }}
            </router-link>          
          </th>
          <td class="govuk-table__cell">
            <span v-if="application.personalDetails">{{ application.personalDetails.fullName }}</span>
          </td>
          <!--<td class="govuk-table__cell">
            {{ application.email }}
          </td> -->
          <td class="govuk-table__cell">
            {{ application.status }}
          </td>
          <!-- <td class="govuk-table__cell">
            {{ application.notes }}
          </td> -->
        </tr>
      </tbody>
    </table>

    <!-- <router-link
      class="govuk-button"
      :to="{name: 'exercise-applications-full'}"
    >
      See further information
    </router-link> -->
  </div>
</template>

<script>
export default {
  computed: {
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    applications() {
      return this.$store.state.applications.records;
    },
  },
  created() {
    this.$store.dispatch('applications/bind', this.exercise.id);
  },
  destroyed() {
    this.$store.dispatch('applications/unbind');
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
