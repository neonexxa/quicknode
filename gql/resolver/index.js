const FieldResolver = (field, type) => (
  {
    type,
    resolve(item) {
      return item[field];
    },
  }
);

const QLMapper = (schemaObject) => {
  const FieldMapper = Object.assign({},
    ...Object.keys(schemaObject).map((key) => (
      { [key]: FieldResolver(key, schemaObject[key]) }
    )));
  return FieldMapper;
};

module.exports = { FieldResolver, QLMapper };
