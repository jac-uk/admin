const validateYear = (val) => {
  val = parseInt(val);

  if(val === null || isNaN(val) || val.toString().length !== 4) {
    return null;
  }

  return val;

};
 export default validateYear;
