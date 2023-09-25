import _has from 'lodash/has.js';
const searchMixin = {
  computed: {
    hasSearchMap() {
      return this.searchMap !== null;
    },
    hasVisibleFields() {
      return this.hasSearchMap && _has(this.searchMap, 'tooltip.visible') && this.searchMap.tooltip.visible.length;
    },
  },
};

export default searchMixin;
