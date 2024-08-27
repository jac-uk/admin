<template>
  <div class="panel govuk-!-margin-bottom-4">
    <span class="govuk-caption-m long-text">
      Timeline - where we are
    </span>
    <div
      ref="carrousel"
      class="carrousel"
    >
      <div
        v-for="(time, index) in timeline"
        :key="index"
      >
        <span class="govuk-caption-s color-middle">
          <span class="long-text">{{ time.entry }}</span>
        </span>
        <h2 class="govuk-heading-m govuk-!-margin-bottom-0">
          <span class="long-text long-text-margin">{{ time.dateString }}</span>
        </h2>
      </div>
      <div class="carrousel_arrows">
        <button
          :disabled="timelineSelected <= 0"
          @click="btnPrevious"
        >
          <img
            alt="Sign in with Google"
            src="@/assets/DirectionLeft.png"
          >
        </button>
        <button
          :disabled="timelineSelected >= (timelineTotal - 1)"
          @click="btnNext"
        >
          <img
            alt="Sign in with Google"
            src="@/assets/DirectionRight.png"
          >
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import createTimeline from '@jac-uk/jac-kit/helpers/Timeline/createTimeline';
import exerciseTimeline from '@jac-uk/jac-kit/helpers/Timeline/exerciseTimeline';

export default {
  name: 'Timeline',
  data() {
    return {
      timelineSelected: 0,
      timelineTotal: 0,
    };
  },
  computed: {
    exercise() {
      return this.$store.getters['exerciseDocument/data']();
    },
    timeline() {
      const timeline = exerciseTimeline(this.exercise);
      return createTimeline(timeline);
    },
  },
  mounted() {
    this.carouselChooseItemToShow(this.timeline);
  },
  methods: {
    carouselChooseItemToShow(timeline) {
      // choose the firtst item to show
      let timeItemToShow = 0;
      if (timeline) {
        timeline.map((time, index) => {
          if (time.date <= Date.now()) {
            timeItemToShow = index;
          }
        });
      } else {
        timeItemToShow = 0;
      }
      this.timelineSelected = timeItemToShow;
      this.timelineTotal = this.timeline.length;
      this.carouselShowItem(this.timelineSelected);
    },
    carouselShowItem(id) {
      const carrouselRef = this.$refs.carrousel;
      this.carrouselClean(carrouselRef); // remove previous selected
      const carrouselRefSelected = carrouselRef.querySelectorAll('div')[id];
      carrouselRefSelected.classList.add('carrousel__item-visible');
    },
    carrouselClean(obj) {
      const carrouselNodes = obj.querySelectorAll('div');
      [...carrouselNodes].map(el => {
        el.classList.remove('carrousel__item-visible');
      });
    },
    btnNext() {
      if (this.timelineSelected >= (this.timelineTotal - 1)) {
        this.timelineSelected = this.timelineTotal - 1;
      } else {
        this.timelineSelected = this.timelineSelected + 1;
      }
      this.carouselShowItem(this.timelineSelected);
    },
    btnPrevious() {
      if (this.timelineSelected <= 0) {
        this.timelineSelected = 0;
      } else {
        this.timelineSelected = this.timelineSelected - 1;
      }
      this.carouselShowItem(this.timelineSelected);
    },
  },
};
</script>
<style lang="scss" scoped>
$govuk-mid-grey:	#b1b4b6;
$govuk-brand-colour:	#1d70b8;
.color-middle {
  color: $govuk-mid-grey;
}
.carrousel {
  position: relative;
}

.carrousel div {
  display: none;
}
.carrousel .carrousel_arrows {
  display: block;
  position: absolute;
  bottom: 0;
  right: 0;
}
.carrousel .carrousel_arrows button {
  border: none;
  background-color: transparent;
  cursor: pointer;
}
.carrousel .carrousel_arrows button[disabled] {
  cursor: default;
  filter: brightness(2);
}
.carrousel div.carrousel__item-visible {
  display: block;
}
.long-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
}
.long-text-margin {
  margin-right: 50px;
}
</style>
