const m = require('../models');

function index(req, res) {
  m.Role.findAll()
    .then((data) => res.json({ data }))
    .catch((e) => res.status(500).send({ error: e }));
}

module.exports = { index };
