<template>
  <div class="moj-search govuk-!-margin-bottom-0">
    <form
      autocomplete="off"
      @submit.prevent=""
    >
      <div class="govuk-form-group">
        <input
          id="search"
          v-model="search"
          class="govuk-input moj-search__input "
          name="search"
          type="search"
          aria-describedby="search-hint"
          :placeholder="placeholder"
          @keyup="startSearch"
        >
      </div>
    </form>
  </div>
</template>

<script>
export default {
  props: {
    placeholder: {
      type: String,
      required: false,
      default: 'Search',
    },
  },
  data() {
    return {
      search: '',
    };
  },
  methods: {
    startSearch() {
      this.$emit('search', this.search);
    },
  },
};
</script>

<style lang="scss" scoped>
  .moj-search {
    margin-bottom: 30px;
  }
</style>
