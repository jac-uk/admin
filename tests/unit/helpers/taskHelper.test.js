import {
  MARKING_TYPE,
  GRADE_VALUES,
  getMarkingType,
  getCompleteScoreSheet,
  getScoreSheetTotal,
  getScoreSheetItemTotal,
  markingScheme2ScoreSheet,
  isScoreSheetComplete,
  markingScheme2Columns,
  markingScheme2ColumnHeaders
} from '@/helpers/taskHelper';

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
  it('should return 0 for empty marking scheme or score sheet', () => {
    expect(getScoreSheetTotal(null, {})).toBe(0);
    expect(getScoreSheetTotal([], null)).toBe(0);
    expect(getScoreSheetTotal([], {})).toBe(0);
  });

  it('should calculate total correctly for number type', () => {
    const markingScheme = [
      { ref: 'num1', type: MARKING_TYPE.NUMBER.value },
      { ref: 'num2', type: MARKING_TYPE.NUMBER.value },
    ];
    const scoreSheet = {
      num1: '5',
      num2: '3',
    };
    expect(getScoreSheetTotal(markingScheme, scoreSheet)).toBe(8);
  });

  it('should calculate total correctly for grade type', () => {
    const markingScheme = [
      { ref: 'grade1', type: MARKING_TYPE.GRADE.value },
      { ref: 'grade2', type: MARKING_TYPE.GRADE.value },
    ];
    const scoreSheet = {
      grade1: 'A',
      grade2: 'C',
    };
    expect(getScoreSheetTotal(markingScheme, scoreSheet)).toBe(6); // A(4) + C(2)
  });

  it('should calculate total correctly for score type', () => {
    const markingScheme = [
      { ref: 'score1', type: MARKING_TYPE.SCORE.value },
      { ref: 'score2', type: MARKING_TYPE.SCORE.value },
    ];
    const scoreSheet = {
      score1: { score: '4.5' },
      score2: { score: '3.2' },
    };
    expect(getScoreSheetTotal(markingScheme, scoreSheet)).toBe(7.7);
  });

  it('should ignore items with excludeFromScore set to true', () => {
    const markingScheme = [
      { ref: 'num1', type: MARKING_TYPE.NUMBER.value },
      { ref: 'num2', type: MARKING_TYPE.NUMBER.value, excludeFromScore: true },
    ];
    const scoreSheet = {
      num1: '5',
      num2: '3',
    };
    expect(getScoreSheetTotal(markingScheme, scoreSheet)).toBe(5);
  });

  it('should handle group type correctly', () => {
    const markingScheme = [
      {
        type: MARKING_TYPE.GROUP.value,
        ref: 'group1',
        children: [
          { ref: 'child1', type: MARKING_TYPE.NUMBER.value },
          { ref: 'child2', type: MARKING_TYPE.NUMBER.value },
        ],
      },
      { ref: 'num1', type: MARKING_TYPE.NUMBER.value },
    ];
    const scoreSheet = {
      group1: {
        child1: '2',
        child2: '3',
      },
      num1: '4',
    };
    expect(getScoreSheetTotal(markingScheme, scoreSheet)).toBe(9);
  });

  it('should handle mixed types correctly', () => {
    const markingScheme = [
      { ref: 'num1', type: MARKING_TYPE.NUMBER.value },
      { ref: 'grade1', type: MARKING_TYPE.GRADE.value },
      { ref: 'score1', type: MARKING_TYPE.SCORE.value },
      { ref: 'yesNo1', type: MARKING_TYPE.YES_NO.value },
    ];
    const scoreSheet = {
      num1: '5',
      grade1: 'B',
      score1: { score: '2.5' },
      yesNo1: 'Yes',
    };
    expect(getScoreSheetTotal(markingScheme, scoreSheet)).toBe(10.5); // 5 + 3 + 2.5 + 0
  });
});

describe('getScoreSheetItemTotal', () => {
  it('should return 0 when item is excluded from score', () => {
    const item = { ref: 'test', type: MARKING_TYPE.NUMBER.value, excludeFromScore: true };
    const scoreSheet = { test: '5' };
    expect(getScoreSheetItemTotal(item, scoreSheet)).toBe(0);
  });

  it('should calculate grade type correctly', () => {
    const item = { ref: 'grade', type: MARKING_TYPE.GRADE.value };
    const scoreSheet = { grade: 'A' };
    expect(getScoreSheetItemTotal(item, scoreSheet)).toBe(GRADE_VALUES['A']);
  });

  it('should return 0 for invalid grade', () => {
    const item = { ref: 'grade', type: MARKING_TYPE.GRADE.value };
    const scoreSheet = { grade: 'X' };
    expect(getScoreSheetItemTotal(item, scoreSheet)).toBe(0);
  });

  it('should calculate score type correctly', () => {
    const item = { ref: 'score', type: MARKING_TYPE.SCORE.value };
    const scoreSheet = { score: { score: '4.5' } };
    expect(getScoreSheetItemTotal(item, scoreSheet)).toBe(4.5);
  });

  it('should calculate number type correctly', () => {
    const item = { ref: 'number', type: MARKING_TYPE.NUMBER.value };
    const scoreSheet = { number: '3.7' };
    expect(getScoreSheetItemTotal(item, scoreSheet)).toBe(3.7);
  });

  it('should return 0 for unsupported types', () => {
    const item = { ref: 'yesNo', type: MARKING_TYPE.YES_NO.value };
    const scoreSheet = { yesNo: 'Yes' };
    expect(getScoreSheetItemTotal(item, scoreSheet)).toBe(0);
  });

  it('should return 0 when scoreSheet does not contain the item ref', () => {
    const item = { ref: 'missing', type: MARKING_TYPE.NUMBER.value };
    const scoreSheet = { other: '5' };
    expect(getScoreSheetItemTotal(item, scoreSheet)).toBe(0);
  });

  it('should handle empty or null scoreSheet values', () => {
    const item = { ref: 'test', type: MARKING_TYPE.NUMBER.value };
    expect(getScoreSheetItemTotal(item, { test: '' })).toBe(0);
    expect(getScoreSheetItemTotal(item, { test: null })).toBe(0);
  });
});

describe('markingScheme2ScoreSheet', () => {
  it('should return an empty object for an empty marking scheme', () => {
    expect(markingScheme2ScoreSheet([])).toEqual({});
  });

  it('should correctly convert a simple marking scheme', () => {
    const markingScheme = [
      { type: MARKING_TYPE.NUMBER.value, ref: 'num1' },
      { type: MARKING_TYPE.GRADE.value, ref: 'grade1' },
    ];
    const expected = {
      num1: '',
      grade1: '',
    };
    expect(markingScheme2ScoreSheet(markingScheme)).toEqual(expected);
  });

  it('should correctly handle group type', () => {
    const markingScheme = [
      {
        type: MARKING_TYPE.GROUP.value,
        ref: 'group1',
        children: [
          { type: MARKING_TYPE.NUMBER.value, ref: 'child1' },
          { type: MARKING_TYPE.GRADE.value, ref: 'child2' },
        ],
      },
    ];
    const expected = {
      group1: {
        child1: '',
        child2: '',
      },
    };
    expect(markingScheme2ScoreSheet(markingScheme)).toEqual(expected);
  });

  it('should handle mixed types correctly', () => {
    const markingScheme = [
      { type: MARKING_TYPE.NUMBER.value, ref: 'num1' },
      {
        type: MARKING_TYPE.GROUP.value,
        ref: 'group1',
        children: [
          { type: MARKING_TYPE.GRADE.value, ref: 'child1' },
          { type: MARKING_TYPE.YES_NO.value, ref: 'child2' },
        ],
      },
      { type: MARKING_TYPE.SCORE.value, ref: 'score1' },
    ];
    const expected = {
      num1: '',
      group1: {
        child1: '',
        child2: '',
      },
      score1: '',
    };
    expect(markingScheme2ScoreSheet(markingScheme)).toEqual(expected);
  });

  it('should handle multiple groups', () => {
    const markingScheme = [
      {
        type: MARKING_TYPE.GROUP.value,
        ref: 'group1',
        children: [
          { type: MARKING_TYPE.NUMBER.value, ref: 'child1' },
        ],
      },
      {
        type: MARKING_TYPE.GROUP.value,
        ref: 'group2',
        children: [
          { type: MARKING_TYPE.GRADE.value, ref: 'child2' },
        ],
      },
    ];
    const expected = {
      group1: {
        child1: '',
      },
      group2: {
        child2: '',
      },
    };
    expect(markingScheme2ScoreSheet(markingScheme)).toEqual(expected);
  });

  it('should ignore unknown types', () => {
    const markingScheme = [
      { type: 'unknown', ref: 'unknown1' },
      { type: MARKING_TYPE.NUMBER.value, ref: 'num1' },
    ];
    const expected = {
      unknown1: '',
      num1: '',
    };
    expect(markingScheme2ScoreSheet(markingScheme)).toEqual(expected);
  });
});

describe('isScoreSheetComplete', () => {
  it('should return false when markingScheme is null or undefined', () => {
    expect(isScoreSheetComplete(null, {})).toBe(false);
    expect(isScoreSheetComplete(undefined, {})).toBe(false);
  });

  it('should return false when scoreSheet is null or undefined', () => {
    const markingScheme = [{ type: MARKING_TYPE.NUMBER.value, ref: 'num1' }];
    expect(isScoreSheetComplete(markingScheme, null)).toBe(false);
    expect(isScoreSheetComplete(markingScheme, undefined)).toBe(false);
  });

  it('should return true when all items in markingScheme are filled in scoreSheet', () => {
    const markingScheme = [
      { type: MARKING_TYPE.NUMBER.value, ref: 'num1' },
      { type: MARKING_TYPE.GRADE.value, ref: 'grade1' },
    ];
    const scoreSheet = {
      num1: '5',
      grade1: 'A',
    };
    expect(isScoreSheetComplete(markingScheme, scoreSheet)).toBe(true);
  });

  it('should return false when any item in markingScheme is not filled in scoreSheet', () => {
    const markingScheme = [
      { type: MARKING_TYPE.NUMBER.value, ref: 'num1' },
      { type: MARKING_TYPE.GRADE.value, ref: 'grade1' },
    ];
    const scoreSheet = {
      num1: '5',
      grade1: '',
    };
    expect(isScoreSheetComplete(markingScheme, scoreSheet)).toBe(false);
  });

  it('should handle group type correctly', () => {
    const markingScheme = [
      {
        type: MARKING_TYPE.GROUP.value,
        ref: 'group1',
        children: [
          { type: MARKING_TYPE.NUMBER.value, ref: 'child1' },
          { type: MARKING_TYPE.GRADE.value, ref: 'child2' },
        ],
      },
    ];
    const completeScoreSheet = {
      group1: {
        child1: '5',
        child2: 'B',
      },
    };
    const incompleteScoreSheet = {
      group1: {
        child1: '5',
        child2: '',
      },
    };
    expect(isScoreSheetComplete(markingScheme, completeScoreSheet)).toBe(true);
    expect(isScoreSheetComplete(markingScheme, incompleteScoreSheet)).toBe(false);
  });

  it('should handle mixed types correctly', () => {
    const markingScheme = [
      { type: MARKING_TYPE.NUMBER.value, ref: 'num1' },
      {
        type: MARKING_TYPE.GROUP.value,
        ref: 'group1',
        children: [
          { type: MARKING_TYPE.GRADE.value, ref: 'child1' },
          { type: MARKING_TYPE.YES_NO.value, ref: 'child2' },
        ],
      },
      { type: MARKING_TYPE.SCORE.value, ref: 'score1' },
    ];
    const completeScoreSheet = {
      num1: '5',
      group1: {
        child1: 'A',
        child2: 'Yes',
      },
      score1: '7.5',
    };
    const incompleteScoreSheet = {
      num1: '5',
      group1: {
        child1: 'A',
        child2: '',
      },
      score1: '7.5',
    };
    expect(isScoreSheetComplete(markingScheme, completeScoreSheet)).toBe(true);
    expect(isScoreSheetComplete(markingScheme, incompleteScoreSheet)).toBe(false);
  });
});

describe('markingScheme2Columns', () => {
  it('should return an empty array for null or empty marking scheme', () => {
    expect(markingScheme2Columns(null)).toEqual([]);
    expect(markingScheme2Columns([])).toEqual([]);
  });

  it('should convert simple marking scheme to columns', () => {
    const markingScheme = [
      { type: MARKING_TYPE.NUMBER.value, ref: 'num1', label: 'Number 1' },
      { type: MARKING_TYPE.GRADE.value, ref: 'grade1', label: 'Grade 1' },
    ];
    const expected = [
      { type: MARKING_TYPE.NUMBER.value, ref: 'num1', label: 'Number 1', editable: false },
      { type: MARKING_TYPE.GRADE.value, ref: 'grade1', label: 'Grade 1', editable: false },
    ];
    expect(markingScheme2Columns(markingScheme)).toEqual(expected);
  });

  it('should handle group type correctly', () => {
    const markingScheme = [
      {
        type: MARKING_TYPE.GROUP.value,
        ref: 'group1',
        label: 'Group 1',
        children: [
          { type: MARKING_TYPE.NUMBER.value, ref: 'child1', label: 'Child 1' },
          { type: MARKING_TYPE.GRADE.value, ref: 'child2', label: 'Child 2' },
        ],
      },
    ];
    const expected = [
      { parent: 'group1', type: MARKING_TYPE.NUMBER.value, ref: 'child1', label: 'Child 1', editable: false },
      { parent: 'group1', type: MARKING_TYPE.GRADE.value, ref: 'child2', label: 'Child 2', editable: false },
    ];
    expect(markingScheme2Columns(markingScheme)).toEqual(expected);
  });

  it('should handle mixed types correctly', () => {
    const markingScheme = [
      { type: MARKING_TYPE.NUMBER.value, ref: 'num1', label: 'Number 1' },
      {
        type: MARKING_TYPE.GROUP.value,
        ref: 'group1',
        label: 'Group 1',
        children: [
          { type: MARKING_TYPE.GRADE.value, ref: 'child1', label: 'Child 1' },
          { type: MARKING_TYPE.YES_NO.value, ref: 'child2', label: 'Child 2' },
        ],
      },
      { type: MARKING_TYPE.SCORE.value, ref: 'score1', label: 'Score 1' },
    ];
    const expected = [
      { type: MARKING_TYPE.NUMBER.value, ref: 'num1', label: 'Number 1', editable: false },
      { parent: 'group1', type: MARKING_TYPE.GRADE.value, ref: 'child1', label: 'Child 1', editable: false },
      { parent: 'group1', type: MARKING_TYPE.YES_NO.value, ref: 'child2', label: 'Child 2', editable: false },
      { type: MARKING_TYPE.SCORE.value, ref: 'score1', label: 'Score 1', editable: false },
    ];
    expect(markingScheme2Columns(markingScheme)).toEqual(expected);
  });

  it('should set editable to true when specified', () => {
    const markingScheme = [
      { type: MARKING_TYPE.NUMBER.value, ref: 'num1', label: 'Number 1' },
      {
        type: MARKING_TYPE.GROUP.value,
        ref: 'group1',
        label: 'Group 1',
        children: [
          { type: MARKING_TYPE.GRADE.value, ref: 'child1', label: 'Child 1' },
        ],
      },
    ];
    const expected = [
      { type: MARKING_TYPE.NUMBER.value, ref: 'num1', label: 'Number 1', editable: true },
      { parent: 'group1', type: MARKING_TYPE.GRADE.value, ref: 'child1', label: 'Child 1', editable: true },
    ];
    expect(markingScheme2Columns(markingScheme, true)).toEqual(expected);
  });
});

describe('markingScheme2ColumnHeaders', () => {
  it('should return an empty array for null or empty marking scheme', () => {
    expect(markingScheme2ColumnHeaders(null)).toEqual([]);
    expect(markingScheme2ColumnHeaders([])).toEqual([]);
  });

  it('should generate correct headers for a simple marking scheme', () => {
    const markingScheme = [
      { type: MARKING_TYPE.NUMBER.value, ref: 'num1' },
      { type: MARKING_TYPE.GRADE.value, ref: 'grade1' },
      { type: MARKING_TYPE.SCORE.value, ref: 'score1' },
    ];
    const expected = [];
    // TODO: confirm if different type other than group need to add header
    expect(markingScheme2ColumnHeaders(markingScheme)).toEqual(expected);
  });

  it('should handle group type correctly', () => {
    const markingScheme = [
      {
        type: MARKING_TYPE.GROUP.value,
        ref: 'group1',
        children: [
          { type: MARKING_TYPE.NUMBER.value, ref: 'child1' },
          { type: MARKING_TYPE.GRADE.value, ref: 'child2' },
        ],
      },
    ];
    const expected = [
      { ref: 'group1', colspan: 2 },
    ];
    expect(markingScheme2ColumnHeaders(markingScheme)).toEqual(expected);
  });

  it('should handle mixed types correctly', () => {
    const markingScheme = [
      { type: MARKING_TYPE.NUMBER.value, ref: 'num1' },
      { type: MARKING_TYPE.GRADE.value, ref: 'grade1' },
      {
        type: MARKING_TYPE.GROUP.value,
        ref: 'group1',
        children: [
          { type: MARKING_TYPE.SCORE.value, ref: 'child1' },
          { type: MARKING_TYPE.YES_NO.value, ref: 'child2' },
        ],
      },
      { type: MARKING_TYPE.PASS_FAIL.value, ref: 'passfail1' },
    ];
    const expected = [
      { ref: '', colspan: 2 },
      { ref: 'group1', colspan: 2 },
    ];
    // TODO: confirm if different type other than group need to add header
    expect(markingScheme2ColumnHeaders(markingScheme)).toEqual(expected);
  });

  it('should handle multiple groups and non-group items', () => {
    const markingScheme = [
      { type: MARKING_TYPE.NUMBER.value, ref: 'num1' },
      {
        type: MARKING_TYPE.GROUP.value,
        ref: 'group1',
        children: [
          { type: MARKING_TYPE.GRADE.value, ref: 'child1' },
          { type: MARKING_TYPE.SCORE.value, ref: 'child2' },
        ],
      },
      { type: MARKING_TYPE.YES_NO.value, ref: 'yesno1' },
      {
        type: MARKING_TYPE.GROUP.value,
        ref: 'group2',
        children: [
          { type: MARKING_TYPE.PASS_FAIL.value, ref: 'child3' },
        ],
      },
    ];
    // TODO: confirm if different type other than group need to add header
    const expected = [
      { ref: '', colspan: 1 },
      { ref: 'group1', colspan: 2 },
      { ref: '', colspan: 1 },
      { ref: 'group2', colspan: 1 },
    ];

    expect(markingScheme2ColumnHeaders(markingScheme)).toEqual(expected);
  });
});
