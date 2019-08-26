import clipNumber from '@/helpers/Form/clipNumber';

const validateHour = (val) => {
  val = parseInt(val);

  if (isNaN(val)) {
    return null;
  }

  if(val === 24) {
    return 0;
  }

  return clipNumber(val, 0, 23);
};

export default validateHour;
