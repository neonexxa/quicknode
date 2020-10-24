const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = require('assert');
const bcrypt = require('bcrypt');
const { authenticated_post } = require('./chai-passport-user');
const db = require('../../models');

chai.use(chaiHttp);
chai.should();

describe('Update Users', () => {
  it('updates name', async () => {
    const user = await db.User.create({ name: 'oldname' });
    const res = await authenticated_post(`/api/user/${user.id}`, {
      data: { name: 'newname' },
    });
    res.should.have.status(200);
    await user.reload();
    user.name.should.equal('newname');
  });

  it('updates phone', async () => {
    const user = await db.User.create({ phone: 'oldphone' });
    const res = await authenticated_post(`/api/user/${user.id}`, {
      data: { phone: 'newphone' },
    });
    res.should.have.status(200);
    await user.reload();
    user.phone.should.equal('newphone');
  });

  it('updates password', async () => {
    const user = await db.User.create({ password: bcrypt.hashSync('old_password', bcrypt.genSaltSync()) });
    const res = await authenticated_post(`/api/user/${user.id}`, {
      data: { old_password: 'old_password', new_password: 'new_password' },
    });
    res.should.have.status(200);
    await user.reload();
    assert(bcrypt.compare('new_password', user.password));
  });
});
