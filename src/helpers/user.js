/**
 * Parse first/last name from display name.
 * 
 * @param {string} displayName 
 * @returns {object} ex. { firstName: 'Harry', lastName: 'Potter' }
 */
const parseDisplayName = (displayName) => {
  const parsed = { firstName: '', lastName: '' };

  if (!displayName || !displayName.trim()) return parsed;

  // remove '| (He/They)' from displayName (e.g. 'Isaac, Andrew | (He/They)' becomes 'Isaac, Andrew')
  displayName = displayName.split('|')[0].trim();
  // assume displayName is 'firstName lastName' (Google) or 'lastName, firstName' (Microsoft)
  if (displayName.indexOf(',') === -1) {
    const names = displayName.split(' ');
    if (names.length > 1) {
      parsed.lastName = names[names.length - 1].trim();
      parsed.firstName = names.slice(0, names.length - 1).join(' ').trim();
    } else if (names[0]) {
      parsed.lastName = names[0].trim();
    }
  } else {
    const names = displayName.split(',');
    if (names[0]) parsed.lastName = names[0].trim();
    if (names[1]) parsed.firstName = names[1].trim();
  }

  return parsed;
};

export {
  parseDisplayName
};
