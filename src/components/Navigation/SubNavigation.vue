<template>
  <nav
    class="moj-sub-navigation govuk-!-margin-bottom-4"
    aria-label="Sub navigation"
  >
    <ul class="moj-sub-navigation__list">
      <li
        v-for="page in pages"
        :key="page.name"
        class="moj-sub-navigation__item"
      >
        <router-link
          :aria-current="current == page.name ? 'page' : false"
          class="moj-sub-navigation__link"
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
