const Sequelize = require('sequelize');
const faker = require('faker');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];

const getActualRequestDurationInMilliseconds = (start) => {
  const NS_PER_SEC = 1e9; //  convert to nanoseconds
  const NS_TO_MS = 1e6; // convert to milliseconds
  const diff = process.hrtime(start);
  return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS;
};

const encoderBase64 = (str_hash, encode = true) => {
  // eslint-disable-next-line new-cap
  if (encode) return (new Buffer.from(str_hash.toString())).toString('base64');

  // eslint-disable-next-line new-cap
  return (new Buffer.from(str_hash, 'base64')).toString();
};

function pad(hex) {
  return (hex.length === 1 ? `0${hex}` : hex);
}

const rgbToHex = (red, green, blue) => {
  const redHex = red.toString(16);
  const greenHex = green.toString(16);
  const blueHex = blue.toString(16);

  return pad(redHex) + pad(greenHex) + pad(blueHex);
};

function removeTrailingSymbolFromUrl(url) {
  return url.replace(/\/+$/, '').replace(/#+$/, '').replace(/\?+$/, '');
}

function queryParameters(args) {
  const { req, search_columns: sc } = args;
  let { where = {} } = args;

  const { or, like, iLike } = Sequelize.Op;
  const {
    page = 1, perpage = 30, keyword, sortby,
  } = req.query;

  if (keyword && sc) {
    where = {
      ...where,
      [or]: sc.map(c => ({ [c]: { [config.dialect === 'postgres' ? iLike : like]: `%${keyword}%` } })),
    };
  }
  const order = {};
  if (sortby) {
    order.order = [sortby.split(',')];
  }

  return {
    Sequelize,
    page: parseInt(page, 10),
    perpage: parseInt(perpage, 10),
    where,
    keyword,
    order,
    offset: (page - 1) * perpage,
  };
}

function getRandomImage() {
  return `https://picsum.photos/${faker.random.number({ min: 100, max: 300 })}/${faker.random.number({ min: 100, max: 300 })}`;
}

function bulk_upsert(model, rows) {
  return Promise.all(rows.map(async (row) => {
    await model.upsert(row);
  }));
}

module.exports = {
  getActualRequestDurationInMilliseconds,
  encoderBase64,
  rgbToHex,
  removeTrailingSymbolFromUrl,
  queryParameters,
  getRandomImage,
  bulk_upsert,
};
