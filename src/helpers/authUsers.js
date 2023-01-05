const authorisedUsers = [
  'digitalteam@judicialappointments.digital',
  'warren.searle@judicialappointments.digital',
  'tom.russell@judicialappointments.digital',
  'andrew.isaac@judicialappointments.digital',
  'blaise.buckland@judicialappointments.digital',
  'halcyon@judicialappointments.digital',
  'lisias.loback@judicialappointments.digital',
  'adam-senior-leaders@judicialappointments.digital',
];

const authorisedToPerformAction = async (email) => {
  return authorisedUsers.includes(email);
};

export {
  authorisedToPerformAction
};

