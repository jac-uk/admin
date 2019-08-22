const validateMinute = (value) => {
  if(value === null) {
    return null
  }

  if(value < 0) {
    return 0;
  }

  if(value > 59) {
    return 59;
  }

  if(isNaN(value)) {
    return 0;
  }

  return value;
}

export default validateMinute;
