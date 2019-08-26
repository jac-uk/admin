import clipNumber from '@/helpers/Form/clipNumber';

const validateMinute = (val) => {
  val = parseInt(val);

  if (isNaN(val)) {
    return null;
  }

  return clipNumber(val, 0, 59);
};

export default validateMinute;
