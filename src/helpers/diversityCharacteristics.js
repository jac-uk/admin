/*eslint func-style: ["error", "declaration"]*/
import { DIVERSITY_CHARACTERISTICS } from '@jac-uk/jac-kit/helpers/constants.js';

export {
  DIVERSITY_CHARACTERISTICS,
  hasDiversityCharacteristic
};

function hasDiversityCharacteristic(data, characteristic) {
  if (!data) return false;
  if (!data.d) return false;
  return data.d.indexOf(characteristic) >= 0;
}
