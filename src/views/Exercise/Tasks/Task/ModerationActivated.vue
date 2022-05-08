<template>
  <div>
    <h1>Moderation Activated</h1>
    [ view and agree final scores ]
    <button @click="btnNext">Next</button>
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
