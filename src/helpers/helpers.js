/*eslint func-style: ["error", "declaration"]*/

function getRandomString(length = 3) {
  const characters = 'abcdefghijklmnopqrstuvwxyz';
  let randomCharacters = '';
  for (let i = 0, len = length; i < len; i++) {
    randomCharacters += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return randomCharacters;
}

function getValueAtObjectPath(object, path) {
  if (path && path.indexOf('.') >= 0) {
    let currentPath = path.substring(0, path.indexOf('.'));
    let remainingPath = path.substring(path.indexOf('.') + 1);
    let valueAtPath = object[currentPath];
    while (valueAtPath && remainingPath.indexOf('.') >= 0) {
      currentPath = remainingPath.substring(0, remainingPath.indexOf('.'));
      remainingPath = remainingPath.substring(remainingPath.indexOf('.') + 1);
      valueAtPath = valueAtPath[currentPath];
    }
    if (valueAtPath) {
      valueAtPath = valueAtPath[remainingPath];
    }
    return valueAtPath;
  } else {
    return object[path];
  }
}

export {
  getRandomString,
  getValueAtObjectPath
};
