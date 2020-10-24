const moment = require('moment');
const jwt = require('jsonwebtoken');
const helper = require('../helper');
const { encoderBase64, removeTrailingSymbolFromUrl } = require('../helper');
const m = require('../models');
const svc = require('../services');

async function index(req, res) {
  const {
    where, page, perpage, Sequelize, offset, order,
  } = helper.queryParameters({ req, search_columns: ['name', 'email'] });

  const { verified } = req.query;

  if (verified === '1') {
    where.verifiedAt = { [Sequelize.Op.ne]: null };
  } else if (verified === '0') {
    where.verifiedAt = null;
  }

  try {
    const data = await m.User.findAndCountAll({
      where,
      attributes: { exclude: ['password'] },
      limit: perpage,
      offset,
      ...order,
    });
    res.json({
      data: data.rows, page, perpage, total: data.count,
    });
  } catch (error) {
    res.status(500).json({ error });
  }
}

function getDetails(req, res) {
  const id = (req.query.id) ? req.query.id : req.user.id;
  if (req.user.RoleId === 1 || req.user.id === parseInt(id, 10)) {
    m.User.findOne({
      attributes: { exclude: ['password', 'updatedAt', 'reset_token'] },
      where: { id },
      include: [{ model: m.Role, attributes: ['id', 'name'] }, { model: m.Organization, attributes: ['id', 'name'] }],
    })
      .then((data) => res.json({ data }))
      .catch((e) => res.status(500).send({ error: e }));
  } else {
    res.status(403).send({ error: 'access denied' });
  }
}

function passwordForgot(req, res) {
  m.User.findOne({ where: { email: req.body.email } })
    .then(async (user) => {
      if (!user) {
        res.status(404).send({ data: 'user not found' });
        return;
      }

      const today_crypt = encoderBase64(moment().unix() + 86400000);
      const content = {
        uid: encoderBase64(user.id),
        token: today_crypt,
      };

      const token = jwt.sign(content, process.env.PROJECT_JWT_SECRET);
      await user.update({ reset_token: token });
      const url = `${removeTrailingSymbolFromUrl(req.body.redirect_url)}?token=${token}`;

      svc.sendMailForgotPassword(url, user);
      res.send({ data: 'successfuly request for password reset' });
    })
    .catch((e) => res.status(500).send({ error: e }));
}

function verifyUser(req, res) {
  m.User.findOne({ where: { id: req.body.id } })
    .then((user) => {
      if (!user) {
        res.status(404).send({ data: 'user not found' });
        return;
      }
      user.update({ verifiedAt: moment().format('YYYY-MM-DD HH:mm:ss') });
      res.json({ status: 'approved' });
    })
    .catch((e) => res.status(500).send({ error: e }));
}

module.exports = {
  getDetails, passwordForgot, verifyUser, index,
};
