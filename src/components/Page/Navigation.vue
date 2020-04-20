<template>
  <nav :aria-label="label">
    <ul class="dwp-vertical-navigation">
      <li 
        v-for="(page, index) in pageItems"
        :key="index"
        :class="{open: page.open, on: page.on}"
      >
        <router-link 
          class="nav-link"
          :to="{name: page.name, params: page.params}"
          :aria-current="page.on ? 'page' : false"
        >
          {{ page.page }}
        </router-link>
        <ul v-if="page.children">
          <li
            v-for="(child, childIndex) in page.children"
            :key="childIndex"
            :class="{on: child.on}"
          >
            <router-link 
              class="nav-link"
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
        page.open = page.on = page.name === this.$route.name;
        if (this.items[i].children) {
          page.children = [];
          for (let j = 0, lenJ = this.items[i].children.length; j < lenJ; ++j) {
            const child = this.items[i].children[j];
            child.on = child.name === this.$route.name;
            if (child.on) {
              page.open = true;
            }
            page.children.push(child);
          }
        }
        pages.push(page);
      }
      return pages;
    },
  },
};
</script>

<style type="text/css" rel="stylesheet/scss" lang="scss" scoped>
  .dwp-vertical-navigation {
    margin: 0;
    padding: 0;
    > li {
      list-style: none;
      margin: 0;
      padding: 0;
      font-size: 1em;
      > a {
        padding: 0.625em;
        display: block;
        text-decoration: none;
      }
      > ul {
        display: none;
        > li {
          list-style: none;
          margin: 0;
          padding: 0;
          font-size: 1em;
          > a {
            padding: 0.625em 0.625em 0.625em 1.25em;
            display: block;
            text-decoration: none;            
          }
        }
      }
      &.on > a {
        color: #1d70b8;
        font-weight: bold;
        background-color: #f3f2f1;
      }      
      &.open {
        border-left: 4px solid #1d70b8;
        > ul {
          display: block;
          padding-inline-start: 0;
          > li {
            &.on {
              background-color: #f3f2f1;
              > a {
                color: #1d70b8;
                font-weight: bold;
                text-decoration: none;
              }
            }
          }
        }
      }      
    }
  }

</style>
