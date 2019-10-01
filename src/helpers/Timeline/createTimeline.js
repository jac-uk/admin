const createTimeline = (timeline, min) => {
  let timelineArray = timeline.filter((item) => item.date !== null);
  
  if(min) {
    return timelineArray.slice(0, min);
  }

  return timelineArray;
};

export default createTimeline;
