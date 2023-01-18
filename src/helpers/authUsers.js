const authorisedUsers = [
  'drie@judicialappointments.digital',
  'warren.searle@judicialappointments.digital',
  'tom.russell@judicialappointments.digital',
  'andrew.isaac@judicialappointments.digital',
  'blaise.buckland@judicialappointments.digital',
  'halcyon@judicialappointments.digital',
  'lisias.loback@judicialappointments.digital',
  'digitalteam@judicialappointments.digital',
  'seniorleader@judicialappointments.digital',
  'jacstaff@judicialappointments.digital',
  'readonly@judicialappointments.digital',
];

const authorisedToPerformAction = async (email) => {
  return authorisedUsers.includes(email);
};

export {
  authorisedToPerformAction
};

