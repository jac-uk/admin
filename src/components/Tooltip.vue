<template>
  <Dropdown
    :distance="6"
  >
    <!-- This will be the popover reference (for the events and position) -->
    <button
      type="button"
      class="tooltip__button js-tooltip-btn"
      @click="toggleTooltip"
    >
      <div class="tooltip__button__icon">
        <svg
          viewBox="0 0 100 100"
          class="tooltip__button__icon__svg"
        >
          <path
            d="M55.139,65.558H38.28v-4.726c0-4.045,0.872-7.57,2.611-10.581c1.739-3.011,4.878-6.16,9.418-9.452
                              c4.535-3.292,7.513-5.926,8.923-7.903s2.115-4.254,2.115-6.841s-1.01-4.612-3.03-6.069c-2.025-1.458-4.869-2.187-8.537-2.187
                              c-6.398,0-13.639,2.072-21.729,6.207L21.139,10.11c9.499-5.312,19.518-7.97,30.051-7.97c8.651,0,15.564,2.106,20.738,6.312
                              c5.174,4.211,7.761,9.795,7.761,16.755c0,4.654-1.058,8.675-3.173,12.062s-6.136,7.198-12.062,11.429
                              c-4.188,3.149-6.784,5.493-7.794,7.017c-1.015,1.529-1.52,3.54-1.52,6.031V65.558z M58.526,87.177c0,3.411-0.977,6.069-2.93,7.975
                              c-1.948,1.901-4.688,2.854-8.218,2.854c-3.525,0-6.255-0.939-8.18-2.82c-1.929-1.882-2.892-4.559-2.892-8.042
                              c0-3.478,0.948-6.136,2.854-7.97c1.906-1.834,4.645-2.754,8.218-2.754s6.327,0.943,8.256,2.825
                              C57.559,81.127,58.526,83.771,58.526,87.177z"
          />
        </svg>
      </div>
    </button>

    <!-- This will be the content of the popover -->
    <template #popper>
      <slot name="content" />
    </template>

    <div
      id="background"
      class="background"
      :class="{ active: isActive }"
      aria-hidden="true"
      @click="closeOpenToolTip"
    />
  </Dropdown>
</template>

<script>
import {
  Dropdown
} from 'floating-vue';

export default {
  name: 'Tooltip',
  components: {
    Dropdown,
  },
  data() {
    return {
      isActive: false,
    };
  },
  methods: {
    toggleTooltip() {
      this.isActive = !this.isActive;
    },
    closeOpenToolTip() {
      this.isActive = false;
    },
  },
};

</script>

<style>
  .background {
      position: fixed;
      top: 0; right: 0; bottom: 0; left: 0;
      background-color: rgba(255,255,255,0.93);
      z-index: -1;
  }
  .background.active {
      z-index: 1000;
  }

  button.tooltip__button {
      align-items: center;
      padding: 0.2em;
      position: relative;
      border-width: 0;
  }
  button.tooltip__button:hover .tooltip__button__icon,
  button.tooltip__button:focus .tooltip__button__icon,
  button.tooltip__button:active .tooltip__button__icon {
      background-color: #383838;
  }
  button.tooltip__button:focus {
      background-color: #ffdd00;
      outline: 0;
  }
  .tooltip__button__icon {
      width: 1.15em;
      height: 1.15em;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #969696;
  }
  .tooltip__button__icon__svg {
      width: 60%;
      height: 60%;
      fill: #fff;
  }

  .v-popper__inner {
    border-width: 2px !important;
    border-radius: 0px !important;
    border-color: #000 !important;
    padding: 12px;
  }

  .v-popper__arrow-outer {
    border-color: #000 !important;
  }
  .v-popper__arrow-inner {
    top:-3px !important;
  }
</style>
