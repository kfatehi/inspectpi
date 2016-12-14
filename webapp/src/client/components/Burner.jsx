import React from 'react';

export const BurnerLoader = ({
  status: { burning },
  setInput,
  setOutput,
  target
}) => {
  return <div>
    { burning ? null : <div>
      { setInput ? 
          <button
            onClick={()=>setInput(target)}>
            Load in burner as Input
          </button> : null 
      }
      { setOutput ? 
          <button
            onClick={()=>setOutput(target)}>
            Load in burner as Output
          </button> : null 
      }
    </div>}
  </div>
}

export const Burner = React.createClass({
  render: function() {
    const {
      status: {
        infile,
        outfile,
        burning,
        pairKey,
        progress
      },
      start,
      interrupt
    } = this.props;

    if (burning) {
      return <div>
        <span>burn progress: {progress}</span>
        <button onClick={()=>interrupt()}>Interrupt burn</button>
      </div>
    } else {
      return <div>
        <p>infile {infile ? infile.name : 'none'}</p>
        <p>outfile {outfile ? outfile.name : 'none'}</p>
        { infile && outfile ? <div>
          { infile.size > outfile.size ? <span>
            infile too big for outfile
            </span> : <span>
            <button onClick={()=>start()}>Start burn</button>
          </span> }
        </div> : null }
      </div>
    }
  }
});

export const BurnHistory = ({ burns }) => <div>
  { burns.length > 0 ? <div>
    <h1>Previous Burns</h1>
    <ul>
      {burns.map(({
        timestamp,
        infile,
        outfile,
        success,
        reason
      })=><li key={timestamp.toLocaleString()}>
        {timestamp.toLocaleString()} {infile.name}
        {outfile.name} {success ? 'OK' : 'FAIL'}
        { success ? null : <span>reason: {reason}</span> }
      </li>)}
    </ul>
  </div> : null }
</div>
