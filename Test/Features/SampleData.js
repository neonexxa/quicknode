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

const sample_zone = {
  lcc_reg_num: faker.random.number(),
  name: faker.name.findName(),
  state: faker.address.state(),
  city: faker.address.city(),
  baseline_year: 9999,
  baseline_population: faker.random.number(),
  project_year: 9999,
  project_population: faker.random.number(),
  zone_area_polygon: '[[12,12],[1,12],[1,1],[12,1],[12,12]]',
  size_zone_area: faker.random.number(),
  size_pbt_area: faker.random.number(),
  PbtId: 9999,
  default_waste_value: faker.random.arrayElement([1.17, 1.35]),
  OrganizationId: 9999,
};

const sample_partner = {
  lcc_reg_num: faker.random.number(),
  name: faker.name.findName(),
  address: faker.address.streetAddress(),
  address_2: faker.address.streetAddress(),
  state: faker.address.state(),
  city: faker.address.city(),
  baseline_year: 9999,
  baseline_population: faker.random.number(),
  project_year: 9999,
  project_population: faker.random.number(),
  location: `${faker.address.latitude()},${faker.address.longitude()}`,
  PartnerType: 'section',
  BuildingTypeId: 99999,
  PbtId: 9999,
  OrganizationId: 9999,
  ZoneId: 9999,
};

const sample_emissionparameter = {
  value: faker.random.float(),
  EmissionKeyId: 9999,
};

const sample_emissiondata = {
  year: 9999,
  value: faker.random.float(),
  EmissionDataKeyId: 9999,
  PartnerId: 9999,
};

const sample_nationalreporting = {
  year: 9999,
  value: faker.random.float(),
};

const sample_nationalgps = {
  year: 9999,
  value: faker.random.float(),
  NationalGpsCategoryId: faker.random.number({ min: 1, max: 3 }),
};

const sample_city = {
  name: 'zzzz',
  StateId: faker.random.number({ min: 1, max: 16 }),
};

const sample_category = {
  name: 'zzzz',
};

const sample_combineemission = [...Array(20)]
  .map(() => ({
    EmissionKeyId: faker.random.number({ min: 1, max: 20 }),
    EmissionTypeId: faker.random.number({ min: 1, max: 5 }),
    value: faker.random.float(),
  }));

const sample_nationalre = {
  category: faker.random.arrayElement(['Solar Farm', 'Hydro', 'Biomass', 'Biogas']),
  name: faker.name.findName(),
  year_comission: Math.floor((Math.random() * 2020) + 2016),
  year_last_updated: Math.floor((Math.random() * 2020) + 2016),
  latitude: faker.address.latitude(),
  longitude: faker.address.longitude(),
  installed_capacity: Math.floor(Math.random() * 10),
  average_generation_capacity: Math.floor(Math.random() * 1000),
};

const sample_nationalemgs = {
  category: faker.random.arrayElement(['EMGS-1 Star', 'EMGS-2 Star', 'EMGS-3 Star']),
  company: faker.name.findName(),
  year: Math.floor((Math.random() * 2020) + 2016),
  month: faker.random.number({ min: 1, max: 12 }),
  latitude: faker.address.latitude(),
  longitude: faker.address.longitude(),
  description: faker.lorem.sentence(),
};

const sample_nationalgtfs = {
  category: faker.random.arrayElement(['Category A', 'Category B', 'Category C']),
  projectname: faker.name.findName(),
  year_comission: Math.floor((Math.random() * 2020) + 2016),
  latitude: faker.address.latitude(),
  longitude: faker.address.longitude(),
  description: faker.lorem.sentence(),
};

const sample_nationalneb = [...Array(20)]
  .map(() => ({
    NationalNebKeyId: faker.random.number({ min: 1, max: 10 }),
    year: Math.floor((Math.random() * 2015) + 2010),
    value: faker.random.float(),
  }));

const sample_nationalmobility = {
  NationalMobilityKeyId: faker.random.number({ min: 1, max: 4 }),
  name: faker.name.findName(),
  year_comission: Math.floor((Math.random() * 2020) + 2016),
  latitude: faker.finance.amount(2.733060, 3.203292, 6),
  longitude: faker.finance.amount(101.417235, 102.250022, 6),
  description: faker.lorem.sentence(),
};
const sample_nationalwaste = {
  NationalWasteKeyId: faker.random.number({ min: 1, max: 2 }),
  name: faker.name.findName(),
  latitude: faker.finance.amount(2.733060, 3.203292, 6),
  longitude: faker.finance.amount(101.417235, 102.250022, 6),
  description: faker.lorem.sentence(),
};

module.exports = {
  admin_user,
  normal_user,
  sample_zone,
  sample_partner,
  sample_emissionparameter,
  sample_emissiondata,
  sample_nationalreporting,
  sample_nationalgps,
  sample_city,
  sample_category,
  sample_combineemission,
  sample_nationalre,
  sample_nationalneb,
  sample_nationalemgs,
  sample_nationalgtfs,
  sample_nationalmobility,
  sample_nationalwaste,
};
