const validateYear = (val) => {
  val = parseInt(val);

  if(val === null || isNaN(val)) {
    return null;
  }

  if(val.toString().length !== 4) {
    return null;
  }

  return val;

};
 export default validateYear;
