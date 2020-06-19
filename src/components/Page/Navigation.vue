<template>
  <nav
    class="moj-side-navigation govuk-!-padding-top-0"
    :aria-label="title || 'side-navigation'"
  >
    <ul class="moj-side-navigation__list">
      <h4
        v-if="title" 
        class="moj-side-navigation__title"
      >
        {{ title }}
      </h4>
      <ul
        v-if="pages"
        class="moj-side-navigation__list"
      >
        <li
          v-for="(page, pageIndex) in pages"
          :key="pageIndex"
          class="moj-side-navigation__item"
          :class="{'moj-side-navigation__item--active': page.on}"
        >
          <router-link 
            class="moj-side-navigation__item"
            :to="{name: page.name, params: page.params}"
            :aria-current="page.on ? 'page' : false"
          >
            {{ page.title }}
          </router-link>
        </li>
      </ul>
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
    title: {
      default: '',
      type: String,
    },
  },
  computed: {
    
  },
};
</script>
