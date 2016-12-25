const initialState = require('./initial-state');
const actionHandler = require('./action-handler');
const Promise = require('bluebird');
const stat = Promise.promisify(require('fs').stat);
const filePaths = require('./file-paths');

// a recipe is initialized with the application state,
// as documented in src/initial-state.js
// if a recipe wishes to access the state of another
// recipe, it must be ordered in the correct way
// in the config file, and then such state will 
// be accessible too.
//
// this function decides if the recipe is to be enabled
// or disabled based on the state of the system
//
// this function can return a promise if the decision
// is to be made asynchronously, but it must return
// or resolve either a function or an object like this:
// { disabled: true, reason: 'why it is disabled' }
module.exports = ({
  mounterStatus: { mounted, rootMountPath }
}) => {
  if ( mounted ) {
    const { targetFile } = filePaths(rootMountPath);
    return stat(targetFile).then(
      // a recipe, if activated, must return a function
      // that will handle actions from the UI
      ()=> actionHandler,
      (err)=> ({
        disabled: true,
        reason:err.message
      })
    )
  } else {
    return {
      // if disabled, it must be marked as such
      disabled: true,
      // and a reason provided
      reason: "needs a mounted sd card"
    }
  }
}
