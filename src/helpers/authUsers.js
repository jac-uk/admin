const authorisedUsers = [
  'warren.searle@judicialappointments.digital',
  'tom.russell@judicialappointments.digital',
  'joy.adeagbo@judicialappointments.digital',
  'halcyon@judicialappointments.digital',
];

const authorisedToPerformAction = async (email) => {
  return authorisedUsers.includes(email);
};

export {
  authorisedToPerformAction
};

