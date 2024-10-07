/*eslint func-style: ["error", "declaration"]*/

import clone from 'clone';
import { DIVERSITY_CHARACTERISTICS, hasDiversityCharacteristic } from './diversityCharacteristics.js';

export {
  SCORESHEET_TOOLS,
  MARKING_TYPE,
  ADDITIONAL_COLUMNS,
  GRADES,
  GRADE_VALUES,
  getMarkingType,
  getAdditionalColumns,
  getAdditionalColumn,
  getCompleteScoreSheet,
  getScoreSheetTotal,
  markingScheme2ScoreSheet,
  isScoreSheetComplete,
  scoreSheetRowsAddRank,
  scoreSheetRowsAddDiversity,
  markingScheme2Columns,
  markingScheme2ColumnHeaders,
  markingTypeHasOptions,
  markingTypeGetOptions,
  getScoreSheetItemTotal
};

const SCORESHEET_TOOLS = {
  FIND: 'find',
  COPY: 'copy',
  PASTE: 'paste',
  SCORE: 'score',
  DIVERSITY: 'diversity',
};

const MARKING_TYPE = {
  GROUP: {
    value: 'group',
    label: 'Group',
    includeInScore: false,
  },
  SCORE: {
    value: 'score',
    label: 'Score',
    includeInScore: true,
  },
  NUMBER: {
    value: 'number',
    label: 'Number',
    includeInScore: false,
  },
  GRADE: {
    value: 'grade',
    label: 'Grade',
    options: [
      { value: 'A', label: 'A', score: 4 },
      { value: 'B', label: 'B', score: 3 },
      { value: 'C', label: 'C', score: 2 },
      { value: 'D', label: 'D', score: 1 },
    ],
    includeInScore: true,
  },
  YES_NO: {
    value: 'yesNo',
    label: 'Yes / No',
    options: [
      { value: 'TRUE', label: 'Yes' },
      { value: 'FALSE', label: 'No' },
    ],
    includeInScore: false,
  },
  PASS_FAIL: {
    value: 'passFail',
    label: 'Pass / Fail',
    options: [
      { value: 'TRUE', label: 'Pass' },
      { value: 'FALSE', label: 'Fail' },
    ],
    includeInScore: false,
  },
  LEVEL: {
    value: 'level',
    label: 'None / Basic / Medium / High',
    options: [
      { value: 'None', label: 'None' },
      { value: 'Basic', label: 'Basic' },
      { value: 'Medium', label: 'Medium' },
      { value: 'High', label: 'High' },
    ],
    includeInScore: false,
  },
};

const ADDITIONAL_COLUMNS = {
  WELSH_ADMIN: {
    value: 'welsh-admin',
    label: 'Welsh Administration Questions',
    config: { ref: 'welsh-admin', type: MARKING_TYPE.LEVEL.value, includeInScore: false },
  },
  WELSH_LANGUAGE: {
    value: 'welsh-language',
    label: 'Welsh Language',
    config: { ref: 'welsh-language', type: MARKING_TYPE.PASS_FAIL.value, includeInScore: false },
  },
  ASC_MET: {
    value: 'asc-met',
    label: 'ASC Met',
    config: { ref: 'asc-met', type: MARKING_TYPE.YES_NO.value, includeInScore: false },
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

function getAdditionalColumns() {
  return Object.values(ADDITIONAL_COLUMNS);
}

function getAdditionalColumn(ref) {
  const column = Object.values(ADDITIONAL_COLUMNS).find(item => item.value === ref);
  if (column) return column;
  return { value: null, label: null, config: null };
}

function markingTypeHasOptions(type) {
  const markingType = getMarkingType(type);
  return markingType.options && markingType.options.length ? true : false;
}

function markingTypeGetOptions(type) {
  const markingType = getMarkingType(type);
  return markingTypeHasOptions(type) ? markingType.options : [];
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
  if (item.includeInScore) {
    switch (item.type) {
    case MARKING_TYPE.GRADE.value:
      if (scoreSheet[item.ref] && GRADE_VALUES[scoreSheet[item.ref]]) {
        return GRADE_VALUES[scoreSheet[item.ref]];
      }
      break;
    case MARKING_TYPE.SCORE.value:
      if (scoreSheet[item.ref]) {
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

function scoreSheetRowsAddRank(scoreSheetData) {
  scoreSheetData.sort((a, b) => b.score - a.score);
  let currentScore = null;
  let countAtCurrentScore = 0;
  let currentRank = 1;
  scoreSheetData.forEach(row => {
    if (currentScore === null) {
      currentScore = row.score;
    }
    if (row.score === currentScore) {
      countAtCurrentScore += 1;
    } else {
      currentScore = row.score;
      currentRank += countAtCurrentScore;
      countAtCurrentScore = 1;
    }
    row.rank = currentRank;
  });
}

function scoreSheetRowsAddDiversity(scoreSheetData, diversityData) {
  scoreSheetData.forEach(row => {
    const ref = row.referenceNumber.split('-')[1];
    if (diversityData[ref]) {
      row.diversity = {
        female: hasDiversityCharacteristic(diversityData[ref], DIVERSITY_CHARACTERISTICS.GENDER_FEMALE),
        bame: hasDiversityCharacteristic(diversityData[ref], DIVERSITY_CHARACTERISTICS.ETHNICITY_BAME),
        solicitor: hasDiversityCharacteristic(diversityData[ref], DIVERSITY_CHARACTERISTICS.PROFESSION_SOLICITOR),
        disability: hasDiversityCharacteristic(diversityData[ref], DIVERSITY_CHARACTERISTICS.DISABILITY_DISABLED),
      };
    } else {
      row.diversity = {};
    }
  });
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
  let numGroups = markingScheme.filter(item => item.type === 'group').length;
  markingScheme.forEach(item => {
    if (item.type === 'group') {
      item.children.forEach(child => {
        const title = (numGroups > 1) ? `${item.ref}.${child.ref}` : child.ref;
        columns.push({ parent: item.ref, ...child, title: title, editable: editable });
      });
    } else {
      columns.push({ ...item, title: item.ref, editable: editable });
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
      // TODO: confirm if different type need to add header as well
      columns += 1;
    }
  });
  return headers;
}
