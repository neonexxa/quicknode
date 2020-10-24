const _ = require('lodash');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../app');
const db = require('../../models');

chai.use(chaiHttp);
chai.should();
const { sample_zone, sample_city, sample_category } = require('./SampleData');
const { authenticated_get, authenticated_post } = require('./chai-passport-user');

describe('General Test', () => {
  it('Get Static Data', (done) => {
    chai
      .request(server)
      .get('/staticdata')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('data');
        res.body.data.should.have.property('role');
        res.body.data.should.have.property('organization');
        res.body.data.should.have.property('buildingtype');
        res.body.data.should.have.property('pbt');
        res.body.data.should.have.property('nationaltype');
        res.body.data.should.have.property('emissiontype');
        res.body.data.should.have.property('emissionkey');
        res.body.data.should.have.property('emissiondatakey');
        res.body.data.should.have.property('nationalreportingkey');
        res.body.data.should.have.property('nationalgpskey');
        res.body.data.should.have.property('nationalnebkey');
        res.body.data.should.have.property('nationalwastekey');
        res.body.data.should.have.property('nationalmobilitykey');
        res.body.data.should.have.property('states');
        res.body.data.should.have.property('solutionpresettypes');
        res.body.data.should.have.property('cities');
        res.body.data.should.have.property('investmentcategory');
        res.body.data.should.have.property('procurementcategory');
        done();
      });
  });
});

describe('Add Static Data', () => {
  // todo test
  it('Add New City', async () => {
    await db.City.destroy({ truncate: true });
    const res = await authenticated_post('/api/city', {
      data: { input: sample_city },
    });
    res.should.have.status(200);
    // verify inserted
    const city = await db.City.findOne({ where: { name: sample_city.name } });
    city.name.should.equal(sample_city.name);
    city.StateId.should.equal(sample_city.StateId);
  });
  it('Add New Investment Category', async () => {
    await db.InvestmentCategory.destroy({ truncate: true });
    const res = await authenticated_post('/api/investmentcategory', {
      data: { input: sample_category },
    });
    res.should.have.status(200);
    // verify inserted
    const item = await db.InvestmentCategory.findOne({ where: { name: sample_category.name } });
    item.name.should.equal(sample_category.name);
  });
  it('Add New Procurement Category', async () => {
    await db.ProcurementCategory.destroy({ truncate: true });
    const res = await authenticated_post('/api/procurementcategory', {
      data: { input: sample_category },
    });
    res.should.have.status(200);
    // verify inserted
    const item = await db.ProcurementCategory.findOne({ where: { name: sample_category.name } });
    item.name.should.equal(sample_category.name);
  });
});

const zone_value = {
  baseline_population: 500,
  project_population: 700,
  size_zone_area: 300,
  size_pbt_area: 400,
};
describe('Filter zone by state and city', () => {
  beforeEach(async () => {
    await db.Zone.destroy({ truncate: true });
    await db.Zone.bulkCreate([
      {
        ...sample_zone, ...zone_value, state: 'selangor', city: 'bangi',
      },
      {
        ...sample_zone, ...zone_value, state: 'perak', city: 'taiping',
      },
      {
        ...sample_zone, ...zone_value, state: 'perak', city: 'ipoh',
      },
      {
        ...sample_zone, ...zone_value, state: 'perak', city: 'ipoh',
      },
    ]);
  });

  it('nofilter', async () => {
    const res = await authenticated_get('/map-sidepanel-info');
    const db_data = _.mapValues(zone_value, v => v * 4);
    res.body.data.should.deep.equal(db_data);
  });
  it('city1', async () => {
    const res = await authenticated_get('/map-sidepanel-info?city=ipoh');
    const db_data = _.mapValues(zone_value, v => v * 2);
    res.body.data.should.deep.equal(db_data);
  });
  it('city2', async () => {
    const res = await authenticated_get('/map-sidepanel-info?city=taiping');
    res.body.data.should.deep.equal(zone_value);
  });
  it('state1 ', async () => {
    const res = await authenticated_get('/map-sidepanel-info?state=selangor');
    res.body.data.should.deep.equal(zone_value);
  });
  it('state2 ', async () => {
    const res = await authenticated_get('/map-sidepanel-info?state=perak');
    const db_data = _.mapValues(zone_value, v => v * 3);
    res.body.data.should.deep.equal(db_data);
  });
});
