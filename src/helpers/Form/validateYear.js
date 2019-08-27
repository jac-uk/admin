const validateYear = (val) => {
  val = parseInt(val);

  if(isNaN(val) || val.toString().length !== 4) {
    return null;
  }

  return val;

};
 export default validateYear;
