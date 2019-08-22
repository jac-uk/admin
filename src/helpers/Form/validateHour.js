const validateHour = (value) => {
  if(value === null) {
    return null;
  }

  if(value < 0) {
    return 0;
  }

  if(value === 24) {
    return 0; 
  }

  if(value === '00') {
    return 0; 
  }

  if(value > 23) {
    return 23;
  }

  if(isNaN(value)) {
    return 0;
  }

  return value;
};

export default validateHour;
