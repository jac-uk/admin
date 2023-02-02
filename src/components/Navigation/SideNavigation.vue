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
          >
            {{ page.title }}
            <strong
              v-if="page.tag"
              class="govuk-tag govuk-tag-s"
              :class="page.tag.class"
            >{{ page.tag.title }}</strong>
          </a>
        </li>
      </router-link>
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
  },
};
</script>

<style scoped>

.govuk-tag-s {
  font-size: .8rem;
  line-height: .8;
  vertical-align: middle;
}

</style>
