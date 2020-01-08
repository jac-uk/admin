const createTimeline = (timeline, maxEntriesNum) => {
  let timelineArray = timeline.filter((item) => item.date !== null);

  if(maxEntriesNum) {
    return timelineArray.slice(0, maxEntriesNum);
  }

  return timelineArray;
};

export default createTimeline;
