<template>
  <button
    ref="updateFavouritesBtn"
    class="govuk-button govuk-button--secondary"
    @click="click"
  >
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
      if (this.inFavourites) {
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
