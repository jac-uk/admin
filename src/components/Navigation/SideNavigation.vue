<template>
  <nav
    class="moj-side-navigation govuk-!-padding-top-0"
    aria-label="Side navigation"
  >
    <ul class="moj-side-navigation__list">
      <router-link
        v-for="page in pages"
        :key="page.name"
        v-slot="{ href, navigate, isActive }"
        :to="page"
        custom
      >
        <li
          class="moj-side-navigation__item"
          :class="{'moj-side-navigation__item--active': isActive}"
        >
          <a
            class="moj-side-navigation__link"
            :active="isActive"
            :aria-current="isActive ? 'location' : false"
            :href="href"
            @click="navigate"
          >{{ page.title }}</a>
        </li>
      </router-link>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'SideNavigation',
  props: {
    pages: {
      required: true,
      type: Array,
    },
  },
};
</script>
