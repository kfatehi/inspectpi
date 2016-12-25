const { recipes } = require('../config');

module.exports = filename => recipes.reduce((acc, recipe) => Object.assign({}, acc, {
  [recipe]: require('../recipes/'+recipe+'/'+filename)
}), {});
