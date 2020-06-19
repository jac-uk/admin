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
          :class="{'moj-side-navigation__item--active': isActive(page)}"
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
  data() {
    return {
      currentPage: '',
    };
  },
  methods: {
    isActive(page){     
      // if an application 
      if(page.params){ 
        // check the last word in the route path matches the page title (to lowercase)
        return this.$route.path.split('/')[this.$route.path.split('/').length-1] == page.title.toLowerCase();
      } 
      // if the route is an edit or list page        
      else if (this.$route.name.split('-').some(i=>['edit','list'].indexOf(i) !== -1)) { 
        // check the names match
        return page.name.split('-')[2] == this.$route.name.split('-')[2]; 
      } 
      else {
        return this.$route.name == page.name;
      }
    },
  },

};
</script>
