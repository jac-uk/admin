const clipNumber = (val, min, max) => {
  if (typeof val !== 'number') {
    return null;
  }

  if (isNaN(min) || isNaN(max)) {
    return null;
  }

  if (val < min) {
    return min;
  }

  if (val > max) {
    return max;
  }

  return val;
};

export default clipNumber;
