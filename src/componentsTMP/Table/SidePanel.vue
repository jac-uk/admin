<template>
  <transition name="slide">
    <div
      v-if="show"
      class="side-panel govuk-grid-column-one-half govuk-grid-column-one-third-from-desktop"
    >
      <div
        v-if="hasHeader"
        class="header-div"
      >
        <slot name="header" />
        <hr>
      </div>
      <div class="content">
        <div class="scrollable">
          <slot />
        </div>
      </div>
      <div
        v-if="hasFooter"
        class="footer-div"
      >
        <hr>
        <slot name="footer" />
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    hasHeader () {
      return !!this.$slots['header'];
    },
    hasFooter () {
      return !!this.$slots['footer'];
    },
  },
};
</script>

<style lang="scss">

.side-panel {
  border: 1px solid black;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 11;
  background-color: white;

  hr {
    padding: 0;
    margin: 0;
  }

  .footer-div > button {
    width: 40%;
  }

  .content {
    overflow: auto;
  }

  .scrollable {
    overflow-y: auto;
    max-height: 70vh;
  }

  .header-div {
    margin: 0;
  }

  .footer-div {
    text-align: center;
  }

  .clear-all {
    padding-top: 2em;
  }

  .slide-enter-active,
  .slide-leave-active {
    transition: transform 0.75s ease-in-out;
  }

  .slide-enter,
  .slide-leave-to {
    transform: translateX(300%);
  }

}

</style>
