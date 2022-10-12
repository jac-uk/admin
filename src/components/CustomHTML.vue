<template>
  <div
    v-dompurify-html="value"
    class="custom-html"
  />
</template>

<script>
export default {
  name: 'CustomHTML',
  props: {
    value: {
      type: String,
      default: '',
    },
  },
};
</script>

<style>
/* customize nested ordered list (1.1, 1.2) */
.custom-html ol {
  counter-reset: item;
}
.custom-html ol li {
  display: block;
}
.custom-html ol li::before {
  counter-increment: item;
  content: counters(item, '.') '. ';
}
</style>
