<template>
  <div class="moj-search">
    <form
      autocomplete="off"
    >
      <div class="govuk-form-group">
        <input
          id="search"
          v-model="search"
          class="govuk-input moj-search__input "
          name="search"
          type="search"
          aria-describedby="search-hint"
          placeholder="Search candidate names - enter first few letters of candidate name (case sensitive)"
          @keyup="startSearch"
        >
      </div>
    </form>
  </div>
</template>

<script>
export default {
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
