<template>
  <div class="panels-packs">
    <Router-view
      :key="type"
      :type="type"
    />
  </div>
</template>

<script>
export default {
  props: {
    type: {
      required: true,
      type: String,
    },
  },
  computed: {
    title() {
      return this.$options.filters.lookup(this.type);
    },
  },
  created() {
    document.title = `${this.title} | ${this.$route.meta.title}`;
  },
  updated() {
    document.title = `${this.title} | ${this.$route.meta.title}`;
  },
};
</script>
