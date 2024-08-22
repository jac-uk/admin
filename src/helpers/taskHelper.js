/*eslint func-style: ["error", "declaration"]*/

import clone from 'clone';

export {
  MARKING_TYPE,
  GRADES,
  GRADE_VALUES,
  getMarkingType,
  getCompleteScoreSheet,
  getScoreSheetTotal,
  markingScheme2ScoreSheet,
  isScoreSheetComplete,
  markingScheme2Columns,
  markingScheme2ColumnHeaders,
  getScoreSheetItemTotal
};

const MARKING_TYPE = {
  GROUP: {
    value: 'group',
    label: 'Group',
    excludeFromScore: true,
  },
  SCORE: {
    value: 'score',
    label: 'Score',
    excludeFromScore: true,
  },
  NUMBER: {
    value: 'number',
    label: 'Number',
    excludeFromScore: false,
  },
  GRADE: {
    value: 'grade',
    label: 'Grade',
    excludeFromScore: false,
  },
  YES_NO: {
    value: 'yesNo',
    label: 'Yes / No',
    excludeFromScore: true,
  },
  PASS_FAIL: {
    value: 'passFail',
    label: 'Pass / Fail',
    excludeFromScore: true,
  },
  LEVEL: {
    value: 'level',
    label: 'None / Basic / Medium / High',
    excludeFromScore: true,
  },
};

const GRADES = ['A', 'B', 'C', 'D'];
const GRADE_VALUES = {
  'A': 4,
  'B': 3,
  'C': 2,
  'D': 1,
};

function getMarkingType(type) {
  const markingType = Object.values(MARKING_TYPE).find(item => item.value === type);
  if (markingType) return markingType;
  return { value: null, label: null };
}

function getCompleteScoreSheet(task) {
  const emptyScoreSheet = {};
  task.applications.forEach(application => {
    emptyScoreSheet[application.id] = clone(task.emptyScoreSheet);
  });
  const populatedScoreSheet = task.scoreSheet ? { ...emptyScoreSheet, ...task.scoreSheet } : { ...emptyScoreSheet };
  return populatedScoreSheet;
}

function getScoreSheetTotal(markingScheme, scoreSheet) {
  let score = 0;
  if (!markingScheme) return score;
  if (!scoreSheet) return score;
  markingScheme.forEach(item => {
    if (item.type === MARKING_TYPE.GROUP.value) {
      item.children.forEach(child => {
        score += getScoreSheetItemTotal(child, scoreSheet[item.ref]);
      });
    } else {
      score += getScoreSheetItemTotal(item, scoreSheet);
    }
  });
  return score;
}

function getScoreSheetItemTotal(item, scoreSheet) {
  if (!item.excludeFromScore) {
    switch (item.type) {
    case MARKING_TYPE.GRADE.value:
      if (scoreSheet[item.ref] && GRADE_VALUES[scoreSheet[item.ref]]) {
        return GRADE_VALUES[scoreSheet[item.ref]];
      }
      break;
    case MARKING_TYPE.SCORE.value:
      if (scoreSheet[item.ref]) {
        console.log('scoreSheet[item.ref].score', scoreSheet[item.ref].score);
        return parseFloat(scoreSheet[item.ref].score);
      }
      break;
    case MARKING_TYPE.NUMBER.value:
      if (scoreSheet[item.ref]) {
        return parseFloat(scoreSheet[item.ref]);
      }
      break;
    }
  }
  return 0;
}

function markingScheme2ScoreSheet(markingScheme) {
  /**
   * e.g.
   * markingScheme: [
   *  type: 'group'|'number'|'grade'
   *  ref: String
   *  children: []
   * ]
   */
  const scoreSheet = {};
  markingScheme.forEach(item => {
    if (item.type === 'group') {
      scoreSheet[item.ref] = {};
      item.children.forEach(child => {
        scoreSheet[item.ref][child.ref] = '';
      });
    } else {
      scoreSheet[item.ref] = '';
    }
  });
  return scoreSheet;
}

function isScoreSheetComplete(markingScheme, scoreSheet) {
  if (!markingScheme) return false;
  if (!scoreSheet) return false;
  let isComplete = true;
  markingScheme.forEach(item => {
    if (item.type === MARKING_TYPE.GROUP.value) {
      item.children.forEach(child => {
        if (!scoreSheet[item.ref][child.ref]) {
          isComplete = false;
        }
      });
    } else {
      if (!scoreSheet[item.ref]) {
        isComplete = false;
      }
    }
  });
  return isComplete;
}

function markingScheme2Columns(markingScheme, editable = false) {
  const columns = [];
  if (!markingScheme) return columns;
  markingScheme.forEach(item => {
    if (item.type === 'group') {
      item.children.forEach(child => columns.push({ parent: item.ref, ...child, editable: editable }));
    } else {
      columns.push({ ...item, editable: editable });
    }
  });
  return columns;
}

function markingScheme2ColumnHeaders(markingScheme) {
  const headers = [];
  if (!markingScheme) return headers;
  let columns = 0;
  markingScheme.forEach(item => {
    if (item.type === 'group') {
      if (columns > 0) {
        headers.push({
          ref: '',
          colspan: columns,
        });
        columns = 0;
      }
      headers.push({
        ref: item.ref,
        colspan: item.children.length,
      });
    } else {
      columns += 1;
    }
  });
  return headers;
}
