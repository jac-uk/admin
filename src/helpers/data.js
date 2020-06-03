const transformStageData = stageData => {

  stageData.map(item => {
    
    // ###### CHANGE FLAGS FOR ISSUES
    let flag = false;
    const flags = item.flags;
    
    for (let key in flags) {
       if (flags.hasOwnProperty(key)) {
          if (flags[key] === true) {
            flag = true;
            break;
          }
       }
    }
    item.flagIssues = flag;
  });

  return stageData;
};

export { transformStageData };
