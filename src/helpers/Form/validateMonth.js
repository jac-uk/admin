import clipNumber from '@/helpers/Form/clipNumber';

const validateMonth = (val) => {
  val = parseInt(val);
  
  if(isNaN(val)) {
    return null;
  }

  return clipNumber(val, 1, 12);
};

export default validateMonth;
