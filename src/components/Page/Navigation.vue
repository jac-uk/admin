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
    
  },
};
</script>