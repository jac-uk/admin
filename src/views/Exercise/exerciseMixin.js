<<<<<<< Updated upstream
import exerciseTimeline from '@jac-uk/jac-kit/helpers/exerciseHelper.js';
import createTimeline from '@jac-uk/jac-kit/helpers/createTimeline';
=======
import exerciseTimeline from '@jac-uk/jac-kit/helpers/Timeline/exerciseTimeline';
import createTimeline from '@jac-uk/jac-kit/helpers/Timeline/createTimeline';
>>>>>>> Stashed changes

const ADVERT_TYPES = {
  LISTING: 'listing',
  BASIC: 'basic',
  FULL: 'full',
  EXTERNAL: 'external',
};

const exerciseMixin = {
  computed: {
    timeline() {
      const timeline = exerciseTimeline(this.exercise);
      return createTimeline(timeline);
    },
    showAppointmentType() {
      return this.advertTypeFull || this.advertType === ADVERT_TYPES.BASIC ? true : false;
    },
    showNumberOfVacancies() {
      return this.advertTypeFull || this.advertType === ADVERT_TYPES.BASIC ? true : false;
    },
    showLocation() {
      return this.advertTypeFull || this.advertType === ADVERT_TYPES.BASIC ? true : false;
    },
    advertType() {
      return this.exercise.advertType ? this.exercise.advertType : ADVERT_TYPES.FULL;
    },
    advertTypeFull() {
      return this.advertType === ADVERT_TYPES.FULL;
    },
  },
};

export default exerciseMixin;
