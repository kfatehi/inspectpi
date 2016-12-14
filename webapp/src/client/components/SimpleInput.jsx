import React from 'react';

export const SimpleInput = React.createClass({
  getInitialState: function () {
    return { value:null }
  },
  handleChange: function(event) {
    this.setState({ value: event.target.value });
  },
  handleSubmit: function(event) {
    event.preventDefault();
    this.props.handleSubmit(this.state.value);
  },
  render: function() {
    const {
      name,
      placeholder,
    } = this.props
    return <form onSubmit={this.handleSubmit}>
      <input autoFocus onChange={this.handleChange} name={name} placeholder={placeholder} type="text"/>
      <input type="submit" value="Submit"/>
    </form>;
  }
})
