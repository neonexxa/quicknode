const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLList,
} = require('graphql');

const db = require('../../models');
const { QLMapper } = require('../resolver');
const schemaStruc = require('./struct');

const QueryMapper = () => {
  const GQLQuery = Object.keys(schemaStruc).map((name) => {
    const attributes = Object.keys(schemaStruc[name]);
    const args = Object.assign({},
      ...attributes.map((colName) => ({
        [colName]: { type: schemaStruc[name][colName] },
      })));
    const QLObjectStruc = new GraphQLObjectType({
      name,
      description: ` list of all ${name}`,
      fields: () => QLMapper(schemaStruc[name]),
    });
    const type = new GraphQLList(QLObjectStruc);

    return (
      {
        [name]: {
          type,
          args,
          resolve(root, where) {
            return db[name].findAll({ where, attributes });
          },
        },
      }
    );
  });
  return Object.assign({}, ...GQLQuery);
};

const Query = new GraphQLObjectType({
  name: 'Query',
  description: 'Root query object',
  fields: QueryMapper(),
});

const Schema = new GraphQLSchema({ query: Query });
module.exports = Schema;
