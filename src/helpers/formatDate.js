const formatDate = (date, type) => {
  if(!(date instanceof Date)) {
    return;
  }

  let month = date.toLocaleString('default', { month: 'long' });
  let time = date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });

  if(type && type === 'time') {
    return `${date.getDate()} ${month} ${date.getFullYear()} ${time}`;
  }

  return `${date.getDate()} ${month} ${date.getFullYear()}`;
};

export default formatDate;

