const zeroPad = (val) => {
  if(typeof val !== 'number') {
    return null;
  }
  
  return val.toString().padStart(2, '0');
};

export default zeroPad;
