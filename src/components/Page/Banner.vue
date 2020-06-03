<template>
  <div 
    v-if="message"
    class="moj-banner moj-banner--success"
  >
    <div class="moj-banner__message">
      <svg 
        class="moj-banner_icon"
        fill="CurrentColour"
        role="presentation"
        focusable="false"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 25 25"
        height="25"
        width="25"
      >
        <path d="M25,6.2L8.7,23.2L0,14.1l4-4.2l4.7,4.9L21,2L25,6.2z" />
      </svg>
      <span class="moj-banner__assistive">success </span>
      <span class="moj-banner__text">{{ message }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      default: null,
      // @TODO add validator?
    },
  },
};
</script>

<style scoped>
  .moj-banner__text {
    display: inline-block;
    margin-left: 12px;
    vertical-align: text-top;
  }
  </style>
