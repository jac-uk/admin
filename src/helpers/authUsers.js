const authorisedUsers = [
  'maria.brookes@judicialappointments.digital',
  'warren.searle@judicialappointments.digital',
  'tom.russell@judicialappointments.digital',
  'lisias.loback@judicialappointments.digital',
  'rebecca.mcknight@judicialappointments.digital',
];

const authorisedToReset = async (email) => {
  return authorisedUsers.includes(email);
};

export {
  authorisedToReset
};

