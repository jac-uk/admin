<template>
  <nav
    class="moj-side-navigation govuk-!-padding-top-0"
    :aria-label="label"
  >
    <ul class="moj-side-navigation__list">
      <li 
        v-for="(page, index) in pageItems"
        :key="index"
        class="moj-side-navigation__item"
        :class="{open: page.open, on: page.on}"
      >
        <h4 class="moj-side-navigation__title">
          {{ page.page }}
        </h4>
        <ul
          v-if="page.children"
          class="moj-side-navigation__list"
        >
          <li
            v-for="(child, childIndex) in page.children"
            :key="childIndex"
            class="moj-side-navigation__item"
            :class="{'moj-side-navigation__item--active': child.on}"
          >
            <router-link 
              class="moj-side-navigation__item"
              :to="{name: child.name, params: child.params}"
              :aria-current="child.on ? 'page' : false"
            >
              {{ child.page }}
            </router-link>
          </li>
        </ul>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  props: {
    items: {
      required: true,
      type: Array,
    },
    label: {
      required: false,
      default: 'navigation',
      type: String,
    },
  },
  computed: {
    pageItems() {
      const pages = [];
      for (let i = 0, len = this.items.length; i < len; ++i) {
        const page = {
          page: this.items[i].page,
          name: this.items[i].name,
          params: this.items[i].params,
        };
        if (this.items[i].children) {
          page.children = [];
          for (let j = 0, lenJ = this.items[i].children.length; j < lenJ; ++j) {
            const child = this.items[i].children[j];            
            child.on = (child.name === this.$route.name || this.$route.name.includes(child.page.toLowerCase())); //@NOTE@ hacky way of highlighting subpages
            if (child.on) {
              page.open = true;
            }
            page.children.push(child);
          }
        }
        page.open = page.on = (page.name === this.$route.name);
        pages.push(page);
      }
      return pages;
    },
  },
};
</script>