import clipNumber from '@/helpers/Form/clipNumber';

const validateDay = (val) => {
  val = parseInt(val);
  
  if (isNaN(val)) {
    return null;
  }

  return clipNumber(val, 1, 31);
};

export default validateDay;
