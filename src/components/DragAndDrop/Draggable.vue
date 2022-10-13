<template>
  <div
    class="draggable"
    draggable="true"
    @dragstart="drag"
  >
    <slot />
  </div>
</template>

<script>
export default {
  name: 'Draggable',
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  methods: {
    drag(ev) {
      ev.dataTransfer.setData('text', JSON.stringify(this.data));
    },
  },
};
</script>

<style>
.draggable {
  cursor: grab;
}
.draggable:hover {
  outline: 1px dotted black;
}
.draggable:hover:before {
  content: ".. .. .. ..";
  display: block;
  position: absolute;
  margin-left: -15px;
  width: 15px;
  line-height: 4px;
}
</style>
