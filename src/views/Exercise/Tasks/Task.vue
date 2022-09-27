<template>
  <div>
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
};
</script>
