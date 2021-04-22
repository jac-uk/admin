<template>
  <span
    v-if="number > 0"
    class="badge"
  >
    {{ number }}
  </span>
</template>

<script>
export default {
  props: {
    number: {
      type: Number,
      default: 0,
    },
  },
};
</script>

<style scoped>
.badge {
  position: absolute;
  transform: translate(-50%, 100%);
  padding: 0% 0.5%;
  border-radius: 50%;
  background-color: #bc0000;
  color: white;
}
</style>
