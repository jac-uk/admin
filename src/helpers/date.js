const isDate = (date) => date instanceof Date;

const isDateInFuture = (date) => {
  // @NOTE: this is a bit silly, we should save full date instead of hardcoding the time
  if(!(date instanceof Date)) {
    throw 'Supplied date must be a Date object';
  }

  const today = new Date();

  date = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    13,
    0,
    0
  );

  return date > today;
};

const formatDate = (date, type) => {
  if(!(date instanceof Date)) {
    throw 'Supplied date must be a Date object';
  }

  if(type && type === 'time') {
    return date.toLocaleString('en-GB', { hour: 'numeric', minute: 'numeric', hour12: true }).toLowerCase();
  }

  let month = date.toLocaleString('en-GB', { month: 'long' });

  if(type && type === 'month') {
    return `${month} ${date.getFullYear()}`;
  }

  return `${date.getDate()} ${month} ${date.getFullYear()}`;
};

const parseEstimatedDate = (value) => {
  if (value instanceof Date) {
    return value;
  }

  if (typeof value != 'string') {
    return;
  }
  const parts = value.split('-');

  const [year, month, day] = [...parts, 1];
  const date = new Date(Date.UTC(year, month - 1, day));

  return date;
};

const validateYear = (val) => {
  val = parseInt(val);

  if(isNaN(val) || val.toString().length !== 4) {
    return null;
  }

  return val;
};

export {
  isDate,
  isDateInFuture,
  formatDate,
  parseEstimatedDate,
  validateYear
};
