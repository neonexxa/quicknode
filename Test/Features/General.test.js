const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../app');

chai.use(chaiHttp);
chai.should();

describe('Live Test', () => {
  it('Test Server Is Alive', (done) => {
    chai
      .request(server)
      .get('/')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.message.should.equal('Its Alive');
        done();
      });
  });
});

describe('General Test', () => {
  it('Get Static Data', (done) => {
    chai
      .request(server)
      .get('/staticdata')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('data');
        res.body.data.should.have.property('role');
        done();
      });
  });
});
