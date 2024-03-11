
function getRandomString(length = 3) {
  const characters = 'abcdefghijklmnopqrstuvwxyz';
  let randomCharacters = '';
  for (let i = 0, len = length; i < len; i++) {
    randomCharacters += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return randomCharacters;
}

export {
  getRandomString
};
