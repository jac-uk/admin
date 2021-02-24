const authorisedUsers = [
  'maria.brookes@judicialappointments.digital',
  'warren.searle@judicialappointments.digital',
  'tom.russell@judicialappointments.digital',
  'kate.malone@judicialappointments.digital',
  'joy.adeagbo@judicialappointments.digital',
];

const authorisedToPerformAction = async (email) => {
  return authorisedUsers.includes(email);
};

export {
  authorisedToPerformAction
};

