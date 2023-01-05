/**
 * CHecks if a set of deeply nested properties exist on an object
 * @param {*} obj
 * @param  {...any} args
 * @returns
 */
const checkNested = (obj, ...args) => {
  if (!obj) {
    return false;
  }
  for (let i = 0; i < args.length; i++) {
    if (!obj.hasOwnProperty(args[i])) {
      return false;
    }
    obj = obj[args[i]];
  }
  return true;
};
export {
  checkNested
};
