<template>
  <button
    class="govuk-button govuk-button--secondary govuk-!-margin-0"
  >
    <svg viewBox="0 0 20 20" height="25" width="23" stroke="red" fill="grey">
      <polygon points="9.9, 1.1, 3.3, 21.78, 19.8, 8.58, 0, 8.58, 16.5, 21.78" style="fill-rule:nonzero;"/>
    </svg>
    {{buttonText}}
  </button>
</template>
  
<script>
export default {
  data() {
    return {
      isInFavourites: true
    }
  },
  computed: {
    buttonText() {
      if(this.isInFavourites) {
        return "Remove from favourites"
      }
      else {
        return "Add to favourites";
      }
    }
  }
};
</script>
