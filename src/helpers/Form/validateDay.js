const validateDay = (val) => {
  val = parseInt(val);
  if (isNaN(val)) {
    return null;
  }

  if(val > 31) {
    return 31;
  }

  if(val < 1 || val === 0) {
    return 1;
  }

  return val;
};

export default validateDay;
