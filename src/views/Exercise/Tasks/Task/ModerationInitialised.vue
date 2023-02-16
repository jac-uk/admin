<template>
  <div>
    <h1>Moderation Initialised</h1>
    [ choose additional applications (random selection), create panels, allocate applications ]
    <button @click="btnNext">
      Next
    </button>
  </div>
</template>

<script>
import { beforeRouteEnter, btnNext } from './helper';
export default {
  beforeRouteEnter: beforeRouteEnter,
  props: {
    type: {
      required: true,
      type: String,
    },
  },
  methods: {
    btnNext,
  },
};
</script>
