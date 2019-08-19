const validateMonth = (val) => {
  val = parseInt(val);
  
  if(val === null || isNaN(val)) {
    return null;
  }

  if(val > 12) {
    return 12;
  }

  if(val < 1) {
    return 1;
  }

  return val;
};

export default validateMonth;
