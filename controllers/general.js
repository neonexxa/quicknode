const m = require('../models');

function index(req, res) {
  res.json({ message: 'Its Alive' });
}

async function staticdata(req, res) {
  try {
    const data = {};
    data.role = await m.Role.findAll({ attributes: ['id', 'name'] });
    res.json({ data });
  } catch (error) {
    res.status(500).json({ error });
  }
}

module.exports = { index, staticdata };
