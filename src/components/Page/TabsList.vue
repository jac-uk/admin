<template>
  <div>
    <div>
      <ul
        role="tablist"
      >
        <li 
          v-for="tab in tabs"
          :key="tab.name"
        >
          <a
            :href="tab.href"
            @click="showTab(tab)"
          >
            {{ tab.name }}
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
    isActive: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    showTab(selectedTab) {
      console.log(selectedTab);
    },
  },
};
</script>
