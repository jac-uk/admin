const validateHour = (value) => {
  if(value === null) {
    return null;
  }

  if(value < 0 || value === '00' || value === 24 || isNaN(value)) {
    return 0;
  }

  if(value > 23) {
    return 23;
  }

  return value;
};

export default validateHour;
