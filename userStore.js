// userStore.js  
const users = [];

// 유저 추가
function addUser(user) {
  users.push(user);
}

// 이메일로 유저 찾기
function findUserByEmail(email) {
  return users.find((u) => u.email === email);
}

module.exports = {
  users,
  addUser,
  findUserByEmail
};
