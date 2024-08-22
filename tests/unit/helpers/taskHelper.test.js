import {
  MARKING_TYPE,
  getMarkingType,
  getCompleteScoreSheet
  // getScoreSheetTotal,
  // getScoreSheetItemTotal,
  // markingScheme2ScoreSheet,
  // isScoreSheetComplete,
  // markingScheme2Columns,
  // markingScheme2ColumnHeaders
} from '@/helpers/taskHelper';
import { describe } from 'vitest';

describe('getMarkingType', () => {
  it('should return correct marking type object when valid type is provided', () => {
    expect(getMarkingType('group')).toEqual(MARKING_TYPE.GROUP);
    expect(getMarkingType('score')).toEqual(MARKING_TYPE.SCORE);
    expect(getMarkingType('number')).toEqual(MARKING_TYPE.NUMBER);
    expect(getMarkingType('grade')).toEqual(MARKING_TYPE.GRADE);
    expect(getMarkingType('yesNo')).toEqual(MARKING_TYPE.YES_NO);
    expect(getMarkingType('passFail')).toEqual(MARKING_TYPE.PASS_FAIL);
    expect(getMarkingType('level')).toEqual(MARKING_TYPE.LEVEL);
  });

  it('should return default object when type is invalid', () => {
    const expected = {
      value: null,
      label: null,
    };
    expect(getMarkingType()).toEqual(expected);
    expect(getMarkingType('')).toEqual(expected);
    expect(getMarkingType(null)).toEqual(expected);
    expect(getMarkingType(undefined)).toEqual(expected);
  });
});

describe('getCompleteScoreSheet', () => {
  it('should return a populated score sheet when task has applications and a score sheet', () => {
    const task = {
      applications: [{ id: 'app1' }, { id: 'app2' }],
      emptyScoreSheet: { criteria1: 0, criteria2: 0 },
      scoreSheet: { app1: { criteria1: 5, criteria2: 3 } },
    };
    const result = getCompleteScoreSheet(task);
    expect(result).toEqual({
      app1: { criteria1: 5, criteria2: 3 },
      app2: { criteria1: 0, criteria2: 0 },
    });
  });

  it('should return an empty score sheet when task has no applications', () => {
    const task = {
      applications: [],
      emptyScoreSheet: { criteria1: 0, criteria2: 0 },
      scoreSheet: {},
    };
    const result = getCompleteScoreSheet(task);
    expect(result).toEqual({});
  });

  it('should return an empty score sheet when task has an empty applications array', () => {
    const task = {
      applications: [],
      emptyScoreSheet: { criteria1: 0, criteria2: 0 },
    };
    const result = getCompleteScoreSheet(task);
    expect(result).toEqual({});
  });
});

describe('getScoreSheetTotal', () => {
  it('should return an empty score sheet when task has an empty applications array', () => {
    const task = {
      applications: [],
    };
    expect(getCompleteScoreSheet(task)).toEqual({});
  });
});

// describe('getScoreSheetItemTotal', () => {});

// describe('markingScheme2ScoreSheet', () => {});

// describe('isScoreSheetComplete', () => {});

// describe('markingScheme2Columns', () => {});

// describe('markingScheme2ColumnHeaders', () => {});
