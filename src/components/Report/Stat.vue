<template>
  <div>
    <span class="percent">{{ $filters.formatNumber(stat.percent, 2) }}%</span> <span class="total">({{ stat.total }})</span>
  </div>
</template>

<script>
export default {
  props: {
    stat: {
      required: true,
      type: Object,
    },
  },
};
</script>
