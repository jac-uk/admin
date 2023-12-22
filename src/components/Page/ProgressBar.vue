<template>
  <div 
    class="progress-bar"
    :class="{
      'progress-bar--started': isStarted, 
      'progress-bar--completed': isCompleted 
    }"
  >
    <div 
      v-for="step in steps"
      :key="step.id"
      class="progress-bar-step"
      :class="{
        'progress-bar-step--completed': step.completed,
        'progress-bar-step--current': step.id == currentStep.id
      }"
    >
      <svg 
        v-if="step.completed"
        class="progress-bar-step-icon" 
        viewBox="0 0 99.295 86.056"
      >
        <polygon
          fill="currentColor" 
          points="36.371 86.056 0 54.594 9.793 43.287 34.554 64.728 87.76 0 99.295 9.49 36.371 86.056"
        />
      </svg>
      <div class="progress-bar-step-label govuk-caption-m">
        {{ step.title }}
      </div>
    </div>    
  </div>
</template>

<script>
export default {
  props: {
    steps: {
      required: true,
      type: Array,
    },
  },
  computed: {
    completedSteps() {
      return this.steps.filter(step => step.completed);
    },
    currentStep() {
      if (this.completedSteps.length === 0) return this.steps[0];
      if (this.isCompleted) return this.steps[this.steps.length - 1];
      return this.steps[this.completedSteps.length];
    },
    isStarted() {
      return this.completedSteps.length > 0;
    },
    isCompleted() {
      return this.steps.length === this.completedSteps.length;
    },
  },
};
</script>

<style lang="scss">

.progress-bar {
  width: 100%;
  height: 3.5em;
  margin-bottom: 1.5em;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  position: relative;
  overflow: hidden;
  &::after {
    content: "";
    display: block;
    position: absolute;
    bottom: 7.5px;
    right: 0;
    width: 3px;
    height: 9px;
    background-color: govuk-colour("mid-grey");
  }
  > .progress-bar-step {
    flex-grow: 1;
    height: 24px;
    text-align: left;
    align-self: flex-end;
    &::before {
      content: "";
      display: block;
      position:absolute;
      width: 100%;
      height: 3px;
      margin-top: 10.5px;
      background-color: govuk-colour("mid-grey");
    }    
    &::after {
      content: "";
      position: absolute;
      // margin-left: -3px;
      margin-top: 7.5px;
      width: 3px;
      height: 9px;
      background-color: govuk-colour("mid-grey");
    }
    > .progress-bar-step-icon {
      display: none;
      position: absolute;
      z-index: 1;
      width: 20px;
      height: 20px;
      margin-left: -10px;
      margin-top: 2px;
      background-color: govuk-colour("blue");
      color: white;
      border-radius: 10px;
      padding: 3px;
    }
    > .progress-bar-step-label {
      display: none;
      position: absolute;
      z-index: 1;
      background-color: white;
      width: 100%;
      left: 0;
      margin-left: 0;
      margin-top: -30px;
    }
    &.progress-bar-step--completed {
      &::before {
        background-color: govuk-colour("blue");
      }
      &::after {
        display: none;
      }
      > .progress-bar-step-icon { 
        display: inline;
      }
      > .progress-bar-step-label {
        color: govuk-colour("blue");
      }
    }
    &.progress-bar-step--current {
      > .progress-bar-step-label {
        z-index: 0;
        display: block;
      }
    }
    &:hover {
      > .progress-bar-step-label {
        display: block;
      }      
    }
    &:first-child {
      > .progress-bar-step-icon {
        margin-left: 0;
      }
    }
    &:last-child {
      flex-grow: 0;
      > .progress-bar-step-icon {
        margin-left: -20px;
      }
    }
  }
  &.progress-bar--completed::after {
    display: none;
  }
}

</style>
