import {
  OUTCOME,
  OVERRIDE_REASON,
  // DOWNLOAD_TYPES,
  getOverrideReasons,
  isPass,
  isPassingScore,
  getOverride
  // getDefaultOutcome,
  // getCurrentOutcome,
  // getNewOutcome,
  // scoreType,
  // scores,
  // scoreData,
  // totalApplications,
  // totalPassed,
  // totalFailed,
  // totalDidNotParticipate,
  // downloadMeritList,
  // getDownloadTypes
} from '@/views/Exercise/Tasks/Task/Finalised/meritListHelper.js';
import { describe } from 'vitest';

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
