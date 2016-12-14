import React from 'react';

export const SimpleInput = React.createClass({
  getInitialState: function () {
    return { value:this.props.initialValue||'' }
  },
  handleChange: function(event) {
    this.setState({ value: event.target.value });
  },
  handleSubmit: function(event) {
    event.preventDefault();
    this.props.handleSubmit(this.state.value);
  },
  handleCancel: function(event) {
    event.preventDefault();
    this.props.handleCancel();
  },
  render: function() {
    const {
      name,
      placeholder,
      initialValue,
      handleCancel,
      type,
    } = this.props
    return <form onSubmit={this.handleSubmit}>
      <input autoFocus onChange={this.handleChange} name={name} placeholder={placeholder} value={this.state.value} type={type || "text"}/>
      <input type="submit" value="Submit"/>
      { handleCancel ? <button onClick={this.handleCancel}>Cancel</button> : null }
    </form>;
  }
})
