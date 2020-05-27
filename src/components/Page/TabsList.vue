<template>
  <div>
    <div>
      <ul
        role="tablist"
      >
        <li 
          v-for="tab in tabs"
          :key="tab.title"
        >
          <a
            :href="`#${tab.ref}`"
            @click="showTab(tab)"
          >
            {{ tab.title }} {{ isActive(tab) }}
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

  methods: {
    showTab(selectedTab) {
      console.log(selectedTab);
      this.activeTab = selectedTab.ref;
      this.$emit('update:activeTab', this.activeTab);
    },
    isActive(tab) {
      return this.activeTab === tab.ref;
    },
  },
};
</script>
