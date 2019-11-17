const users = {
  username: 'amo',
  password: 12345,
  firstname: 'amin',
  lastname: 'henry',
  publicKey: 'alien',
  email: 'alien@gmial.com'
};

const newUser = {
  username: 'henry',
  password: 54321,
  firstname: 'henry',
  lastname: 'henry',
  publicKey: 'human',
  email: 'human@gmial.com'
};
const name = newUser[username];

export default function request(name) {
  return new Promise((resolve, reject) => {
    const username = name;
    process.nextTick(() =>
      users[username]
        ? resolve(users[username])
        : reject({
          error: 'Username already exists'
        }),
    );
  });
}