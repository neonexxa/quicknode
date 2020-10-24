const faker = require('faker');
const bcrypt = require('bcrypt');
const chai = require('chai');
const assert = require('assert');
const chaiHttp = require('chai-http');
const db = require('../../models');
const server = require('../../app');
const { admin_user } = require('./SampleData');

chai.use(chaiHttp);
chai.should();

describe('Auth Test', () => {
  beforeEach(async () => {
    await db.User.findOrCreate({
      where: { email: admin_user.email },
      defaults: admin_user,
    });
  });
  afterEach(async () => {
    await db.User.destroy({ where: { email: admin_user.email }, truncate: true });
  });

  it('Attempt Loggin', async () => {
    const res = await chai.request(server)
      .post('/login')
      .type('json')
      .send({ email: admin_user.email, password: admin_user.raw_password });
    res.should.have.status(200);
    res.body.should.have.property('token');
    res.body.should.have.property('refreshToken');
  });
  it('Wrong Password Login', async () => {
    const login2 = { email: admin_user.email, password: 'password3' };
    const res = await chai
      .request(server)
      .post('/login')
      .type('json')
      .send(login2);
    res.should.have.status(401);
    res.body.should.have.property('error');
  });
  it('Attemp Signup', async () => {
    const user = {
      email: faker.internet.email(),
      password: bcrypt.hashSync('password', bcrypt.genSaltSync()),
      phone: faker.phone.phoneNumber(),
      name: faker.name.findName(),
      RoleId: 1,
    };
    const res = await chai
      .request(server)
      .post('/signup')
      .type('json')
      .send(user);
    res.should.have.status(201);
    res.body.should.have.property('user');
  });
  it('Duplicate data signup', async () => {
    const res = await chai
      .request(server)
      .post('/signup')
      .type('json')
      .send(admin_user);
    res.should.have.status(401);
    res.body.should.have.property('error');
  });
  it('Request forgot password', async () => {
    const res = await chai
      .request(server)
      .post('/forgot-password')
      .type('json')
      .send({ redirect_url: 'https://bandar-os.netlify.app/reset-password', email: admin_user.email });
    res.should.have.status(200);
    res.body.should.have.property('data');
    const user = await db.User.findOne({ where: { email: admin_user.email } });
    assert(!!user.reset_token, 'token not found');
  });
  it('Validate Token', async () => {
    await chai.request(server)
      .post('/forgot-password')
      .type('json')
      .send({ email: admin_user.email });
    const { reset_token } = await db.User.findOne({ where: { email: admin_user.email } });
    const res = await chai.request(server)
      .post('/verify-reset-password-token')
      .type('json')
      .send({ token: reset_token });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.status, true);
  });
  it('Reset Token', async () => {
    await chai.request(server)
      .post('/forgot-password')
      .type('json')
      .send({ email: admin_user.email });
    const { reset_token } = await db.User.findOne({ where: { email: admin_user.email } });
    const res = await chai.request(server)
      .post('/reset-password')
      .type('json')
      .send({ password: 'neopassword', token: reset_token });
    assert.strictEqual(res.body.status, 'successfuly update user password', 'Fail to update password');
  });
});
