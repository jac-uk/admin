<script setup>
import { ref } from 'vue';
import { onClickOutside } from '@vueuse/core';
import { USER_FEEDBACK_TYPES } from '@/helpers/constants';

const emit = defineEmits(['openFeedbackModal']);

const menuRef = ref(null);
const menuOpen = ref(false);

onClickOutside(menuRef, () => {
  menuOpen.value = false;
});

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
};

const closeMenu = () => {
  menuOpen.value = false;
};

const openFeedbackModal = (type) => {
  emit('openFeedbackModal', type);
  closeMenu();
};
</script>

<template>
  <div class="user-feedback-link">
    <button
      class="report-issue"
      type="button"
      @click="toggleMenu"
    >
      <svg
        viewBox="0 0 17.583 19.237"
        class="report-issue__icon"
      >
        <path
          d="m10.198,0h-2.812C3.307,0,0,3.307,0,7.385v1.522c0,2.575,1.318,4.842,3.316,6.164.246.544.613,1.098.936,1.744.524,1.047,1.689,1.99,2.425,2.402.114.064.248-.037.22-.165-.135-.617-.195-1.875-.189-2.791.223.02.449.031.677.031h2.812c4.079,0,7.386-3.307,7.386-7.385v-1.522c0-4.079-3.307-7.385-7.386-7.385Zm-.397,3.331l-.29,5.716h-1.438l-.278-5.716h2.006Zm-1.009,9.584c-.682,0-1.123-.492-1.123-1.148.013-.669.454-1.148,1.123-1.148s1.136.479,1.136,1.148c0,.656-.455,1.148-1.136,1.148Z"
          fill="#1d70b8"
        />
      </svg>
      <span class="fourteenpx" />
    </button>

    <div
      v-if="menuOpen"
      ref="menuRef"
      class="user-feedback-menu"
    >
      <p>Choose one of the options below:</p>
      <button
        type="button"
        @click="() => openFeedbackModal(USER_FEEDBACK_TYPES.YOURSELF)"
      >
        > Raise an issue for yourself
      </button>
      <button
        type="button"
        @click="() => openFeedbackModal(USER_FEEDBACK_TYPES.ANOTHER_USER)"
      >
        > Raise and issue for another user
      </button>
      <button
        type="button"
        @click="() => openFeedbackModal(USER_FEEDBACK_TYPES.QUESTION)"
      >
        > Ask a question
      </button>
    </div>
  </div>
</template>

<style type="text/css" rel="stylesheet/scss" lang="scss">
.user-feedback-link {
  position: fixed;
  left: 1em;
  background-color: transparent;
  padding: 5px;
}

button.report-issue {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background-color: #f3f2f1;
  padding: 0.7em;
  border: 1px solid #D2D2D2FF;
  line-height: 1em;
  align-items: center;
  font-size: 1em !important;
  text-align: center;
  font-family: "GDS Transport", arial, sans-serif;
  cursor: pointer;
}
button.report-issue:hover,
button.report-issue:focus,
button.report-issue:active {
  background-color: #D2D2D2FF;
}

.fourteenpx {
  font-size: 14px;
}

.report-issue__icon {
  fill: #1d70b8;
  width: 1em !important;
  height: 1.05em !important;
}

.user-feedback-menu {
  width: max-content;
  position: absolute;
  bottom: 100%;
  left: 100%;
  background-color: white;
  padding: 0.5em;
  border: 1px solid #D2D2D2FF;
  border-radius: 0.5em;
}
.user-feedback-menu button {
  display: block;
  padding: 0.5em;
  margin-bottom: 0.5em;
  background: white;
  border: none;
  border-radius: 0.5em;
  cursor: pointer;
}
.user-feedback-menu button:hover {
  background-color: #f3f2f1;
}
</style>
