const sequelize = require('sequelize');
const m = require('../models');

function index(req, res) {
  res.json({ message: 'Its Alive' });
}

module.exports = { index };
