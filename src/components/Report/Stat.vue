<template>
  <div>
    <span class="percent">{{ $filters.formatNumber(stat.percent, 2) }}%</span>&nbsp;
    <template v-if="isDeclarationTotal">
      <span
        v-if="reportTotal > 0 && stat.total > 0"
        class="total"
      >({{ reportTotal }} out of {{ stat.total }})</span>
    </template>
    <template v-else>
      <span class="total">({{ stat.total }})</span>
    </template>
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
    isDeclarationTotal: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
