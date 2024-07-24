<template>
  <nav
    class="sub-navigation moj-sub-navigation govuk-!-margin-bottom-4"
    aria-label="Sub navigation"
  >
    <ul class="moj-sub-navigation__list">
      <li
        v-for="(tab, index) in tabs"
        :key="tab.title"
        class="moj-sub-navigation__item"
        @click.stop="onTabClick(tab, index)"
      >
        <router-link
          v-slot="{ href, navigate }"
          :to="tab.link"
          custom
        >
          <a
            class="moj-sub-navigation__link govuk-!-display-inline-block"
            :class="{ 'govuk-!-display-inline-block': ('content' in tab) }"
            :active="isActiveRoute(tab.link.name) ? 'true' : 'false'"
            :aria-current="isActiveRoute(tab.link.name) ? 'page' : 'false'"
            :href="href"
            @click="navigate"
          >
            <span
              v-if="'content' in tab"
              class="icon-expand"
              :class="arrowOpenIndex === index ? 'open' : 'close'"
            >
              <svg
                width="12"
                height="8"
                viewBox="0 0 12 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.41 7.70508L6 3.12508L10.59 7.70508L12 6.29508L6 0.295078L0 6.29508L1.41 7.70508Z"
                  fill="#1D70B8"
                />
              </svg>
            </span>
            {{ tab.title }}
          </a>
        </router-link>
      </li>
    </ul>
    <FullWidthMenu
      v-show="selectedTabIndex && showSubmenu"
      :max-items-per-column="3"
      :full-width-menu="true"
      :items="submenu"
      aria-label="Sub navigation"
    >
      <template #item="{ item, navigate }">
        <a
          class="flex-item"
          @click.stop="navigate(item)"
        >
          {{ item.title }}
        </a>
      </template>
    </FullWidthMenu>
  </nav>
</template>

<script>
import FullWidthMenu from './FullWidthMenu.vue';
export default {
  name: 'TabMenu',
  components: {
    FullWidthMenu,
  },
  props: {
    tabs: {
      required: true,
      type: Array,
    },
  },
  data() {
    return {
      submenu: [],
      selectedTabIndex: null,
      showSubmenu: false,
      arrowOpenIndex: null,
    };
  },
  mounted() {
    this.submenu = [];
    this.selectedTabIndex = null;
    this.arrowOpenIndex = null;
    this.showSubmenu = false;
    document.body.addEventListener('click', this.handleOutsideClick);
  },
  beforeUnmount() {
    document.body.removeEventListener('click', this.handleOutsideClick);
  },
  methods: {
    isActiveRoute(routeName) {
      // Check if the current route matches the route name
      if (routeName && this.$route.name === routeName) {
        return true;
      }
      // Check if the current route has a parent route that matches the route name
      const currentParentItem = this.findParentTab(this.tabs, this.$route.name);
      if (currentParentItem && currentParentItem === routeName) {
        return true;
      }
      return false;
    },
    onTabClick(tab, index) {
      // Set submenu content
      if ('content' in tab) {
        this.submenu = tab.content;
      }
      else {
        this.submenu = [];
      }
      // Selecting the same item again
      if (this.arrowOpenIndex === index) {
        // Deselect the tab and hide the menu
        this.selectTabIndex(null);
        this.arrowOpenIndex = null;
        this.showSubmenu = false;
      }
      else {  // Selecting a new item
        this.selectTabIndex(index);
        this.arrowOpenIndex = index;
      }
      if (this.submenu.length > 0) {
        this.showSubmenu = true;
      }
    },
    selectTabIndex(index) {
      this.selectedTabIndex = index;
    },
    handleOutsideClick(event) {
      const clickedOutside =
        !this.$el.contains(event.target) &&
        !event.target.closest('.tab-content');

      if (clickedOutside) {
        this.showSubmenu = false;
        this.selectTabIndex(null);
        this.arrowOpenIndex = null;
        this.submenu = [];
      }
    },
    findParentTab(items, subMenuItemName) {
      for (const item of items) {
        if ('content' in item) {
          const subItem = item.content.find(o => o.link.name === subMenuItemName);
          if (subItem) {
            return item.link.name;
          }
        }
      }
      return null;
    },
  },
};
</script>
<style scoped>
.icon-expand {
  display: inline-block;
  transition: transform 0.5s;
  margin: 0 5px 0 0;
}
.icon-expand.open {
  transform: rotate(0deg);
}
.icon-expand.close {
  transform: rotate(180deg);
}

.flex-item {
  color: #1d70b8;
  text-align: left;
  font-size: 1rem;
  line-height: 1.25;
  font-weight: 700;
  cursor: pointer;
}
.flex-column .flex-item:not(:last-child) {
  margin-bottom: 10px;
}
.flex-item:hover {
  text-decoration: underline;
}
</style>
