const { recipes } = require('../config');

module.exports = recipes.reduce((acc, recipe) => Object.assign({}, acc, {
  [recipe]: require('../recipes/'+recipe+'/action-handler')
}), {});
