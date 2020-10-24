const m = require('../models');

function index(req, res) {
  const where = {};
  if (req.user.RoleId === 2) where.UserId = req.user.id;
  else if (req.query.UserId) where.UserId = req.query.UserId;
  m.ActivityLog.findAll({ where })
    .then((data) => res.json({ data }))
    .catch((e) => res.status(500).send({ error: e }));
}

module.exports = { index };
