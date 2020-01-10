<template>
  <button
    ref="updateFavoutitesBtn"
    class="govuk-button govuk-button--secondary govuk-!-margin-0"
    @click="click"
  >
    <svg
      id="stars-full-star"
      viewBox="0 0 29 29"
      width="18"
      height="18"
      fill="none"
      stroke="grey"
      stroke-width="2px"
    >
      <path d="M13.996,22.501 L22.649,27.997 L20.352,17.637 L27.996,10.667 L17.930,9.768 L13.996,-0.003 L10.063,9.768 L-0.003,10.667 L7.641,17.637 L5.345,27.997 L13.996,22.501 Z" />
    </svg>
    {{ buttonText }}
  </button>
</template>
  
<script>
export default {
  props: {
    inFavourites: {
      required: true,
      type: Boolean,
      default: false,
    },
  },
  computed: {
    buttonText() {
      if(this.inFavourites) {
        return 'Remove from favourites';
      }
      else {
        return 'Add to favourites';
      }
    },
  },
  methods: {
    click() {
      this.$emit('click');
    },
  },
};
</script>
