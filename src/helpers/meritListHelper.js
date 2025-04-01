/*eslint func-style: ["error", "declaration"]*/

import { TASK_TYPE } from '@/helpers/constants';
import { DIVERSITY_CHARACTERISTICS, hasDiversityCharacteristic } from '@/helpers/diversityCharacteristics';
import { markingScheme2Columns } from '@/helpers/scoreSheetHelper';
import { downloadXLSX } from '@jac-uk/jac-kit/helpers/export';
import { toYesNo, lookup } from '@jac-uk/jac-kit/filters/filters';

export {
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
  hasParticipation,
  downloadMeritList,
  getDownloadTypes,
  getOverallGrade,
  sortFunctionGradeScore
};

const OUTCOME = {
  PASS: {
    value: 'pass',
    label: 'Pass',
  },
  FAIL: {
    value: 'fail',
    label: 'Fail',
  },
  QT_NOT_STARTED: {
    label: 'Qualifying test not started',
  },
};

const OVERRIDE_REASON = {
  EMP_GENDER: {
    code: 'g',
    value: 'emp-gender',
    label: 'EMP applied on basis of gender',
  },
  EMP_ETHNICITY: {
    code: 'e',
    value: 'emp-ethnicity',
    label: 'EMP applied on basis of ethnicity',
  },
  TECHNICAL: {
    code: 't',
    value: 'technical',
    label: 'Technical glitches encountered',
  },
  PERSONAL: {
    code: 'p',
    value: 'personal',
    label: 'Personal circumstances',
  },
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

function scoreType(task) {
  if (!task) return 'score';
  if (task.scoreType) return task.scoreType;
  if (task.finalScores && task.finalScores[0].hasOwnProperty('percent')) return 'percent';
  if (hasOverallGrade(task)) return 'gradeScore';
  return 'score';
}

function hasOverallGrade(task) {
  if (!task) return false;
  if (!task.markingScheme) return false;
  if (task.type === TASK_TYPE.SIFT) {
    const sift = task.markingScheme.find(item => item.ref === TASK_TYPE.SIFT);
    if (!sift) return false;
    if (!sift.children) return false;
    const siftOverallGrade = sift.children.find(item => item.ref === 'OVERALL');
    return siftOverallGrade ? true : false;
  }
  if (task.type === TASK_TYPE.SELECTION_DAY) {
    const selectionDay = task.markingScheme.find(item => item.ref === 'overall');
    if (!selectionDay) return false;
    if (!selectionDay.children) return false;
    const selectionDayOverallGrade = selectionDay.children.find(item => item.ref === 'OVERALL');
    return selectionDayOverallGrade ? true : false;
  }
  return false;
}

function getOverallGrade(task, scoreSheet, changes) {
  if (!task) return false;
  switch (task.type) {
  case TASK_TYPE.SIFT:
    if (changes && changes[task.type] && changes[task.type].OVERALL) return changes[task.type].OVERALL;
    return scoreSheet[task.type].OVERALL;
  case TASK_TYPE.SELECTION_DAY:
    if (changes && changes.overall && changes.overall.OVERALL) return changes.overall.OVERALL;
    return scoreSheet.overall.OVERALL;
  default:
    return '';
  }
}

function scores(task, scoreType, exerciseDiversity) {
  if (!task) return [];
  if (!exerciseDiversity) return [];
  if (!task.finalScores) return [];

  // group scores
  const scoreMap = {};
  task.finalScores
      .filter(scoreData => scoreData[scoreType] !== null).forEach(scoreData => { // id | panelId | ref | score | scoreSheet
    if (!scoreMap[scoreData[scoreType]]) {
      scoreMap[scoreData[scoreType]] = {
        applicationIds: [],
        count: 0,
        cumulativeCount: 0,
        percentileRank: 0,
        rank: 0,
        diversity: {
          female: 0,
          bame: 0,
          solicitor: 0,
          disability: 0,
        },
        cumulativeDiversity: {
          female: 0,
          bame: 0,
          solicitor: 0,
          disability: 0,
        },
        outcome: {
          pass: 0,
          fail: 0,
        },
      };
    }
    if (scoreType === 'gradeScore') {
      scoreMap[scoreData[scoreType]].grade = scoreData.grade;
      scoreMap[scoreData[scoreType]].score = scoreData.score;
    }
    scoreMap[scoreData[scoreType]].applicationIds.push(scoreData.id);
    scoreMap[scoreData[scoreType]].count += 1;
    scoreMap[scoreData[scoreType]].percentileRank = scoreData?.percentileRank || null;
    const ref = scoreData.ref.split('-')[1];
    if (exerciseDiversity[ref]) {
      if (hasDiversityCharacteristic(exerciseDiversity[ref], DIVERSITY_CHARACTERISTICS.GENDER_FEMALE)) scoreMap[scoreData[scoreType]].diversity.female += 1;
      if (hasDiversityCharacteristic(exerciseDiversity[ref], DIVERSITY_CHARACTERISTICS.ETHNICITY_BAME)) scoreMap[scoreData[scoreType]].diversity.bame += 1;
      if (hasDiversityCharacteristic(exerciseDiversity[ref], DIVERSITY_CHARACTERISTICS.PROFESSION_SOLICITOR)) scoreMap[scoreData[scoreType]].diversity.solicitor += 1;
      if (hasDiversityCharacteristic(exerciseDiversity[ref], DIVERSITY_CHARACTERISTICS.DISABILITY_DISABLED)) scoreMap[scoreData[scoreType]].diversity.disability += 1;
    }
  });

  // add rank and cumulative diversity
  let scoresInDescendingOrder;
  if (scoreType === 'gradeScore') { // keys of form Grade:Score
    scoresInDescendingOrder = Object.entries(scoreMap).sort(( keyValueA, keyValueB) => {
      const a = keyValueA[1];
      const b = keyValueB[1];
      return sortFunctionGradeScore(a, b);
    }).map(item => item[0]);
  } else {
    scoresInDescendingOrder = Object.keys(scoreMap).sort((a, b) => b - a);
  }
  let prevScore;
  scoresInDescendingOrder.forEach(score => {
    if (prevScore) {
      scoreMap[score].rank = scoreMap[prevScore].rank + scoreMap[prevScore].count;
      scoreMap[score].cumulativeDiversity.female = scoreMap[prevScore].cumulativeDiversity.female;
      scoreMap[score].cumulativeDiversity.bame = scoreMap[prevScore].cumulativeDiversity.bame;
      scoreMap[score].cumulativeDiversity.solicitor = scoreMap[prevScore].cumulativeDiversity.solicitor;
      scoreMap[score].cumulativeDiversity.disability = scoreMap[prevScore].cumulativeDiversity.disability;
    } else {
      scoreMap[score].rank = 1;
    }
    scoreMap[score].cumulativeDiversity.female += scoreMap[score].diversity.female;
    scoreMap[score].cumulativeDiversity.bame += scoreMap[score].diversity.bame;
    scoreMap[score].cumulativeDiversity.solicitor += scoreMap[score].diversity.solicitor;
    scoreMap[score].cumulativeDiversity.disability += scoreMap[score].diversity.disability;
    prevScore = score;
  });

  // add outcome stats
  if (task.hasOwnProperty('passMark')) {
    scoresInDescendingOrder.forEach(key => {
      const score = scoreType === 'gradeScore' ? key : parseFloat(key);
      let isScoreGreaterOrEqual = false;
      if (scoreType === 'gradeScore') {
        const parts = task.passMark.split(':');
        isScoreGreaterOrEqual =
          scoreMap[score].grade < parts[0] ||
          (scoreMap[score].grade === parts[0] && scoreMap[score].score >= parseInt(parts[1]));
      } else {
        isScoreGreaterOrEqual = score >= task.passMark;
      }
      if (isScoreGreaterOrEqual) {
        if (task.overrides && task.overrides.fail) {
          const failMatches = Object.keys(task.overrides.fail).filter(id => scoreMap[score].applicationIds.indexOf(id) >= 0);
          scoreMap[score].outcome.fail = failMatches.length;
          scoreMap[score].outcome.pass = scoreMap[score].count - failMatches.length;
        } else {
          scoreMap[score].outcome.pass = scoreMap[score].count;
        }
      } else {
        if (task.overrides && task.overrides.pass) {
          const passMatches = Object.keys(task.overrides.pass).filter(id => scoreMap[score].applicationIds.indexOf(id) >= 0);
          scoreMap[score].outcome.pass = passMatches.length;
          scoreMap[score].outcome.fail = scoreMap[score].count - passMatches.length;
        } else {
          scoreMap[score].outcome.fail = scoreMap[score].count;
        }
      }
    });
  }

  // return
  return scoresInDescendingOrder.map(key => {
    const data = { ...scoreMap[key] };
    if (scoreType === 'gradeScore') {
      data.score = key;
    } else {
      data.score = parseFloat(key);
    }
    return data;
  });
}

function sortFunctionGradeScore(a, b) {
  if (a.grade > b.grade) return 1;
  if (a.grade < b.grade) return -1;
  if (a.score > b.score) return -1;
  if (a.score < b.score) return 1;
  return 0;
}

function scoreData(task, scoreType, exerciseDiversity) {
  if (!task) return [];
  if (!task.finalScores) return [];
  if (!exerciseDiversity) return [];
  const sortedScoreData = task.finalScores.map(scoreData => {
    const application = task.applications ? task.applications.find(application => application.id === scoreData.id) : null;
    const data = {
      ...application,
      ...scoreData,
      // score: scoreData[scoreType],
      diversity: {},
    };
    const ref = scoreData.ref.split('-')[1];
    if (exerciseDiversity[ref]) {
      data.diversity = {
        female: hasDiversityCharacteristic(exerciseDiversity[ref], DIVERSITY_CHARACTERISTICS.GENDER_FEMALE),
        bame: hasDiversityCharacteristic(exerciseDiversity[ref], DIVERSITY_CHARACTERISTICS.ETHNICITY_BAME),
        solicitor: hasDiversityCharacteristic(exerciseDiversity[ref], DIVERSITY_CHARACTERISTICS.PROFESSION_SOLICITOR),
        disability: hasDiversityCharacteristic(exerciseDiversity[ref], DIVERSITY_CHARACTERISTICS.DISABILITY_DISABLED),
      };
    }
    if (!data.hasOwnProperty('pass')) {
      if (task.hasOwnProperty('passMark')) {
        data.pass = isPass(task, data.id, scoreData);
      }
    }
    return data;
  }).sort((a, b) => {
    if (scoreType === 'gradeScore') {
      return sortFunctionGradeScore(a, b);
    } else {
      return b.score - a.score;
    }
  });

  // add rank and count
  let prevScore;
  let prevRank = 1;
  let prevCount = 0;
  sortedScoreData.forEach(scoreData => {
    if (scoreData[scoreType] === prevScore) {
      prevCount++;
    } else {
      prevScore = scoreData[scoreType];
      prevRank = prevRank + prevCount;
      prevCount = 1;
    }
    scoreData.rank = prevRank;
  });

  return sortedScoreData;
}

function totalApplications(task) {
  if (!task) return 0;
  if (task.applications) {
    return task.applications.length;
  } else {
    if (task._stats && task._stats.totalApplications) {
      return task._stats.totalApplications;
    }
  }
  return 0;
}

function totalPassed(task, scoreType, scores) {
  if (!scores.length) return 0;
  if (!task) return 0;
  if (!task.passMark) return 0;
  // TODO: confirm if the score counts are cumulative
  let total = scores.filter((data) => data.score >= task.passMark)
                    .map((data) => data.count)
                    .reduce((a, b) => a + b, 0);
  if (task.overrides) {
    const numPasses = task.overrides.pass ? Object.keys(task.overrides.pass).length : 0;
    const numFails = task.overrides.fail ? Object.keys(task.overrides.fail).length : 0;
    total = total - numFails + numPasses;
  }
  return total;
}

function totalFailed(task, scoreType, scores) {
  if (!task) return 0;
  if (!task.passMark) return 0;
  return task.finalScores.length - totalPassed(task, scoreType, scores);
}

function hasParticipation(task) {
  if (!task) return false;
  switch (task.type) {
  case TASK_TYPE.CRITICAL_ANALYSIS:
  case TASK_TYPE.SITUATIONAL_JUDGEMENT:
  case TASK_TYPE.QUALIFYING_TEST:
  case TASK_TYPE.SCENARIO:
    return true;
  default:
    return false;
  }
}

function totalDidNotParticipate(task) {
  if (!task) return 0;
  if (!task.passMark) return 0;
  const totalDidNotParticipate = totalApplications(task) - task.finalScores.length;
  return totalDidNotParticipate > 0 ? totalDidNotParticipate : 0;
}

function getOverrideReasons() {
  return Object.values(OVERRIDE_REASON);
}

// function convertOverrideCode2Value(code) {
//   const match = getOverrideReasons().find(reason => reason.code === code);
//   return match ? match.value : '';
// }

// function convertOverrideValue2Code(value) {
//   const match = getOverrideReasons().find(reason => reason.value === value);
//   return match ? match.code : '';
// }

function isPassingGradeScore(passMark, scoreData) {
  if (!passMark) return false;
  if (!scoreData) return false;
  const passParts = passMark.split(':');
  if (scoreData.grade < passParts[0]) return true;
  if (scoreData.grade > passParts[0]) return false;
  if (parseInt(scoreData.score) >= parseInt(passParts[1])) return true;
  return false;
}

function isPassingScore(task, scoreData) {
  if (!task) return false;
  if (!task.passMark) return false;
  const type = scoreType(task);
  if (type === 'gradeScore') {
    return isPassingGradeScore(task.passMark, scoreData);
  } else {
    if (task.passMark <= scoreData[type]) return true;
  }
  return false;
}

function isPass(task, applicationId, scoreData) {
  const override = getOverride(task, applicationId);
  if (override) {
    return override.outcome === OUTCOME.PASS.value;
  }
  if (isPassingScore(task, scoreData)) {
    return true;
  }
  return false;
}

function getDefaultOutcome(task, scoreData) {
  if (isPassingScore(task, scoreData)) {
    return OUTCOME.PASS;
  } else {
    return OUTCOME.FAIL;
  }
}

function getNewOutcome(task, scoreData) {
  if (isPassingScore(task, scoreData)) {
    return OUTCOME.FAIL;
  } else {
    return OUTCOME.PASS;
  }
}

function getCurrentOutcome(task, scoreData) {
  if (isPassingScore(task, scoreData)) {
    return OUTCOME.PASS;
  } else {
    return OUTCOME.FAIL;
  }
}

/**
 * function getOverride(task, applicationId)
 * @param {*} task
 * @param {*} applicationId
 * @returns false or an `override` object of the form `{ id: string, outcome: enum('pass', 'fail'), reason: enum('emp-gender', 'emp-ethnicity', 'technical', 'personal') }`
 */
function getOverride(task, applicationId) {
  if (!task) return false;
  if (!task.overrides) return false;

  if (task.overrides.pass) {
    if (Array.isArray(task.overrides.pass)) {   // BACKWARDS COMPATIBILITY: we used to store IDs in an array
      if (task.overrides.pass.indexOf(applicationId) >= 0) {
        return {
          outcome: OUTCOME.PASS.value,
          id: applicationId,
        };
      } else {
        return false;
      }
    }
    if (task.overrides.pass[applicationId]) {
      return {
        outcome: OUTCOME.PASS.value,
        id: applicationId,
        reason: task.overrides.pass[applicationId],
      };
    }
  }

  if (task.overrides.fail) {
    if (Array.isArray(task.overrides.fail)) {   // BACKWARDS COMPATIBILITY: we used to store IDs in an array
      if (task.overrides.fail.indexOf(applicationId) >= 0) {
        return {
          outcome: OUTCOME.FAIL.value,
          id: applicationId,
        };
      } else {
        return false;
      }
    }
    if (task.overrides.fail[applicationId]) {
      return {
        outcome: OUTCOME.FAIL.value,
        id: applicationId,
        reason: task.overrides.fail[applicationId],
      };
    }
  }

  return false;
}

// function meritList(task) {
//   if (!task.applications) return [];
//   if (!task.finalScores) return [];
//   const applicationData = {};
//   task.applications.forEach(application => applicationData[application.id] = application);
//   return task.finalScores.map(scoreData => {
//     return {
//       ...applicationData[scoreData.id],
//       ...scoreData,
//     };
//   });
// }

/**
 *
 * @param {*} title
 * @param {object} scoreGroups { didNotTake: [], failed: [], withdrawnBeforeQT: [] }
 * @param {*} task
 * @param {*} diversityData
 * @param {*} type
 * @param {*} fileName
 * @returns
 */
function downloadMeritList(title, scoreGroups, task, diversityData, type, fileName) {
  switch (type) {
  case DOWNLOAD_TYPES.full.value:
  case DOWNLOAD_TYPES.emp.value:
    downloadXLSX(
      xlsxData(scoreGroups, task, diversityData, type),
      {
        title: title,
        sheetName: DOWNLOAD_TYPES[type].sheetName,
        fileName: `${fileName}.xlsx`,
      }
    );
    return true;
  default:
    return false;
  }
}

function xlsxData(scoreGroups, task, diversityData, type) {
  // const taskScoreType = scoreType(task);
  const rows = [];
  const headers = [];
  headers.push('Ref');
  if (task.type === TASK_TYPE.QUALIFYING_TEST) {
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
    headers.push('Rank');
    headers.push('Z_Overall');
  } else {
    if (type === DOWNLOAD_TYPES.full.value) {
      headers.push('Full name');
      headers.push('Email');
    }
    // include grade sheet
    if (task.markingScheme) {
      markingScheme2Columns(task.markingScheme).forEach(column => {
        headers.push(column.title);
      });
    }
    headers.push('Score');
    headers.push('Rank');
  }
  headers.push('Outcome');
  // headers.push('Notes');
  headers.push('Female');
  headers.push('Ethnic Minority');
  headers.push('Solicitor');
  headers.push('Disability');
  rows.push(headers);
  scoreData(task, scoreType(task), diversityData).forEach(item => {
    const row = [];
    row.push(item.ref);
    if (task.type === TASK_TYPE.QUALIFYING_TEST) {
      if (type === DOWNLOAD_TYPES.full.value) {
        row.push(item.fullName);
        row.push(item.email);
        // If the CAT/SJT scores are zero, it represents a not taken, so we replace with 'n/a'
        row.push(formatScore(item.scoreSheet.qualifyingTest.SJ.score, false));
        row.push(formatScore(item.scoreSheet.qualifyingTest.SJ.percent, false));
        row.push(formatScore(item.scoreSheet.qualifyingTest.CA.score, false));
        row.push(formatScore(item.scoreSheet.qualifyingTest.CA.percent, false));
        // The z scores can be zero in some cases, so we keep the zero values.
        row.push(formatScore(item.scoreSheet.qualifyingTest.SJ.zScore));
        row.push(formatScore(item.scoreSheet.qualifyingTest.CA.zScore));
      }
      row.push(item.rank);
      row.push(formatScore(item.zScore));
    } else {
      if (type === DOWNLOAD_TYPES.full.value) {
        row.push(item.fullName);
        row.push(item.email);
      }
      // add gradesheet data (inc changes)
      if (task.markingScheme) {
        markingScheme2Columns(task.markingScheme).forEach(column => {
          if (column.parent) {
            if (task.changes && task.changes[item.id] && task.changes[item.id][column.parent] && task.changes[item.id][column.parent][column.ref]) {
              row.push(task.changes[item.id][column.parent][column.ref]);
            } else {
              row.push(item.scoreSheet[column.parent][column.ref]);
            }
          } else {
            if (task.changes && task.changes[item.id] && task.changes[item.id][column.ref]) {
              row.push(task.changes[item.id][column.ref]);
            } else {
              row.push(item.scoreSheet[column.ref]);
            }
          }
        });
      }
      row.push(item.score);
      row.push(item.rank);
    }
    if (item.hasOwnProperty('pass')) {
      item.pass ? row.push(OUTCOME.PASS.label) : row.push(OUTCOME.FAIL.label);
    } else {
      row.push('');
    }
    // row.push(''); // TODO notes
    const ref = item.ref.split('-')[1];
    if (diversityData[ref]) {
      row.push(toYesNo(hasDiversityCharacteristic(diversityData[ref], DIVERSITY_CHARACTERISTICS.GENDER_FEMALE)));
      row.push(toYesNo(hasDiversityCharacteristic(diversityData[ref], DIVERSITY_CHARACTERISTICS.ETHNICITY_BAME)));
      row.push(toYesNo(hasDiversityCharacteristic(diversityData[ref], DIVERSITY_CHARACTERISTICS.PROFESSION_SOLICITOR)));
      row.push(toYesNo(hasDiversityCharacteristic(diversityData[ref], DIVERSITY_CHARACTERISTICS.DISABILITY_DISABLED)));
    } else {
      row.push('');
      row.push('');
      row.push('');
      row.push('');
    }
    rows.push(row);
  });

  for (const groupName in scoreGroups) {
    if (Object.prototype.hasOwnProperty.call(scoreGroups, groupName)) {
      const scoreGroup = scoreGroups[groupName];

      scoreGroup.forEach(item => {
        const row = [];
        row.push(item.ref);
        if (task.type === TASK_TYPE.QUALIFYING_TEST) {
          if (type === DOWNLOAD_TYPES.full.value) {
            row.push(item.fullName);
            row.push(item.email);
            // If the CAT/SJT scores are zero, it represents a not taken, so we replace with 'n/a'
            row.push(formatScore(item?.scoreSheet?.qualifyingTest?.SJ?.score, false));
            row.push(formatScore(item?.scoreSheet?.qualifyingTest?.SJ?.percent, false));
            row.push(formatScore(item?.scoreSheet?.qualifyingTest?.CA?.score, false));
            row.push(formatScore(item?.scoreSheet?.qualifyingTest?.CA?.percent, false));
            // The z scores can be zero in some cases, so we keep the zero values.
            row.push(formatScore(item?.scoreSheet?.qualifyingTest?.SJ?.zScore));
            row.push(formatScore(item?.scoreSheet?.qualifyingTest?.CA?.zScore));
          }
          row.push(formatScore(item.rank));
          row.push(formatScore(item.zScore));
        } else {
          if (type === DOWNLOAD_TYPES.full.value) {
            row.push(item.fullName);
            row.push(item.email);
          }
          row.push(formatScore(item.rank));
          row.push(formatScore(item.zScore));
        }

        let outcome = '';
        switch (groupName) {
          case 'didNotTake':
            outcome = OUTCOME.QT_NOT_STARTED.label;
            break;
          case 'failed':
            outcome = OUTCOME.FAIL.label;
            break;
          case 'withdrawnBeforeQT':
            outcome = lookup('withdrawn');
            break;
          default:
            break;
        }
        row.push(outcome);

        // row.push(''); // TODO notes
        const ref = item.ref.split('-')[1];
        if (diversityData[ref]) {
          row.push(toYesNo(hasDiversityCharacteristic(diversityData[ref], DIVERSITY_CHARACTERISTICS.GENDER_FEMALE)));
          row.push(toYesNo(hasDiversityCharacteristic(diversityData[ref], DIVERSITY_CHARACTERISTICS.ETHNICITY_BAME)));
          row.push(toYesNo(hasDiversityCharacteristic(diversityData[ref], DIVERSITY_CHARACTERISTICS.PROFESSION_SOLICITOR)));
          row.push(toYesNo(hasDiversityCharacteristic(diversityData[ref], DIVERSITY_CHARACTERISTICS.DISABILITY_DISABLED)));
        } else {
          row.push('');
          row.push('');
          row.push('');
          row.push('');
        }

        rows.push(row);
      });
    }
  }
  return rows;
}

function getDownloadTypes(task) {
  // TODO: confirm if task affect the download types
  if (!task) return [];
  return Object.values(DOWNLOAD_TYPES);
}

function formatScore(score, acceptZero = true) {
  if (score === null || score === undefined || (!acceptZero && score === 0)) return 'n/a';
  return score;
}
