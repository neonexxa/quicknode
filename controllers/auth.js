const passport = require('passport');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const randtoken = require('rand-token');

const refreshTokens = {};

function login(req, res, next) {
  passport.authenticate('login', async (err, user, info) => {
    try {
      if (err || !user) {
        res.status(401).json({ error: 'fail to authenticate user', details: info.message });
        return;
      }
      req.login(user, { session: false }, async (error) => {
        if (error) next(error);
        if (user.reset_token) user.update({ reset_token: null });
        const jwt_content = { uid: user.id, email: user.email, role: 'admin' };
        // Sign the JWT token and populate the payload with the user email and id
        // Send back the token to the user
        const token = jwt.sign(jwt_content, process.env.PROJECT_JWT_SECRET, { expiresIn: 86400 });
        const refreshToken = randtoken.uid(256);
        refreshTokens[refreshToken] = user.email;
        res.json({ token, refreshToken });
      });
    } catch (error) {
      next(error);
    }
  })(req, res, next);
}

function signup(req, res, next) {
  passport.authenticate('signup', { session: false }, async (err, user, info) => {
    try {
      if (err || !user) res.status(401).json({ error: 'fail to register user', message: info.message });
      res.status(201).json({ user });
    } catch (error) {
      next(error);
    }
  })(req, res, next);
}

function passwordResetTokenValidation(req, res, next) {
  passport.authenticate('forgotpasswordjwt', async (err, user) => {
    try {
      if (err || !user) {
        res.status(404).json({ error: err || 'User not found' });
      } else if (!user.reset_token || user.reset_token !== req.body.token) {
        res.status(422).json({ error: 'Token is invalid' });
      } else {
        res.json({ status: true });
      }
      next();
    } catch (error) {
      res.status(500).json({ error });
      next();
    }
  })(req, res, next);
}

function passwordReset(req, res, next) {
  passport.authenticate('forgotpasswordjwt', async (err, user) => {
    try {
      if (err || !user) {
        res.status(404).json({ error: err });
        return;
      }
      if (!user.reset_token || user.reset_token !== req.body.token) {
        res.status(422).json({ error: 'Token is invalid' });
        return;
      }
      user.update({
        password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync()),
        reset_token: null,
      });
      res.json({ status: 'successfuly update user password' });
    } catch (error) {
      res.status(500).json({ error });
    }
  })(req, res, next);
}

module.exports = {
  login, signup, passwordResetTokenValidation, passwordReset,
};
