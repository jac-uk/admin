import review from '@/store/stage/review';
import { SHORTLISTING, APPLICATION_STATUS } from '@/helpers/constants';

describe('store/review', () => {
  
  describe('getters', () => {
    const getters = review.getters;
      describe('availableStatuses', () => {
        let validTypes;
        describe('shortlisting input', () => {
          validTypes = [
            [
              [SHORTLISTING.TELEPHONE_ASSESSMENT],
              [
                APPLICATION_STATUS.FAILED_TELEPHONE_ASSESSMENT,
                APPLICATION_STATUS.PASSED_TELEPHONE_ASSESSMENT,
                APPLICATION_STATUS.WITHDREW_APPLICATION,
              ],
            ],
            [
              [SHORTLISTING.SITUATIONAL_JUDGEMENT_QUALIFYING_TEST],
              [
                APPLICATION_STATUS.SUBMITTED_FIRST_TEST,
                APPLICATION_STATUS.FAILED_FIRST_TEST,
                APPLICATION_STATUS.PASSED_FIRST_TEST,
                APPLICATION_STATUS.NO_TEST_SUBMITTED,
                APPLICATION_STATUS.TEST_SUBMITTED_OVER_TIME,
                APPLICATION_STATUS.WITHDREW_APPLICATION,
              ],
            ],
            [
              [SHORTLISTING.CRITICAL_ANALYSIS_QUALIFYING_TEST],
              [
                APPLICATION_STATUS.SUBMITTED_FIRST_TEST,
                APPLICATION_STATUS.FAILED_FIRST_TEST,
                APPLICATION_STATUS.PASSED_FIRST_TEST,
                APPLICATION_STATUS.NO_TEST_SUBMITTED,
                APPLICATION_STATUS.TEST_SUBMITTED_OVER_TIME,
                APPLICATION_STATUS.WITHDREW_APPLICATION,
              ],
            ],
            [
              [SHORTLISTING.SCENARIO_TEST_QUALIFYING_TEST],
              [
                APPLICATION_STATUS.SUBMITTED_SCENARIO_TEST,
                APPLICATION_STATUS.FAILED_SCENARIO_TEST,
                APPLICATION_STATUS.PASSED_SCENARIO_TEST,
                APPLICATION_STATUS.NO_TEST_SUBMITTED,
                APPLICATION_STATUS.TEST_SUBMITTED_OVER_TIME,
                APPLICATION_STATUS.WITHDREW_APPLICATION,
              ],
            ],
            [
              [SHORTLISTING.NAME_BLIND_PAPER_SIFT],
              [
                APPLICATION_STATUS.PASSED_SIFT,
                APPLICATION_STATUS.FAILED_SIFT,
                APPLICATION_STATUS.REJECTED_AS_INELIGIBLE,
                APPLICATION_STATUS.WITHDREW_APPLICATION,
              ],
            ],
            [
              [SHORTLISTING.PAPER_SIFT],
              [
                  APPLICATION_STATUS.PASSED_SIFT,
                  APPLICATION_STATUS.FAILED_SIFT,
                  APPLICATION_STATUS.REJECTED_AS_INELIGIBLE,
                  APPLICATION_STATUS.WITHDREW_APPLICATION,
              ],
            ],
            [
              [SHORTLISTING.OTHER],
              [APPLICATION_STATUS.WITHDREW_APPLICATION],
            ],
          ];
          it.each(validTypes)('when given %s returns %s', (input, output) => {
            const valid = getters.availableStatuses()(input,[]);
            expect(valid).toEqual(output);
          });
        });
      });
    });

});