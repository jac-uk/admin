/*eslint func-style: ["error", "declaration"]*/

export {
  DIVERSITY_CHARACTERISTICS,
  hasDiversityCharacteristic
};

const DIVERSITY_CHARACTERISTICS = {
  DISABILITY_DISABLED: 'd',
  DISABILITY_NOT_SAY: 'dx',
  ETHNICITY_WHITE: 'w',
  ETHNICITY_BAME: 'b',
  ETHNICITY_OTHER: 'eo',
  ETHNICITY_NOT_SAY: 'ex',
  GENDER_MALE: 'm',
  GENDER_FEMALE: 'f',
  GENDER_NEUTRAL: 'gn',
  GENDER_OTHER: 'go',
  GENDER_NOT_SAY: 'gx',
  PROFESSION_BARRISTER: 'pb',
  PROFESSION_CILEX: 'pc',
  PROFESSION_SOLICITOR: 'ps',
  PROFESSION_OTHER: 'po',
  PROFESSION_NOT_SAY: 'px',
  UK_STATE_SCHOOL: 'ss',
  FIRST_GENERATION_UNIVERSITY: 'u1',
};

function hasDiversityCharacteristic(data, characteristic) {
  if (!data) return false;
  if (!data.d) return false;
  return data.d.indexOf(characteristic) >= 0;
}
