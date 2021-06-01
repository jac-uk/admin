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
          v-slot="{ href, navigate, isActive }"
          :to="page"
          custom
        >
          <a
            class="moj-sub-navigation__link"
            :active="isActive"
            :aria-current="isActive ? 'page' : false"
            :href="href"
            @click="navigate"
          >{{ page.title }}</a>
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
    // current: {
    //   required: true,
    //   type: String,
    // },
  },
};
</script>
