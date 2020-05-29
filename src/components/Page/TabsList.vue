<template>
  <div
    class="js-enabled govuk-tabs"
    data-module="govuk-tabs"
  >
    <div>
      <ul
        class="govuk-tabs__list"
      >
        <li 
          v-for="tab in tabs"
          :key="tab.title"
          :class="{'govuk-tabs__list-item--selected': isActive(tab) }"
          class="govuk-tabs__list-item"
        >
          <a
            :href="`#${tab.ref}`"
            class="govuk-tabs__tab"
            @click="showTab(tab)"
          >
            {{ tab.title }}
          </a>
        </li>
      </ul>
    </div>
    <div class="tabs-details">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    tabs: {
      type: Array,
      required: true,
    },
    activeTab: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      currentTab: this.activeTab,
    };
  },

  methods: {
    showTab(selectedTab) {
      this.currentTab = selectedTab.ref;
      this.$emit('update:activeTab', this.currentTab);
    },
    isActive(tab) {
      return this.activeTab === tab.ref;
    },
  },
};
</script>
