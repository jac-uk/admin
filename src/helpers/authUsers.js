const authorisedUsers = [
  'warren.searle@judicialappointments.digital',
  'tom.russell@judicialappointments.digital',
  'andrew.isaac@judicialappointments.digital',
  'blaise.buckland@judicialappointments.digital',
  'halcyon@judicialappointments.digital',
];

const authorisedToPerformAction = async (email) => {
  return authorisedUsers.includes(email);
};

export {
  authorisedToPerformAction
};

