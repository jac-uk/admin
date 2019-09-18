const formatDate = (date, type) => {
  if(!(date instanceof Date)) {
    return;
  }

  if(type && type === 'time') {
    let time = date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    return `${time}`;
  }

  let month = date.toLocaleString('default', { month: 'long' });

  if(type && type === 'month') {
    return `${month} ${date.getFullYear()}`;
  }

  return `${date.getDate()} ${month} ${date.getFullYear()}`;
};

export default formatDate;

