<template>
  <div 
    v-if="message"
    :class="status ? 'moj-banner moj-banner--'+status : 'moj-banner'"
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
        <path :d="status === 'success' ? 'M25,6.2L8.7,23.2L0,14.1l4-4.2l4.7,4.9L21,2L25,6.2z' : 'M13.7,18.5h-2.4v-2.4h2.4V18.5z M12.5,13.7c-0.7,0-1.2-0.5-1.2-1.2V7.7c0-0.7,0.5-1.2,1.2-1.2s1.2,0.5,1.2,1.2v.8C13.7,13.2,13.2,13.7,12.5,13.7z M12.5,0.5c-6.6,0-12,5.4-12,12s5.4,12,12,12s12-5.4,12-12S19.1,0.5,12.5,0.5z'" />
      </svg>
      <span class="moj-banner__assistive">{{ status }}</span>
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
    status: {
      type: String,
      default: null,
      // @TODO add validator?
    },
  },
};
</script>

<style scoped>
  .moj-banner__text {
    margin-left: 12px;
    vertical-align: text-top;
  }
</style>
