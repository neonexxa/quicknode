const faker = require('faker');
const bcrypt = require('bcrypt');

const admin_user = {
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: bcrypt.hashSync('password', bcrypt.genSaltSync()),
  raw_password: 'password',
  verifiedAt: '2020-10-01T04:07:29.000Z',
  phone: faker.phone.phoneNumber(),
  RoleId: 1,
};

const normal_user = {
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: bcrypt.hashSync('password', bcrypt.genSaltSync()),
  raw_password: 'password',
  verifiedAt: '2020-10-01T04:07:29.000Z',
  phone: faker.phone.phoneNumber(),
  RoleId: 3,
};

module.exports = {
  admin_user,
  normal_user,
};
