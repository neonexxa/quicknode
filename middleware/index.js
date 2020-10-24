const helper = require('../helper');

const ReqLogger = (req, res, next) => {
  const current_datetime = new Date();
  const formatted_date = `${current_datetime.getFullYear()
  }-${current_datetime.getMonth() + 1
  }-${current_datetime.getDate()
  } ${current_datetime.getHours()
  }:${current_datetime.getMinutes()
  }:${current_datetime.getSeconds()}`;
  const { method } = req;
  const { url } = req;
  const status = res.statusCode;
  const start = process.hrtime();
  const durationInMilliseconds = helper.getActualRequestDurationInMilliseconds(start);
  const log = `[${formatted_date}] ${method}:${url} ${status} ${durationInMilliseconds.toLocaleString()} ms`;
  console.log(log);
  next();
};

const requireAdminOrUser = (req, res, next) => {
  if (req.user.RoleId !== 1 && req.user.RoleId !== 2) {
    res.status(403).send({ error: 'access denied' });
    return;
  }
  next();
};
const requireAdmin = (req, res, next) => {
  if (req.user.RoleId !== 1) {
    res.status(403).send({ error: 'access denied' });
    return;
  }
  next();
};

module.exports = {
  ReqLogger,
  requireAdminOrUser,
  requireAdmin,
};
