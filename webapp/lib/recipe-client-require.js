const { recipes } = require('../config');

module.exports = resource => recipes.reduce((acc, recipe) => {
  // we have to do this because otherwise webpack will try to require everything
  // and configuring webpack for this is more of a PITA than just doing the following
  let ui;
  try {
    // nasty hack because we want to use this module from node
    // and so the jsx require is going to fail, but when run
    // from node, we are actually trying to get the initialState
    // module, not this one, so just fail silently
    ui = require('../recipes/'+recipe+'/user-interface.jsx')
  } catch (e) {
    // pass
  }
  let resources = {
    'user-interface': ui,
    'initial-state': require('../recipes/'+recipe+'/initial-state.js'),
  }
  return Object.assign({}, acc, {
    [recipe]: resources[resource]
  })
}, {})
