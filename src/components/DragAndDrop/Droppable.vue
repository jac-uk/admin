<template>
  <div
    class="droppable"
    :class="{'active': active}"
    @drop="drop"
    @dragover="dragOver"
    @dragleave="dragLeave"
  >
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      active: false,
    };
  },
  methods: {
    dragOver(ev) {
      ev.preventDefault();
      this.active = true;
    },
    dragLeave(ev) {
      ev.preventDefault();
      this.active = false;
    },
    drop(ev) {
      this.$emit('drop', {
        data: JSON.parse(ev.dataTransfer.getData('text')),
        id: this.id,
      });
      this.active = false;
    },
  },
};
</script>

<style>
.droppable.active {
  outline: 2px dashed greenyellow;
}
</style>
