const user1 = {
  id: 1,
  displayName: 'Tom Smith',
  email: 'user 1 email',
  role: 'ADMIN',
};

const user2 = {
  id: 2,
  displayName: 'Julie Andrews',
  email: 'user 2 email',
  role: 'MANAGER',
};

const user3 = {
  id: 3,
  displayName: 'User',
  email: 'user 3 email',
  role: 'USER',
};

const user4 = {
  id: 4,
  displayName: 'SUPER USER',
  email: 'user 4 email',
  role: 'SUPERADMIN',
};

const users = [user1, user2, user3, user4];

const getUserObject = (userEmail) => {
  return users.filter(user => user.email === userEmail);
};

export {
  users, getUserObject
};
