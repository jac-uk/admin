import { getTaskTypes, taskEntryStatus } from '@/helpers/exerciseHelper';
import { TASK_TYPE, SHORTLISTING } from '@/helpers/constants';

const today = new Date();
// const tomorrow = new Date(today.getTime() + (24 * 60 * 60 * 1000));
const yesterday = new Date(today.getTime() - (24 * 60 * 60 * 1000));
// const dayAfterTomorrow = new Date(today.getTime() + (2 * 24 * 60 * 60 * 1000));
const dayBeforeYesterday = new Date(today.getTime() - (2 * 24 * 60 * 60 * 1000));

describe('exerciseHelper', () => {
  let exercise;
  beforeEach(() => {
    exercise = {
      shortlistingMethods: [],
      criticalAnalysisTestDate: null,
      criticalAnalysisTestStartTime: null,
      situationalJudgementTestDate: null,
      situationalJudgementTestStartTime: null,
    };
  });

  describe('getTaskTypes', () => {
    it('includes critical analysis if configured', () => {
      expect(getTaskTypes(exercise)).not.toContain(TASK_TYPE.CRITICAL_ANALYSIS);
      exercise.shortlistingMethods.push(SHORTLISTING.CRITICAL_ANALYSIS_QUALIFYING_TEST);
      exercise.criticalAnalysisTestDate = new Date();
      exercise.criticalAnalysisTestStartTime = new Date();
      expect(getTaskTypes(exercise)).toContain(TASK_TYPE.CRITICAL_ANALYSIS);
    });
    it('includes situational judgement if configured', () => {
      expect(getTaskTypes(exercise)).not.toContain(TASK_TYPE.SITUATIONAL_JUDGEMENT);
      exercise.shortlistingMethods.push(SHORTLISTING.SITUATIONAL_JUDGEMENT_QUALIFYING_TEST);
      exercise.situationalJudgementTestDate = new Date();
      exercise.situationalJudgementTestStartTime = new Date();
      expect(getTaskTypes(exercise)).toContain(TASK_TYPE.SITUATIONAL_JUDGEMENT);
    });
    it('includes qualifying test if CA and SJ are configured', () => {
      expect(getTaskTypes(exercise)).not.toContain(TASK_TYPE.CRITICAL_ANALYSIS);
      expect(getTaskTypes(exercise)).not.toContain(TASK_TYPE.SITUATIONAL_JUDGEMENT);
      expect(getTaskTypes(exercise)).not.toContain(TASK_TYPE.QUALIFYING_TEST);
      exercise.shortlistingMethods.push(SHORTLISTING.CRITICAL_ANALYSIS_QUALIFYING_TEST);
      exercise.criticalAnalysisTestDate = new Date();
      exercise.criticalAnalysisTestStartTime = new Date();
      exercise.shortlistingMethods.push(SHORTLISTING.SITUATIONAL_JUDGEMENT_QUALIFYING_TEST);
      exercise.situationalJudgementTestDate = new Date();
      exercise.situationalJudgementTestStartTime = new Date();
      expect(getTaskTypes(exercise)).toContain(TASK_TYPE.QUALIFYING_TEST);
    });
  });

  describe('taskEntryStatus', () => {
    it('returns empty status', () => {
      expect(taskEntryStatus(exercise, TASK_TYPE.CRITICAL_ANALYSIS)).toEqual('');
    });
    it('returns empty status for first task', () => {
      exercise.shortlistingMethods.push(SHORTLISTING.CRITICAL_ANALYSIS_QUALIFYING_TEST);
      exercise.criticalAnalysisTestDate = today;
      exercise.criticalAnalysisTestStartTime = today;
      expect(taskEntryStatus(exercise, TASK_TYPE.CRITICAL_ANALYSIS)).toEqual('');
    });
    it('returns empty status for qualifying tests when there are NOT other tasks', () => {
      exercise.shortlistingMethods.push(SHORTLISTING.CRITICAL_ANALYSIS_QUALIFYING_TEST);
      exercise.criticalAnalysisTestDate = today;
      exercise.criticalAnalysisTestStartTime = today;
      exercise.shortlistingMethods.push(SHORTLISTING.SITUATIONAL_JUDGEMENT_QUALIFYING_TEST);
      exercise.situationalJudgementTestDate = today;
      exercise.situationalJudgementTestStartTime = today;
      expect(taskEntryStatus(exercise, TASK_TYPE.SITUATIONAL_JUDGEMENT)).toEqual('');
    });
    it('returns correct status for qualifying tests when there are other tasks', () => {
      exercise.shortlistingMethods.push(SHORTLISTING.PAPER_SIFT);
      exercise.siftStartDate = dayBeforeYesterday;
      exercise.siftEndDate = yesterday;
      exercise.shortlistingMethods.push(SHORTLISTING.CRITICAL_ANALYSIS_QUALIFYING_TEST);
      exercise.criticalAnalysisTestDate = today;
      exercise.criticalAnalysisTestStartTime = today;
      exercise.shortlistingMethods.push(SHORTLISTING.SITUATIONAL_JUDGEMENT_QUALIFYING_TEST);
      exercise.situationalJudgementTestDate = today;
      exercise.situationalJudgementTestStartTime = today;
      expect(taskEntryStatus(exercise, TASK_TYPE.SITUATIONAL_JUDGEMENT)).toEqual(`${TASK_TYPE.SIFT}Passed`);
    });
    describe('Example 1: exercise with shortlisting methods (sift, CA, SJ, scenario)', () => {
      beforeEach(() => {
        exercise = {
          shortlistingMethods: [
            SHORTLISTING.PAPER_SIFT,
            SHORTLISTING.CRITICAL_ANALYSIS_QUALIFYING_TEST,
            SHORTLISTING.SITUATIONAL_JUDGEMENT_QUALIFYING_TEST,
            SHORTLISTING.SCENARIO_TEST_QUALIFYING_TEST,
          ],
          siftStartDate: dayBeforeYesterday,
          criticalAnalysisTestDate: yesterday,
          criticalAnalysisTestStartTime: yesterday,
          situationalJudgementTestDate: yesterday,
          situationalJudgementTestStartTime: yesterday,
          scenarioTestDate: today,
          scenarioTestStartTime: today,
        };
      });
      it('sift is for all candidates (status empty)', () => {
        expect(taskEntryStatus(exercise, TASK_TYPE.SIFT)).toEqual('');
      });
      it('situational judgement QT is for candidates who pass sift', () => {
        expect(taskEntryStatus(exercise, TASK_TYPE.SITUATIONAL_JUDGEMENT)).toEqual(`${TASK_TYPE.SIFT}Passed`);
      });
      it('critical analysis QT is for candidates who pass sift', () => {
        expect(taskEntryStatus(exercise, TASK_TYPE.CRITICAL_ANALYSIS)).toEqual(`${TASK_TYPE.SIFT}Passed`);
      });
      it('scenario test is for candidates who pass qualifying test', () => {
        expect(taskEntryStatus(exercise, TASK_TYPE.SCENARIO)).toEqual(`${TASK_TYPE.QUALIFYING_TEST}Passed`);
      });
    });
    describe('Example 2: exercise with shortlisting methods (scenario, sift, CA, SJ)', () => {
      beforeEach(() => {
        exercise = {
          shortlistingMethods: [
            SHORTLISTING.PAPER_SIFT,
            SHORTLISTING.CRITICAL_ANALYSIS_QUALIFYING_TEST,
            SHORTLISTING.SITUATIONAL_JUDGEMENT_QUALIFYING_TEST,
            SHORTLISTING.SCENARIO_TEST_QUALIFYING_TEST,
          ],
          siftStartDate: yesterday,
          criticalAnalysisTestDate: today,
          criticalAnalysisTestStartTime: today,
          situationalJudgementTestDate: today,
          situationalJudgementTestStartTime: today,
          scenarioTestDate: dayBeforeYesterday,
          scenarioTestStartTime: dayBeforeYesterday,
        };
      });
      it('scenario test is for all candidates (status empty)', () => {
        expect(taskEntryStatus(exercise, TASK_TYPE.SCENARIO)).toEqual('');
      });
      it('sift is for candidates who pass scenario test', () => {
        expect(taskEntryStatus(exercise, TASK_TYPE.SIFT)).toEqual(`${TASK_TYPE.SCENARIO}Passed`);
      });
      it('situational judgement QT is for candidates who pass scenario test', () => {
        expect(taskEntryStatus(exercise, TASK_TYPE.SITUATIONAL_JUDGEMENT)).toEqual(`${TASK_TYPE.SIFT}Passed`);
      });
      it('critical analysis QT is for candidates who pass scenario test', () => {
        expect(taskEntryStatus(exercise, TASK_TYPE.CRITICAL_ANALYSIS)).toEqual(`${TASK_TYPE.SIFT}Passed`);
      });
    });
  });
});
