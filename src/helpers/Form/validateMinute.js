const validateMinute = (value) => {
  if(value === null) {
    return null;
  }

  if(value < 0 || isNaN(value)) {
    return 0;
  }

  if(value > 59) {
    return 59;
  }

  return value;
};

export default validateMinute;
