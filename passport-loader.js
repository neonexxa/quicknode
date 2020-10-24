const LocalStrategy = require('passport-local').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const JWTstrategy = require('passport-jwt').Strategy;
const passport = require('passport');
const bcrypt = require('bcrypt');
const moment = require('moment');
const { encoderBase64 } = require('./helper');
// load user model
const UserModel = require('./models').User;

// Signup passport
passport.use('signup', new LocalStrategy({ usernameField: 'email', passwordField: 'password', passReqToCallback: true },
  async (req, uname, pass, done) => {
    const {
      name, email, password, phone,
    } = req.body;
    UserModel.findOne({ where: { email } }).then((user) => {
      if (user) return done(null, false, { message: 'That email is already taken' });
      const hashpass = bcrypt.hashSync(password, bcrypt.genSaltSync());
      const data = {
        name, email, password: hashpass, phone,
      };
      UserModel.create(data).then((newUser) => {
        if (!newUser) return done(null, false);
        if (newUser) return done(null, newUser);
        return null;
      });
      return null;
    });
  }));

// Login passport
passport.use('login', new LocalStrategy({ usernameField: 'email', passwordField: 'password' },
  async (email, password, done) => {
    try {
      // Find the user associated with the email/username provided by the user
      const user = await UserModel.findOne({ where: { email } });
      if (!user) return done(null, false, { message: 'User not found' });
      // Validate password & make sure it matches with the corresponding hash stored in the database
      // If the passwords match, it returns a value of true.
      const validate = await bcrypt.compare(password, user.password);
      if (!validate) return done(null, false, { message: 'Wrong Password' });
      // //Send the user information to the next middleware
      return done(null, user, { message: 'Logged in Successfully' });
    } catch (error) {
      return done(error, false, { message: error });
    }
  }));

// JWT passport
passport.use('jwt', new JWTstrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.PROJECT_JWT_SECRET,
}, async (jwt_payload, done) => {
  const user = await UserModel.findOne({ where: { id: jwt_payload.uid } });
  if (user) {
    return done(null, user);
  }
  return done(null, false);
}));

passport.use('forgotpasswordjwt', new JWTstrategy({
  jwtFromRequest: ExtractJWT.fromBodyField('token'),
  secretOrKey: process.env.PROJECT_JWT_SECRET,
}, async (jwt_payload, done) => {
  const user = await UserModel.findOne({ where: { id: encoderBase64(jwt_payload.uid, false) } });
  if (!user) return done('Fail to validate user', false); // not valid user
  if (moment().unix() > encoderBase64(jwt_payload.token, false)) return done('Token expired', false); // expired
  if (user) return done(null, user);
  return null;
}));
