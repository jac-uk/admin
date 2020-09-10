// @TODO can this be removed? /src/filters.js contains `formatDate`
const formatDate = (date, type) => {
  if (!(date instanceof Date)) {
    throw 'Supplied date must be a Date object';
  }

  if (type && type === 'time') {
    return date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }).toLowerCase();
  }

  const month = date.toLocaleString('en-US', { month: 'long' });

  if (type && type === 'month') {
    return `${month} ${date.getFullYear()}`;
  }

  return `${date.getDate()} ${month} ${date.getFullYear()}`;
};

export default formatDate;
