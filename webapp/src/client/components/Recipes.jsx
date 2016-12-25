import React from 'react';

const recipeUserInterfaces = require('../../recipe-user-interfaces');

export const Recipes = React.createClass({
  render: function() {
    const {
      recipes,
    } = this.props;

    const getRecipe = (id) => {
      const Recipe = recipeUserInterfaces[id];
      return <Recipe key={id} />
    }

    return <div>
      <h1>Recipes</h1>
      { recipes.length > 0 ? recipes.map(r=><div key={r}>
        <h2>{r}</h2>
        {getRecipe(r)}
      </div>) : <p>No recipes</p> }
    </div>;
  }
});
