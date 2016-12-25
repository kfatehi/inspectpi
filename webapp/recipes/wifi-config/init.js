var actionHandler = require('./action-handler');
var initialState = require('./initial-state');

module.exports = ({
  mounterStatus: { mounted, rootMountPath }
}) => {
  console.log('recipe init', mounted, rootMountPath);
  if ( mounted ) {
    return {
      actionHandler: actionHandler(rootMountPath),
      initialState,
    }
  } else {
    return {
      disabled: true,
      reason: "needs a mounted sd card"
    }
  }
}
