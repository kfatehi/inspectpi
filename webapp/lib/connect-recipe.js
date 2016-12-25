import { connect } from 'react-redux';

export const recipe = (id, actionsBuilder, component) => {
  const mapper = (state)=> {
    const recipeState =  state['recipeStates'][id];
    console.log('RECIPESTATE', id, recipeState);
    return recipeState;
  }
  const makeAction = meta => (type, data={}) => ({
    meta: Object.assign({}, meta, { recipe: id }),
    type, data
  });
  const actionCreators = actionsBuilder({
    local: makeAction({remote: false}),
    remote: makeAction({remote: true}),
  });
  console.log(actionCreators);
  return connect(mapper, actionCreators)(component);
}
