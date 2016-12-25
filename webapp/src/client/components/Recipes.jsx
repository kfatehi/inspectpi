import React from 'react';

const recipeClientRequire = require('../../../lib/recipe-client-require');

const recipeUserInterfaces = recipeClientRequire('user-interface');

export const Recipes = React.createClass({
  render: function() {
    const {
      recipes,
      reloadRecipe
    } = this.props;

    console.log('recipes', recipes);

    const btnReload = (name) => <button onClick={()=>reloadRecipe(name)}>
      Reload
    </button>;

    const getRecipe = ({name, disabled, reason}) => {
      if ( disabled ) {
        return <p>Recipe {name} disabled: {reason} {btnReload(name)}</p>
      } else {
        const Recipe = recipeUserInterfaces[name];
        return <div>
          <h2>{name}</h2>
          <Recipe />
        </div>
      }
    }

    return <div>
      <h1>Recipes</h1>
      { recipes.length > 0 ? recipes.map(r=><div key={r.name}>
        {getRecipe(r)}
      </div>) : <p>No recipes</p> }
    </div>;
  }
});
