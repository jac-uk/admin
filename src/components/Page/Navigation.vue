<template>
  <nav :aria-label="label">
    <ul class="dwp-vertical-navigation">
      <li 
        v-for="navItem in items"
        :key="navItem.name"
      >
        <router-link 
          class="nav-link"
          :to="{name: navItem.name}"
          :aria-current="isActive(navItem.name) ? 'page' : false"
        >
          {{ navItem.page }} 
        </router-link>
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
  methods: {
    isActive(name) {
      return name === this.$route.name;
    },
  },
};
</script>

<style scoped>
  .dwp-vertical-navigation {
    margin: 0;
    padding: 0;

  }

  .dwp-vertical-navigation li {
    list-style: none;
    margin: 0;
    padding: 0;
    font-size: 1em;
  }

  .dwp-vertical-navigation a[aria-current="page"] {
    color: #1d70b8;
    font-weight: bold;
    text-decoration: none;
    border-left: 4px solid #1d70b8;
    background-color: #f3f2f1;
  }

  .dwp-vertical-navigation li a {
    padding: 0.625em;
    display: block;
  }
</style>
