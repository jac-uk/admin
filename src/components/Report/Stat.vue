<template>
  <div>
    <span class="percent">{{ stat.percent | formatNumber(2) }}%</span>&nbsp;
    <span
      v-if="reportTotal"
      class="total"
    >({{ reportTotal }} out of {{ stat.total }})</span>
    <span
      v-else
      class="total"
    >({{ stat.total }})</span>
  </div>
</template>

<script>
export default {
  props: {
    stat: {
      required: true,
      type: Object,
    },
    reportTotal: {  // Pass this in for the 'declaration total' field
      type: Number,
      default: 0,
    },
  },
};
</script>
