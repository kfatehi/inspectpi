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
      initialValue,
      handleSubmit
    } = this.props;
    if ( showInput ) {
      return <span>
        <SimpleInput
          name={name}
          initialValue={initialValue}
          placeholder={placeholder}
          handleSubmit={(val)=>{
            handleSubmit(val)
            this.setState({showInput: false});
          }}
          handleCancel={()=>this.setState({showInput: false})}
        />
      </span>
    } else {
      return <button onClick={()=>this.setState({showInput: true})}>
        {startLabel}
      </button>
    }
  }
})
