<template>
  <dl
    class="govuk-summary-list"
  >
    <div
      v-for="role in roles"
      :key="role"
      class="govuk-summary-list__row"
    >
      <dt class="govuk-summary-list__key">
        {{ role | lookup }}
      </dt>
      <dd
        v-if="assignedPanellists[role]"
        class="govuk-summary-list__value"
      >
        {{ assignedPanellists[role].fullName }}<br>
        <a
          :href="`mailto:${assignedPanellists[role].email}`"
          class="govuk-link"
        >{{ assignedPanellists[role].email }}</a><br>
        {{ assignedPanellists[role].phone }}
      </dd>
      <dd
        v-else
        class="govuk-summary-list__value"
      >
        Not selected
      </dd>
    </div>
  </dl>
</template>

<script>
export default {
  name: 'ViewPanellists',
  props: {
    panel: {
      required: true,
      type: Object,
    },
    panellists: {
      required: true,
      type: Array,
    },
    roles: {
      required: true,
      type: Array,
    },
  },
  computed: {
    assignedPanellists() {
      if (this.panel.roles) {
        const map = {};
        for (const [key, value] of Object.entries(this.panel.roles)) {
          const panellist = this.panellists.find(panellist => panellist.id === value);
          map[key] = panellist;
        }
        return map;
      } else {
        return {};
      }
    },
  },
};
</script>

<style scoped>
.govuk-summary-list__key {
  vertical-align: top;
}
</style>
