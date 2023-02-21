/**
 * Get next from an array whose values are meant to wrap, ie when you get to the end of the array the following element will be
 * the first
 * @param {*} arr
 * @param {*} index
 * @returns
 */
const getNextFromArrayWrap = (arr, index) => {
  const newIndex = index % arr.length;
  return arr[newIndex];
};

export {
  getNextFromArrayWrap
};

