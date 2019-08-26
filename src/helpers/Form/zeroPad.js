const zeroPad = (val) => {
  if(val === 0) {
    return '00';
  }

  if(!val || typeof val !== 'number') {
    return null;
  }
  
  return val.toString().padStart(2, '0');
};

export default zeroPad;
