import {
  OUTCOME,
  OVERRIDE_REASON,
  DOWNLOAD_TYPES,
  getOverrideReasons,
  isPass,
  isPassingScore,
  getOverride,
  getDefaultOutcome,
  getCurrentOutcome,
  getNewOutcome,
  scoreType,
  scores,
  scoreData,
  totalApplications,
  totalPassed,
  totalFailed,
  totalDidNotParticipate,
  downloadMeritList,
  getDownloadTypes
} from '@/views/Exercise/Tasks/Task/Finalised/meritListHelper';
import { DIVERSITY_CHARACTERISTICS } from '@/helpers/diversityCharacteristics';
import { downloadXLSX } from '@jac-uk/jac-kit/helpers/export';
import { TASK_TYPE } from '@/helpers/constants';
import { vi } from 'vitest';

describe('getOverrideReasons', () => {
  it('should return override reasons', () => {
    expect(getOverrideReasons()).toEqual(Object.values(OVERRIDE_REASON));
  });
});

describe('getOverride', () => {

  it('should return override of the application if found', () => {
    const passApplicationId = 'app1';
    const failApplicationId = 'app2';

    const passReason = 'pass reason';
    const failReason = 'fail reason';

    const task1 = {
      overrides: {
        pass: {
          [passApplicationId]: passReason,
        },
      },
    };
    const task2 = {
      overrides: {
        fail: {
          [failApplicationId]: failReason,
        },
      },
    };

    expect(getOverride(task1, passApplicationId)).toEqual({
      outcome: OUTCOME.PASS.value,
      id: passApplicationId,
      reason: passReason,
    });

    expect(getOverride(task2, failApplicationId)).toEqual({
      outcome: OUTCOME.FAIL.value,
      id: failApplicationId,
      reason: failReason,
    });
  });

  it('should return false if application not found', () => {
    const passApplicationId = 'app1';
    const failApplicationId = 'app2';

    const task1 = {
      overrides: {
        pass: {},
      },
    };
    const task2 = {
      overrides: {
        fail: {},
      },
    };

    expect(getOverride(task1, passApplicationId)).toBe(false);

    expect(getOverride(task2, failApplicationId)).toBe(false);
  });

  it('should return override of the application if found (backwards compatibility)', () => {
    const passApplicationId = 'app1';
    const failApplicationId = 'app2';

    const task1 = {
      overrides: {
        pass: [passApplicationId],
      },
    };
    const task2 = {
      overrides: {
        fail: [failApplicationId],
      },
    };

    expect(getOverride(task1, passApplicationId)).toEqual({
      outcome: OUTCOME.PASS.value,
      id: passApplicationId,
    });

    expect(getOverride(task2, failApplicationId)).toEqual({
      outcome: OUTCOME.FAIL.value,
      id: failApplicationId,
    });
  });

  it('should return false if application found (backwards compatibility)', () => {
    const passApplicationId = 'app1';
    const failApplicationId = 'app2';

    const task1 = {
      overrides: {
        pass: [],
      },
    };
    const task2 = {
      overrides: {
        fail: [],
      },
    };

    expect(getOverride(task1, passApplicationId)).toBe(false);

    expect(getOverride(task2, failApplicationId)).toBe(false);
  });

  it('should return false if not providing valid task', () => {
    expect(getOverride({}, 'app1')).toBe(false);

    expect(getOverride(undefined, 'app1')).toBe(false);

    expect(getOverride(null, 'app1')).toBe(false);

  });

  it('should return false if task override not having result yet', () => {
    const task = { override: {} };
    expect(getOverride(task, 'app1')).toBe(false);

  });

});

describe('isPassingScore', () => {

  it('should return true if score passing', () => {
    const task = {
      passMark: 0.36,
    };

    expect(isPassingScore(task, 0.36)).toBe(true);
    expect(isPassingScore(task, 0.37)).toBe(true);
  });

  it('should return false if score not passing', () => {
    const task = {
      passMark: 0.36,
    };

    expect(isPassingScore(task, 0.35)).toBe(false);
  });

  it('should return false if pass mark not set', () => {
    const task = {};

    expect(isPassingScore(task, 0.35)).toBe(false);
  });

});

describe('isPass', () => {
  it('should return true if application is pass in override', () => {
    const applicationId = 'app1';

    const task = {
      overrides: {
        pass: {
          [applicationId]: 'pass reason',
        },
      },
      passMark: 1,
    };

    expect(isPass(task, applicationId, -1)).toBe(true);
  });

  it('should return false if application is fail in override', () => {
    const applicationId = 'app1';

    const task = {
      overrides: {
        fail: {
          [applicationId]: 'pass reason',
        },
      },
      passMark: 1,
    };

    expect(isPass(task, applicationId, 2)).toBe(false);
  });

  it('should return true if application the not in override but score is pass', () => {
    const applicationId = 'app1';

    const task = {
      overrides: {},
      passMark: 0.36,
    };

    expect(isPass(task, applicationId, 0.36)).toBe(true);
    expect(isPass(task, applicationId, 0.37)).toBe(true);
  });

  it('should return false if application the not in override but score is fail', () => {
    const applicationId = 'app1';

    const task = {
      overrides: {},
      passMark: 1,
    };

    expect(isPass(task, applicationId, -1)).toBe(false);
  });

  it('should return false if task is empty', () => {
    expect(isPass({}, 'app1', 1)).toBe(false);
  });

});

describe('getDefaultOutcome', () => {
  it('should return pass outcome if score pass', () => {
    const task = {
      passMark: 0.36,
    };

    expect(getDefaultOutcome(task, 0.36)).toEqual(OUTCOME.PASS);
    expect(getDefaultOutcome(task, 0.37)).toEqual(OUTCOME.PASS);
  });

  it('should return fail outcome if score fail', () => {
    const task = {
      passMark: 0.36,
    };

    expect(getDefaultOutcome(task, 0.35)).toEqual(OUTCOME.FAIL);
  });

});

describe('getNewOutcome', () => {
  it('should return fail outcome if score pass', () => {
    const task = {
      passMark: 0.36,
    };

    expect(getNewOutcome(task, 0.36)).toEqual(OUTCOME.FAIL);
    expect(getNewOutcome(task, 0.37)).toEqual(OUTCOME.FAIL);
  });

  it('should return pass outcome if score fail', () => {
    const task = {
      passMark: 0.36,
    };

    expect(getNewOutcome(task, 0.35)).toEqual(OUTCOME.PASS);
  });

});

describe('getCurrentOutcome', () => {
  it('should return pass outcome if score pass', () => {
    const task = {
      passMark: 0.36,
    };

    expect(getCurrentOutcome(task, 0.36)).toEqual(OUTCOME.PASS);
    expect(getCurrentOutcome(task, 0.37)).toEqual(OUTCOME.PASS);
  });

  it('should return fail outcome if score fail', () => {
    const task = {
      passMark: 0.36,
    };

    expect(getCurrentOutcome(task, 0.35)).toEqual(OUTCOME.FAIL);
  });

});

describe('scoreType', () => {
  it('should return score type if task having score type being set', () => {
    expect(scoreType({ scoreType: 'score' })).toBe('score');
    expect(scoreType({ scoreType: 'percent' })).toBe('percent');
  });

  it('should return percent if task score type not set but having percentage score in final scores', () => {
    const withScoreTypeTask = {
      scoreType: 'score',
      finalScores: [{
        percent: 20,
      }],
    };

    const withoutScoreTypeTask = {
      finalScores: [{
        percent: 20,
      }],
    };

    expect(scoreType(withScoreTypeTask)).toBe('score');
    expect(scoreType(withoutScoreTypeTask)).toBe('percent');

  });
  it('should return score if task is empty', () => {

    expect(scoreType(null)).toBe('score');
    expect(scoreType(undefined)).toBe('score');
    expect(scoreType({})).toBe('score');
  });

});

describe('scores', () => {
  it('should return an empty array when task is null', () => {
    expect(scores(null, 'score', {})).toEqual([]);
  });

  it('should return an empty array when exerciseDiversity is null', () => {
    const task = { finalScores: [{ score: 10 }] };
    expect(scores(task, 'score', null)).toEqual([]);
  });

  it('should return an empty array when task.finalScores is empty', () => {
    const task = { finalScores: [] };
    expect(scores(task, 'score', { '001': {} })).toEqual([]);
  });

  it('should correctly calculates diversity data', () => {
    const task = {
      finalScores: [
        { id: '1', ref: 'ref-001', score: 10 },
        { id: '2', ref: 'ref-002', score: 10 },
        { id: '3', ref: 'ref-003', score: 10 },
        { id: '4', ref: 'ref-004', score: 10 },
      ],
      passMark: 9,
    };
    const exerciseDiversity = {
      '001': { d: [DIVERSITY_CHARACTERISTICS.GENDER_FEMALE] },
      '002': { d: [DIVERSITY_CHARACTERISTICS.ETHNICITY_BAME] },
      '003': { d: [DIVERSITY_CHARACTERISTICS.PROFESSION_SOLICITOR] },
      '004': { d: [DIVERSITY_CHARACTERISTICS.DISABILITY_DISABLED] },
    };

    const result = scores(task, 'score', exerciseDiversity);

    expect(result).toHaveLength(1);
    expect(result[0].score).toBe(10);
    expect(result[0].count).toBe(4);
    expect(result[0].diversity.female).toBe(1);
    expect(result[0].diversity.bame).toBe(1);
    expect(result[0].diversity.disability).toBe(1);
    expect(result[0].diversity.solicitor).toBe(1);
    expect(result[0].outcome.pass).toBe(4);

  });

  it('should correctly calculates cumulative diversity data', () => {
    const task = {
      finalScores: [
        { id: '1', ref: 'ref-001', score: 10 },
        { id: '2', ref: 'ref-002', score: 9 },
      ],
      passMark: 9,
    };
    const exerciseDiversity = {
      '001': { d: [DIVERSITY_CHARACTERISTICS.GENDER_FEMALE] },
      '002': { d: [DIVERSITY_CHARACTERISTICS.GENDER_FEMALE] },
    };

    const result = scores(task, 'score', exerciseDiversity);

    expect(result).toHaveLength(2);
    // assert first score group
    expect(result[0].score).toBe(10);
    expect(result[0].count).toBe(1);
    expect(result[0].cumulativeDiversity.female).toBe(1);
    expect(result[0].cumulativeDiversity.bame).toBe(0);
    expect(result[0].cumulativeDiversity.disability).toBe(0);
    expect(result[0].cumulativeDiversity.solicitor).toBe(0);
    expect(result[0].outcome.pass).toBe(1);

    // assert second score group, the cumulativeDiversity should base on previous group
    expect(result[1].score).toBe(9);
    expect(result[1].count).toBe(1);
    expect(result[1].cumulativeDiversity.female).toBe(2);
    expect(result[1].cumulativeDiversity.bame).toBe(0);
    expect(result[1].cumulativeDiversity.disability).toBe(0);
    expect(result[1].cumulativeDiversity.solicitor).toBe(0);
    expect(result[1].outcome.pass).toBe(1);

  });

  it('should handle overrides correctly', () => {
    const task = {
      finalScores: [
        { id: '1', ref: 'ref-001', score: 10 },
        { id: '2', ref: 'ref-002', score: 8 },
      ],
      passMark: 9,
      overrides: {
        fail: { '1': 'technical' },
        pass: { '2': 'personal' },
      },
    };
    const exerciseDiversity = {
      '001': {},
      '002': {},
    };

    const result = scores(task, 'score', exerciseDiversity);

    expect(result).toHaveLength(2);
    expect(result[0].score).toBe(10);
    expect(result[0].outcome.fail).toBe(1);
    expect(result[0].outcome.pass).toBe(0);

    expect(result[1].score).toBe(8);
    expect(result[1].outcome.pass).toBe(1);
    expect(result[1].outcome.fail).toBe(0);
  });

  it('should calculates rank correctly', () => {
    const task = {
      finalScores: [
        { id: '1', ref: 'ref-001', score: 10 },
        { id: '2', ref: 'ref-002', score: 9 },
        { id: '3', ref: 'ref-003', score: 10 },
        { id: '4', ref: 'ref-004', score: 8 },
      ],
    };
    const exerciseDiversity = {
      '001': {},
      '002': {},
      '003': {},
      '004': {},
    };

    const result = scores(task, 'score', exerciseDiversity);

    expect(result).toHaveLength(3);
    expect(result[0].score).toBe(10);
    expect(result[0].rank).toBe(1);
    expect(result[1].score).toBe(9);
    expect(result[1].rank).toBe(3);
    expect(result[2].score).toBe(8);
    expect(result[2].rank).toBe(4);
  });
});

describe('scoreData', () => {
  it('should return an empty array when task is null', () => {
    expect(scoreData(null, 'score', {})).toEqual([]);
  });

  it('should return an empty array when task.finalScores is empty', () => {
    const task = { finalScores: [] };
    expect(scoreData(task, 'score', {})).toEqual([]);
  });

  it('should return an empty array when exerciseDiversity is null', () => {
    const task = { finalScores: [{ id: '1', ref: 'ref-001', score: 10 }] };
    expect(scoreData(task, 'score', null)).toEqual([]);
  });

  it('should correctly process score data with diversity information', () => {
    const task = {
      finalScores: [
        { id: '1', ref: 'ref-001', score: 10 },
        { id: '2', ref: 'ref-002', score: 9 },
      ],
      applications: [
        { id: '1', fullName: 'John Doe' },
        { id: '2', fullName: 'Jane Smith' },
      ],
      passMark: 9,
    };
    const exerciseDiversity = {
      '001': { d: [DIVERSITY_CHARACTERISTICS.GENDER_FEMALE, DIVERSITY_CHARACTERISTICS.ETHNICITY_BAME] },
      '002': { d: [DIVERSITY_CHARACTERISTICS.PROFESSION_SOLICITOR, DIVERSITY_CHARACTERISTICS.DISABILITY_DISABLED] },
    };

    const result = scoreData(task, 'score', exerciseDiversity);

    expect(result).toHaveLength(2);
    expect(result[0].id).toBe('1');
    expect(result[0].fullName).toBe('John Doe');
    expect(result[0].score).toBe(10);
    expect(result[0].diversity.female).toBe(true);
    expect(result[0].diversity.bame).toBe(true);
    expect(result[0].diversity.solicitor).toBe(false);
    expect(result[0].diversity.disability).toBe(false);
    expect(result[0].pass).toBe(true);
    expect(result[0].rank).toBe(1);

    expect(result[1].id).toBe('2');
    expect(result[1].fullName).toBe('Jane Smith');
    expect(result[1].score).toBe(9);
    expect(result[1].diversity.female).toBe(false);
    expect(result[1].diversity.bame).toBe(false);
    expect(result[1].diversity.solicitor).toBe(true);
    expect(result[1].diversity.disability).toBe(true);
    expect(result[1].pass).toBe(true);
    expect(result[1].rank).toBe(2);
  });

  it('should handle missing application data', () => {
    const task = {
      finalScores: [
        { id: '1', ref: 'ref-001', score: 10 },
      ],
      passMark: 9,
    };
    const exerciseDiversity = {
      '001': { d: [DIVERSITY_CHARACTERISTICS.GENDER_FEMALE] },
    };

    const result = scoreData(task, 'score', exerciseDiversity);

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
    expect(result[0].fullName).toBeUndefined();
    expect(result[0].score).toBe(10);
    expect(result[0].diversity.female).toBe(true);
    expect(result[0].pass).toBe(true);
    expect(result[0].rank).toBe(1);
  });

  it('should correctly handle pass/fail based on passMark', () => {
    const task = {
      finalScores: [
        { id: '1', ref: 'ref-001', score: 10 },
        { id: '2', ref: 'ref-002', score: 8 },
      ],
      passMark: 9,
    };
    const exerciseDiversity = {
      '001': {},
      '002': {},
    };

    const result = scoreData(task, 'score', exerciseDiversity);

    expect(result).toHaveLength(2);
    expect(result[0].pass).toBe(true);
    expect(result[1].pass).toBe(false);
  });

  it('should correctly rank scores', () => {
    const task = {
      finalScores: [
        { id: '1', ref: 'ref-001', score: 10 },
        { id: '2', ref: 'ref-002', score: 10 },
        { id: '3', ref: 'ref-003', score: 9 },
        { id: '4', ref: 'ref-004', score: 8 },
      ],
    };
    const exerciseDiversity = {
      '001': {},
      '002': {},
      '003': {},
      '004': {},
    };

    const result = scoreData(task, 'score', exerciseDiversity);

    expect(result).toHaveLength(4);
    expect(result[0].rank).toBe(1);
    expect(result[1].rank).toBe(1);
    expect(result[2].rank).toBe(3);
    expect(result[3].rank).toBe(4);
  });

  it('should use the correct scoreType', () => {
    const task = {
      finalScores: [
        { id: '1', ref: 'ref-001', score: 10, percent: 100 },
      ],
      scoreType: 'percent',
    };
    const exerciseDiversity = {
      '001': {},
    };

    const result = scoreData(task, 'percent', exerciseDiversity);

    expect(result).toHaveLength(1);
    expect(result[0].score).toBe(100);
  });
});

describe('totalApplications', () => {
  it('should return 0 when task is null', () => {
    expect(totalApplications(null)).toBe(0);
  });

  it('should return the length of applications array when present', () => {
    const task = {
      applications: [
        { id: '1' },
        { id: '2' },
        { id: '3' },
      ],
    };
    expect(totalApplications(task)).toBe(3);
  });

  it('should return totalApplications from _stats when applications array is not present', () => {
    const task = {
      _stats: {
        totalApplications: 5,
      },
    };
    expect(totalApplications(task)).toBe(5);
  });

  it('should return 0 when neither applications nor _stats are present', () => {
    const task = {};
    expect(totalApplications(task)).toBe(0);
  });

  it('should prioritise application array over _stats', () => {
    const task = {
      applications: [
        { id: '1' },
        { id: '2' },
      ],
      _stats: {
        totalApplications: 5,
      },
    };
    expect(totalApplications(task)).toBe(2);
  });

  it('should return 0 when _stats is present but totalApplications is not defined', () => {
    const task = {
      _stats: {},
    };
    expect(totalApplications(task)).toBe(0);
  });
});

describe('totalPassed', () => {
  it('should return 0 when scores array is empty', () => {
    expect(totalPassed({}, 'score', [])).toBe(0);
  });

  it('should returns 0 when task is null', () => {
    expect(totalPassed(null, 'score', [{ score: 10, rank: 1, count: 2 }])).toBe(0);
  });

  it('should return 0 when task has no passMark', () => {
    const task = { finalScores: [{ score: 10 }] };
    expect(totalPassed(task, 'score', [{ score: 10, rank: 1, count: 2 }])).toBe(0);
  });

  it('should calculate total passed correctly without overrides', () => {
    const task = {
      passMark: 8,
      finalScores: [
        { score: 10 },
        { score: 9 },
        { score: 8 },
        { score: 7 },
      ],
    };
    const scores = [
      { score: 10, rank: 1, count: 1 },
      { score: 9, rank: 2, count: 1 },
      { score: 8, rank: 3, count: 1 },
      { score: 7, rank: 4, count: 1 },
    ];
    expect(totalPassed(task, 'score', scores)).toBe(3);
  });

  it('should calculate total passed correctly with overrides', () => {
    const task = {
      passMark: 8,
      finalScores: [
        { score: 10 },
        { score: 9 },
        { score: 8 },
        { score: 7 },
      ],
      overrides: {
        fail: { '1': 'technical' },
        pass: { '4': 'personal' },
      },
    };
    // TODO: confirm override logic
    const scores = [
      { score: 10, rank: 1, count: 1 },
      { score: 9, rank: 2, count: 1 },
      { score: 8, rank: 3, count: 1 },
      { score: 7, rank: 4, count: 1 },
    ];
    expect(totalPassed(task, 'score', scores)).toBe(3);
  });

  it('should handle case when passMark is not in scores', () => {
    const task = {
      passMark: 8.5,
      finalScores: [
        { score: 10 },
        { score: 9 },
        { score: 8 },
        { score: 7 },
      ],
    };
    const scores = [
      { score: 10, rank: 1, count: 1 },
      { score: 9, rank: 2, count: 1 },
      { score: 8, rank: 3, count: 1 },
      { score: 7, rank: 4, count: 1 },
    ];
    expect(totalPassed(task, 'score', scores)).toBe(2);
  });
});

describe('totalFailed', () => {
  it('should return 0 when task is null', () => {
    expect(totalFailed(null, 'score', [])).toBe(0);
  });

  it('should return 0 when task has no passMark', () => {
    const task = { finalScores: [{ score: 10 }] };
    expect(totalFailed(task, 'score', [])).toBe(0);
  });

  it('should calculate total failed correctly', () => {
    const task = {
      passMark: 8,
      finalScores: [
        { score: 10 },
        { score: 9 },
        { score: 8 },
        { score: 7 },
      ],
    };
    const scores = [
      { score: 10, rank: 1, count: 1 },
      { score: 9, rank: 2, count: 1 },
      { score: 8, rank: 3, count: 1 },
      { score: 7, rank: 4, count: 1 },
    ];
    expect(totalFailed(task, 'score', scores)).toBe(1);
  });

  it('should calculates total failed correctly with overrides', () => {
    const task = {
      passMark: 8,
      finalScores: [
        { score: 10 },
        { score: 9 },
        { score: 8 },
        { score: 7 },
      ],
      overrides: {
        fail: { '1': 'technical' },
        pass: { '4': 'personal', '2': 'personal' },
      },
    };
    const scores = [
      { score: 10, rank: 1, count: 1 },
      { score: 9, rank: 2, count: 1 },
      { score: 8, rank: 3, count: 1 },
      { score: 7, rank: 4, count: 1 },
    ];
    expect(totalFailed(task, 'score', scores)).toBe(0);
  });

  it('should return 0 when all scores are passing', () => {
    const task = {
      passMark: 5,
      finalScores: [
        { score: 10 },
        { score: 9 },
        { score: 8 },
        { score: 7 },
      ],
    };
    const scores = [
      { score: 10, rank: 1, count: 1 },
      { score: 9, rank: 2, count: 1 },
      { score: 8, rank: 3, count: 1 },
      { score: 7, rank: 4, count: 1 },
    ];
    expect(totalFailed(task, 'score', scores)).toBe(0);
  });

  it('should return total number of finalScores when all scores are failing', () => {
    const task = {
      passMark: 11,
      finalScores: [
        { score: 10 },
        { score: 9 },
        { score: 8 },
        { score: 7 },
      ],
    };
    const scores = [
      { score: 10, rank: 1, count: 1 },
      { score: 9, rank: 2, count: 1 },
      { score: 8, rank: 3, count: 1 },
      { score: 7, rank: 4, count: 1 },
    ];
    expect(totalFailed(task, 'score', scores)).toBe(4);
  });
});

describe('totalDidNotParticipate', () => {
  it('should return 0 when task is null', () => {
    expect(totalDidNotParticipate(null)).toBe(0);
  });

  it('should return 0 when task has no passMark', () => {
    const task = { finalScores: [{ score: 10 }] };
    expect(totalDidNotParticipate(task)).toBe(0);
  });

  it('should calculate total did not participate correctly', () => {
    const task = {
      passMark: 8,
      finalScores: [
        { score: 10 },
        { score: 9 },
        { score: 8 },
      ],
      applications: [
        { id: '1' },
        { id: '2' },
        { id: '3' },
        { id: '4' },
        { id: '5' },
      ],
    };
    expect(totalDidNotParticipate(task)).toBe(2);
  });

  it('should return 0 when all applications participated', () => {
    const task = {
      passMark: 8,
      finalScores: [
        { score: 10 },
        { score: 9 },
        { score: 8 },
      ],
      applications: [
        { id: '1' },
        { id: '2' },
        { id: '3' },
      ],
    };
    expect(totalDidNotParticipate(task)).toBe(0);
  });

  it('should handle case when task has no applications array', () => {
    const task = {
      passMark: 8,
      finalScores: [
        { score: 10 },
        { score: 9 },
      ],
      _stats: {
        totalApplications: 5,
      },
    };
    expect(totalDidNotParticipate(task)).toBe(3);
  });

  it('should return 0 when totalApplications is less than or equal to finalScores length', () => {
    const task = {
      passMark: 8,
      finalScores: [
        { score: 10 },
        { score: 9 },
        { score: 8 },
      ],
      _stats: {
        totalApplications: 2,
      },
    };
    expect(totalDidNotParticipate(task)).toBe(0);
  });
});

// Mock the downloadXLSX function
vi.mock('@jac-uk/jac-kit/helpers/export', () => ({
  downloadXLSX: vi.fn(),
}));

describe('downloadMeritList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should returns false for an invalid download type', () => {
    const result = downloadMeritList('Title', {}, {}, {}, 'invalid-type', 'filename');
    expect(result).toBe(false);
    expect(downloadXLSX).not.toHaveBeenCalled();
  });

  it('should call downloadXLSX with correct parameters for full download type', () => {
    const title = 'Test Title';
    const fileName = 'test-file';
    const task = { /* mock task object */ };
    const diversityData = { /* mock diversity data */ };

    downloadMeritList(title, {}, task, diversityData, DOWNLOAD_TYPES.full.value, fileName);

    expect(downloadXLSX).toHaveBeenCalledWith(
      expect.any(Array),
      {
        title: title,
        sheetName: DOWNLOAD_TYPES.full.sheetName,
        fileName: `${fileName}.xlsx`,
      }
    );
  });

  it('should call downloadXLSX with correct parameters for emp download type', () => {
    const title = 'Test Title';
    const fileName = 'test-file';
    const task = { /* mock task object */ };
    const diversityData = { /* mock diversity data */ };

    downloadMeritList(title, {}, task, diversityData, DOWNLOAD_TYPES.emp.value, fileName);

    expect(downloadXLSX).toHaveBeenCalledWith(
      expect.any(Array),
      {
        title: title,
        sheetName: DOWNLOAD_TYPES.emp.sheetName,
        fileName: `${fileName}.xlsx`,
      }
    );

  });

  it('should return true for valid download types', () => {
    const result1 = downloadMeritList('Title', {}, {}, {}, DOWNLOAD_TYPES.full.value, 'filename');
    const result2 = downloadMeritList('Title', {}, {}, {}, DOWNLOAD_TYPES.emp.value, 'filename');

    expect(result1).toBe(true);
    expect(result2).toBe(true);
  });

  const mockDiversityData = {
    '001': {
      d: [
        DIVERSITY_CHARACTERISTICS.GENDER_FEMALE,
        DIVERSITY_CHARACTERISTICS.ETHNICITY_BAME,
        DIVERSITY_CHARACTERISTICS.DISABILITY_DISABLED,
      ],
    },
    '002': {
      d: [
        DIVERSITY_CHARACTERISTICS.PROFESSION_SOLICITOR,
      ],
    },
  };

  it('should generate correct headers for full download type', () => {
    const title = 'Test Title';
    const fileName = 'test-file';
    const task = { /* mock task object */ };
    const diversityData = { /* mock diversity data */ };

    downloadMeritList(title, {}, task, diversityData, DOWNLOAD_TYPES.full.value, fileName);

    expect(downloadXLSX).toHaveBeenCalledWith(
      [
        [
          'Ref',
          'Full name',
          'Email',
          'Rank',
          'Score',
          'Female',
          'Ethnic Minority',
          'Solicitor',
          'Disability',
          'Outcome',
        ],
      ],
      {
        title: title,
        sheetName: DOWNLOAD_TYPES.full.sheetName,
        fileName: `${fileName}.xlsx`,
      }
    );

  });

  it('should generate correct headers for emp download type', () => {
    const title = 'Test Title';
    const fileName = 'test-file';
    const task = { /* mock task object */ };
    const diversityData = { /* mock diversity data */ };

    downloadMeritList(title, {}, task, diversityData, DOWNLOAD_TYPES.emp.value, fileName);

    expect(downloadXLSX).toHaveBeenCalledWith([
        [
          'Ref',
          'Rank',
          'Score',
          'Female',
          'Ethnic Minority',
          'Solicitor',
          'Disability',
          'Outcome',
        ],
      ],
      {
        title: title,
        sheetName: DOWNLOAD_TYPES.emp.sheetName,
        fileName: `${fileName}.xlsx`,
      }
    );

  });

  it('should generate correct data for scoreData', () => {
    const title = 'Test Title';
    const fileName = 'test-file';
    const mockTask = {
      applications: [
        { id: '1', 'status': 'applied' },
        { id: '2', 'status': 'applied' },
      ],
      finalScores: [
        { id: '1', ref: 'ref-001', score: 10, rank: 1, fullName: 'John Doe', email: 'john@example.com', pass: true },
        { id: '2', ref: 'ref-002', score: 9, rank: 2, fullName: 'Jane Smith', email: 'jane@example.com', pass: false },
      ],
    };

    downloadMeritList(title, {}, mockTask, mockDiversityData, DOWNLOAD_TYPES.full.value, fileName);

    expect(downloadXLSX).toHaveBeenCalledWith(
      [
        [
          'Ref',
          'Full name',
          'Email',
          'Rank',
          'Score',
          'Female',
          'Ethnic Minority',
          'Solicitor',
          'Disability',
          'Outcome',
        ],
        [
          'ref-001',
          'John Doe',
          'john@example.com',
          1,
          10,
          'Yes',
          'Yes',
          'No',
          'Yes',
          'Pass',
        ],
        [
          'ref-002',
          'Jane Smith',
          'jane@example.com',
          2,
          9,
          'No',
          'No',
          'Yes',
          'No',
          'Fail',
        ],
      ],
      {
        title: title,
        sheetName: DOWNLOAD_TYPES.full.sheetName,
        fileName: `${fileName}.xlsx`,
      }
    );
  });

  it('should generate correct data for didNotTake', () => {
    const title = 'Test Title';
    const fileName = 'test-file';
    const mockDidNotTake = { didNotTake: [
        { ref: 'ref-001', fullName: 'Alice Johnson', email: 'alice@example.com', status: 'applied' },
      ],
    };

    downloadMeritList(title, mockDidNotTake, {}, mockDiversityData, DOWNLOAD_TYPES.full.value, fileName);

    expect(downloadXLSX).toHaveBeenCalledWith(
      [
        [
          'Ref',
          'Full name',
          'Email',
          'Rank',
          'Score',
          'Female',
          'Ethnic Minority',
          'Solicitor',
          'Disability',
          'Outcome',
        ],
        [
          'ref-001',
          'Alice Johnson',
          'alice@example.com',
          'n/a',
          'n/a',
          'Yes',
          'Yes',
          'No',
          'Yes',
          'Qualifying test not started',
        ],
      ],
      {
        title: title,
        sheetName: DOWNLOAD_TYPES.full.sheetName,
        fileName: `${fileName}.xlsx`,
      }
    );
  });

  it('should generate correct data for failed', () => {
    const title = 'Test Title';
    const fileName = 'test-file';

    const mockFailed = {
      failed: [{ ref: 'ref-002', fullName: 'Bob Williams', email: 'bob@example.com', status: 'applied' }],
    };

    downloadMeritList(title, mockFailed, {}, mockDiversityData, DOWNLOAD_TYPES.full.value, fileName);

    expect(downloadXLSX).toHaveBeenCalledWith(
      [
        [
          'Ref',
          'Full name',
          'Email',
          'Rank',
          'Score',
          'Female',
          'Ethnic Minority',
          'Solicitor',
          'Disability',
          'Outcome',
        ],
        [
          'ref-002',
          'Bob Williams',
          'bob@example.com',
          'n/a',
          'n/a',
          'No',
          'No',
          'Yes',
          'No',
          'Fail',
        ],
      ],
      {
        title: title,
        sheetName: DOWNLOAD_TYPES.full.sheetName,
        fileName: `${fileName}.xlsx`,
      }
    );
  });

  it('should generate correct data for withdrawn before QT applications', () => {
    const title = 'Test Title';
    const fileName = 'test-file';

    const mockWithdrawnBeforeQT = {
      withdrawnBeforeQT: [{ ref: 'ref-002', fullName: 'Bob Williams', email: 'bob@example.com', status: 'withdrawn' }],
    };

    downloadMeritList(title, mockWithdrawnBeforeQT, {}, mockDiversityData, DOWNLOAD_TYPES.full.value, fileName);

    expect(downloadXLSX).toHaveBeenCalledWith(
      [
        [
          'Ref',
          'Full name',
          'Email',
          'Rank',
          'Score',
          'Female',
          'Ethnic Minority',
          'Solicitor',
          'Disability',
          'Outcome',
        ],
        [
          'ref-002',
          'Bob Williams',
          'bob@example.com',
          'n/a',
          'n/a',
          'No',
          'No',
          'Yes',
          'No',
          'Withdrawn',
        ],
      ],
      {
        title: title,
        sheetName: DOWNLOAD_TYPES.full.sheetName,
        fileName: `${fileName}.xlsx`,
      }
    );
  });

  it('should handle QUALIFYING_TEST type correctly', () => {
    const title = 'Test Title';
    const fileName = 'test-file';

    const mockTask = {
      finalScores: [
        {
          id: '1',
          ref: 'ref-001',
          fullName: 'John Doe',
          email: 'john@example.com',
          scoreSheet: {
            qualifyingTest: {
              SJ: { score: 80, percent: 80, zScore: 1.5 },
              CA: { score: 90, percent: 90, zScore: 2.0 },
            },
          },
          zScore: 1.75,
        },
      ],
    };

    // TODO: confirm the qt logic
    downloadMeritList(title, [], [], {}, mockTask, TASK_TYPE.QUALIFYING_TEST, fileName);
  });
});

describe('getDownloadTypes', () => {
  // TODO: confirm if task affect the download types
  it('should return the correct download types', () => {
    expect(getDownloadTypes({})).toEqual(Object.values(DOWNLOAD_TYPES));
  });
});
