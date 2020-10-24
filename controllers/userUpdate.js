const bcrypt = require('bcrypt');
const m = require('../models');

async function update(req, res) {
  // TODO handle image & email update
  const {
    new_password, old_password,
  } = req.body;

  const fields = {};
  const fileds_that_allowed_to_be_update_directly = ['name', 'phone'];
  fileds_that_allowed_to_be_update_directly.forEach(f => {
    if (req.body[f]) {
      fields[f] = req.body[f];
    }
  });

  if (new_password && old_password) {
    const user = await m.User.findOne({ where: { id: req.params.UserId } });
    if (!bcrypt.compare(old_password, user.password)) {
      res.status(422).send({ error: 'Wrong old password' });
      return;
    }
    fields.password = bcrypt.hashSync(new_password, bcrypt.genSaltSync());
  }

  try {
    await m.User.update(fields, { where: { id: req.params.UserId } });
    res.json({ status: 'updated' });
  } catch (error) {
    res.status(500).send({ error });
  }
}

module.exports = {
  update,
};
