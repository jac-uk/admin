export const splitFullName = (fullName) => {
  const name = fullName.split(' ');
  let firstName = null;
  let lastName = null;
  if (name.length > 1) {
    firstName = name[0];
    name.shift();
    lastName = name.join(' ');
  } else {
    firstName = '';
    lastName = name[0];
  }
  return ([firstName, lastName]);

};
