<template>
  <nav
    class="moj-side-navigation govuk-!-padding-top-0"
    aria-label="Side navigation"
  >
    <ul class="moj-side-navigation__list">
      <li
        v-for="page in pages"
        :key="page.name"
        class="moj-side-navigation__item"
        :class="current == page.name ? 'moj-side-navigation__item--active' : ''"
      >
        <router-link
          :aria-current="current == page.name ? 'location' : false"
          :to="page"
        >
          {{ page.title }}
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  props: {
    pages: {
      required: true,
      type: Array,
    },
    current: {
      required: true,
      type: String,
    },
  },
};
</script>
