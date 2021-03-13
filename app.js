require('dotenv').config();
const express = require('express');
const { graphqlHTTP } = require('express-graphql'); // comment this if dont need graphql

const app = express();
const PORT = process.env.PORT || 3001;
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const multer = require('multer');

const upload = multer();
const custommiddleware = require('./middleware');
const schema = require('./gql/schema'); // comment this if dont need graphql
// routes
const openRoute_lists = require('./routes/open');
const secureRoute_list = require('./routes/secure');
// middlewares
app.use(cors());

// for parsing application/json
app.use(bodyParser.json());
// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: false }));

// for parsing multipart/form-data
app.use(upload.array());
app.use(express.static('public'));

// passport
require('./passport-loader');

app.use(passport.initialize());
app.use(passport.session());
// for serializing user data
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

if (process.env.APPLICATION_DEBUG === 'true') app.use(custommiddleware.ReqLogger);
// end of middleware

// Registering API
app.use('/graphql-api', graphqlHTTP({ schema, graphiql: true })); // comment this if dont need graphql
app.use('/api', passport.authenticate('jwt'), secureRoute_list);
app.use('/', openRoute_lists);

app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
});

module.exports = app;
