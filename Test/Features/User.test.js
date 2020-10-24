const chai = require('chai');
const chaiHttp = require('chai-http');
const { authenticated_get } = require('./chai-passport-user');
const db = require('../../models');

chai.use(chaiHttp);
chai.should();

describe('Get Users as Admin', () => {
  it('Gets Users', async () => {
    const res = await authenticated_get('/api/users');
    res.should.have.status(200);
    res.body.should.have.property('data');
    res.body.should.have.property('page');
    res.body.should.have.property('perpage');
    res.body.should.have.property('total');
  });
});
describe('Get Users as Normal user', () => {
  it('gets denied', async () => {
    const res = await authenticated_get('/api/users', 'normal');
    res.should.have.status(403);
  });
});

describe('Filter users by verification status', () => {
  beforeEach(async () => {
    await db.User.destroy({ truncate: true });
    await db.User.bulkCreate([
      null,
      null,
      { verifiedAt: '2020-10-01T04:07:29.000Z' },
    ]);
  });

  it('Gets verified user', (done) => {
    authenticated_get('/api/users?verified=1').then((res) => {
      res.body.total.should.equal(2); // including authenticate user
      done();
    });
  });
  it('Gets unverified user', (done) => {
    authenticated_get('/api/users?verified=0').then((res) => {
      res.body.total.should.equal(2);
      done();
    });
  });
});

describe('Filter users by keyword', () => {
  beforeEach(async () => {
    await db.User.destroy({ truncate: true });
    await db.User.bulkCreate([
      { name: 'zzzz', email: 'aaaaa' },
      { name: 'aaaa', email: 'bbbb' },
    ]);
  });

  it('returns 2 users', (done) => {
    authenticated_get('/api/users?keyword=aaa').then((res) => {
      res.body.total.should.equal(2);
      done();
    });
  });

  it('returns 0 user', (done) => {
    authenticated_get('/api/users?keyword=xxxxxx').then((res) => {
      res.body.total.should.equal(0);
      done();
    });
  });

  it('returns 1 user', (done) => {
    authenticated_get('/api/users?keyword=zzz').then((res) => {
      res.body.total.should.equal(1);
      done();
    });
  });
});

describe('Sort users', () => {
  const users = [
    { name: 'zzzz', email: 'aaaaa' },
    { name: 'aaaa', email: 'bbbb' },
    { name: 'cccc', email: 'cccc' },
  ];

  beforeEach(async () => {
    await db.User.destroy({ truncate: true });
    await db.User.bulkCreate(users);
  });

  it('sorts ascending by name', (done) => {
    // set verified = 0 to exclude authenticate user
    authenticated_get('/api/users?sortby=name,asc&verified=0').then((res) => {
      res.body.data[0].name.should.equal(users[1].name);
      res.body.data[1].name.should.equal(users[2].name);
      res.body.data[2].name.should.equal(users[0].name);
      done();
    });
  });

  it('sorts descending by name', (done) => {
    // set verified = 0 to exclude authenticate user
    authenticated_get('/api/users?sortby=name,desc&verified=0').then((res) => {
      res.body.data[0].name.should.equal(users[0].name);
      res.body.data[1].name.should.equal(users[2].name);
      res.body.data[2].name.should.equal(users[1].name);
      done();
    });
  });

  it('sorts descending by email', (done) => {
    // set verified = 0 to exclude authenticate user
    authenticated_get('/api/users?sortby=email,desc&verified=0').then((res) => {
      res.body.data[0].name.should.equal(users[2].name);
      res.body.data[1].name.should.equal(users[1].name);
      res.body.data[2].name.should.equal(users[0].name);
      done();
    });
  });
});
