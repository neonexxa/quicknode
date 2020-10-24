const chai = require('chai');
const db = require('../../models');
const server = require('../../app');
const { admin_user, normal_user } = require('./SampleData');

async function getNewToken(role = 'admin') {
  const user = role === 'admin' ? admin_user : normal_user;
  try {
    await db.User.create(user);
  } catch {
    console.log('');
  }
  const { res } = await chai.request(server)
    .post('/login')
    .type('json')
    .send({ email: user.email, password: user.raw_password });
  return res;
}

async function authenticated_get(api, role = 'admin') {
  const { token } = JSON.parse((await getNewToken(role)).text);
  const res = await chai.request(server)
    .get(api)
    .set('Authorization', `Bearer ${token}`);
  return res;
}

async function authenticated_delete(api, role = 'admin') {
  const { token } = JSON.parse((await getNewToken(role)).text);
  const res = await chai.request(server)
    .delete(api)
    .set('Authorization', `Bearer ${token}`);
  return res;
}

async function authenticated_post(api, options, role = 'admin') {
  const { token } = JSON.parse((await getNewToken(role)).text);
  const res = await chai.request(server)
    .post(api)
    .type(options.type || 'json')
    .set('Authorization', `Bearer ${token}`)
    .send(options.data);
  return res;
}

function destroy_user(user) {
  db.User.destroy({ where: { email: user.email } });
}

module.exports = {
  getNewToken, authenticated_get, authenticated_post, destroy_user, authenticated_delete,
};
