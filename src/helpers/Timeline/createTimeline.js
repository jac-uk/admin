const createTimeline = (timeline, maxEntriesNum) => {
  let timelineArray = timeline.filter((item) => item.date !== null).sort(ascendingDate);

  if(maxEntriesNum) {
    return timelineArray.slice(0, maxEntriesNum);
  }

  return timelineArray;
};

const ascendingDate = ( item1, item2 ) => {
  if (item1.date < item2.date) {
    return -1;
  } else if (item1.date > item2.date) {
    return 1;
  } else {
    return 0;
  }
};

export default createTimeline;
