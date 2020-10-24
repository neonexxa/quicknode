const { sequelize } = require('./models/index.js');
// Require our models. Running each module registers the model into sequelize
// so any other part of the application can simply call sequelize.model('User')
// to get access to the User model.
// require('./models');

module.exports = sequelize;
