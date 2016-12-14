import React from 'react';

import { SimpleInput } from './SimpleInput';

export const SimplePrompt = React.createClass({
  getInitialState: function () {
    return { showInput: false }
  },
  render: function() {
    const { showInput } = this.state;
    const {
      startLabel,
      name,
      placeholder,
      handleSubmit
    } = this.props;
    if ( showInput ) {
      return <span>
        <SimpleInput
          name={name}
          placeholder={placeholder}
          handleSubmit={(val)=>{
            handleSubmit(val)
            this.setState({showInput: false});
          }}
        />
        <button onClick={()=>this.setState({showInput: false})}>
          Cancel
        </button>
      </span>
    } else {
      return <button onClick={()=>this.setState({showInput: true})}>
        {startLabel}
      </button>
    }
  }
})
