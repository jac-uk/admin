<template>
  <div class="flex-container">
    <div
      v-for="(column, columnIndex) in columns"
      :key="columnIndex"
      class="flex-column"
    >
      <slot
        v-for="(item, itemIndex) in column"
        :key="itemIndex"
        name="item"
        :item="item"
        :navigate="navigate"
      >
        <div class="flex-item">
          {{ item.title }}
        </div>
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FullWidthMenu',
  props: {
    items: {
      type: Array,
      required: true,
    },
    maxItemsPerColumn: {
      type: Number,
      required: true,
    },
  },
  emits: ['close'],
  computed: {
    columns() {
      const columns = [];
      const numberOfColumns = Math.ceil(this.items.length / this.maxItemsPerColumn);

      for (let i = 0; i < numberOfColumns; i++) {
        const column = this.items.slice(i * this.maxItemsPerColumn, (i + 1) * this.maxItemsPerColumn);
        columns.push(column);
      }

      return columns;
    },
  },
  methods: {
    navigate(arg) { // Either router object or a function
      if (typeof arg.link === 'function') {
        arg.link();
      }
      else {
        this.$router.push(arg.link);
      }
      this.$emit('close', arg);
    },
  },
};
</script>

<style scoped>
.flex-container {
  display: flex;
  flex-wrap: wrap;
  background-color: #f3f2f1;
  padding: 1rem;
  border-top: 1px solid #b1b4b6
  /*margin-top: 1rem;*/
}
.flex-column {
  display: flex;
  flex-direction: column;
  margin-right: 40px;
}
.flex-item {
  color: #753880;
  text-align: left;
  font-size: 1rem;
  line-height: 1.25;
  font-weight: 700;
}
.flex-column .flex-item:not(:last-child) {
  margin-bottom: 10px !important;
}
</style>
