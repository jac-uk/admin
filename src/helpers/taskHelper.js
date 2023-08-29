/*eslint func-style: ["error", "declaration"]*/

import { DIVERSITY_CHARACTERISTICS, hasDiversityCharacteristic } from '@/helpers/diversityCharacteristics';
import { downloadXLSX } from '@jac-uk/jac-kit/helpers/export';

export {
  MARKING_TYPE,
  GRADES,
  GRADE_VALUES,
  DOWNLOAD_TYPES,
  getScoreSheetTotal,
  markingScheme2ScoreSheet,
  isScoreSheetComplete,
  meritList,
  downloadMeritList,
  getDownloadTypes
};

const MARKING_TYPE = {
  GROUP: 'group',
  SCORE: 'score',
  NUMBER: 'number',
  GRADE: 'grade',
  BOOL: 'bool',
};
const GRADES = ['A', 'B', 'C', 'D'];
const GRADE_VALUES = {
  'A': 4,
  'B': 3,
  'C': 2,
  'D': 1,
};

const DOWNLOAD_TYPES = {
  emp: {
    name: 'EMP data only (can be shared with Commissioners)',
    value: 'emp',
    sheetName: 'EMP data - for Commissioners',
  },
  full: {
    name: 'All data (internal use only)',
    value: 'full',
    sheetName: 'All data - staff only',
  },
};

function getScoreSheetTotal(markingScheme, scoreSheet) {
  let score = 0;
  if (!markingScheme) return score;
  if (!scoreSheet) return score;
  markingScheme.forEach(item => {
    if (item.type === MARKING_TYPE.GROUP) {
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
    case MARKING_TYPE.GRADE:
      if (scoreSheet[item.ref] && GRADE_VALUES[scoreSheet[item.ref]]) {
        return GRADE_VALUES[scoreSheet[item.ref]];
      }
      break;
    case MARKING_TYPE.SCORE:
      if (scoreSheet[item.ref]) {
        return parseFloat(scoreSheet[item.ref].score);
      }
      break;
    case MARKING_TYPE.NUMBER:
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
    if (item.type === MARKING_TYPE.GROUP) {
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

function meritList(task) {
  if (!task.applications) return [];
  if (!task.finalScores) return [];
  const applicationData = {};
  task.applications.forEach(application => applicationData[application.id] = application);
  return task.finalScores.map(scoreData => {
    return {
      ...applicationData[scoreData.id],
      ...scoreData,
    };
  });
}

function downloadMeritList(didNotTake, failed, task, diversityData, type, fileName) {
  switch (type) {
  case DOWNLOAD_TYPES.full.value:
  case DOWNLOAD_TYPES.emp.value:
    downloadXLSX(
      xlsxData(didNotTake, failed, task, diversityData, type),
      {
        title: 'QT Merit List',
        sheetName: DOWNLOAD_TYPES[type].sheetName,
        fileName: `${fileName}.xlsx`,
      }
    );
    return true;
  default:
    return false;
  }
}

function xlsxData(didNotTake, failed, task, diversityData, type) {  // currently only for QTs
  const rows = [];
  const headers = [];
  headers.push('Ref');
  if (type === DOWNLOAD_TYPES.full.value) {
    headers.push('Full name');
    headers.push('Email');
    headers.push('SJT score');
    headers.push('SJT %');
    headers.push('CAT score');
    headers.push('CAT %');
    headers.push('Z_SJT');
    headers.push('Z_CAT');
  }
  headers.push('Z_Overall');
  headers.push('Rank');
  headers.push('Notes');
  headers.push('Outcome');
  headers.push('Female');
  headers.push('Ethnic minority');
  headers.push('Solicitor');
  headers.push('Disabled');
  rows.push(headers);
  meritList(task).forEach(item => {
    const row = [];
    row.push(item.ref);
    if (type === DOWNLOAD_TYPES.full.value) {
      row.push(item.fullName);
      row.push(item.email);
      row.push(item.scoreSheet.qualifyingTest.SJ.score);
      row.push(item.scoreSheet.qualifyingTest.SJ.percent);
      row.push(item.scoreSheet.qualifyingTest.CA.score);      
      row.push(item.scoreSheet.qualifyingTest.CA.percent);
      row.push(item.scoreSheet.qualifyingTest.SJ.zScore);
      row.push(item.scoreSheet.qualifyingTest.CA.zScore);
    }
    row.push(item.zScore);
    row.push(''); // TODO rank
    row.push(''); // TODO notes
    row.push(''); // TODO outcome
    const ref = item.ref.split('-')[1];
    if (diversityData[ref]) {
      row.push(hasDiversityCharacteristic(diversityData[ref], DIVERSITY_CHARACTERISTICS.GENDER_FEMALE));
      row.push(hasDiversityCharacteristic(diversityData[ref], DIVERSITY_CHARACTERISTICS.ETHNICITY_BAME));
      row.push(hasDiversityCharacteristic(diversityData[ref], DIVERSITY_CHARACTERISTICS.PROFESSION_SOLICITOR));
      row.push(hasDiversityCharacteristic(diversityData[ref], DIVERSITY_CHARACTERISTICS.DISABILITY_DISABLED));
    } else {
      row.push();
      row.push();
      row.push();
      row.push();
    }
    rows.push(row);
  });
  // add did not take
  didNotTake.forEach(item => {
    const row = [];
    row.push(item.ref);
    if (type === DOWNLOAD_TYPES.full.value) {
      row.push(item.fullName);
      row.push(item.email);
      row.push('');
      row.push('');
      row.push('');
      row.push('');
      row.push('');
      row.push('');
    }
    row.push('');
    row.push(''); // TODO rank
    row.push(''); // TODO notes
    row.push('noTestSubmitted');
    const ref = item.ref.split('-')[1];
    if (diversityData[ref]) {
      row.push(hasDiversityCharacteristic(diversityData[ref], DIVERSITY_CHARACTERISTICS.GENDER_FEMALE));
      row.push(hasDiversityCharacteristic(diversityData[ref], DIVERSITY_CHARACTERISTICS.ETHNICITY_BAME));
      row.push(hasDiversityCharacteristic(diversityData[ref], DIVERSITY_CHARACTERISTICS.PROFESSION_SOLICITOR));
      row.push(hasDiversityCharacteristic(diversityData[ref], DIVERSITY_CHARACTERISTICS.DISABILITY_DISABLED));
    } else {
      row.push();
      row.push();
      row.push();
      row.push();
    }
    rows.push(row);
  });
  // add failed
  failed.forEach(item => {
    const row = [];
    row.push(item.ref);
    if (type === DOWNLOAD_TYPES.full.value) {
      row.push(item.fullName);
      row.push(item.email);
      row.push('');
      row.push('');
      row.push('');
      row.push('');
      row.push('');
      row.push('');
    }
    row.push('');
    row.push(''); // TODO rank
    row.push(''); // TODO notes
    row.push('failedFirstTest');
    const ref = item.ref.split('-')[1];
    if (diversityData[ref]) {
      row.push(hasDiversityCharacteristic(diversityData[ref], DIVERSITY_CHARACTERISTICS.GENDER_FEMALE));
      row.push(hasDiversityCharacteristic(diversityData[ref], DIVERSITY_CHARACTERISTICS.ETHNICITY_BAME));
      row.push(hasDiversityCharacteristic(diversityData[ref], DIVERSITY_CHARACTERISTICS.PROFESSION_SOLICITOR));
      row.push(hasDiversityCharacteristic(diversityData[ref], DIVERSITY_CHARACTERISTICS.DISABILITY_DISABLED));
    } else {
      row.push();
      row.push();
      row.push();
      row.push();
    }
    rows.push(row);
  });  
  return rows;
}

function getDownloadTypes(task) {
  if (!task) return [];
  return Object.values(DOWNLOAD_TYPES);
}
