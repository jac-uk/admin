/*eslint func-style: ["error", "declaration"]*/

export {
  GRADES,
  GRADE_VALUES,
  getScoreSheetTotal
};

const MARKING_TYPE = {
  GROUP: 'group',
  NUMBER: 'number',
  GRADE: 'grade',
};
const GRADES = ['A', 'B', 'C', 'D'];
const GRADE_VALUES = {
  'A': 4,
  'B': 3,
  'C': 2,
  'D': 1,
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
    case MARKING_TYPE.NUMBER:
      if (scoreSheet[item.ref]) {
        return scoreSheet[item.ref];
      }
      break;
    }
  }
  return 0;
}
