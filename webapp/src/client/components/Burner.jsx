import React from 'react';

export const Burner = React.createClass({
  render: function() {
    const {
      mounted,
      status: {
        infile,
        outfile,
        burning,
        pairKey,
        progress
      },
      start,
      clear,
      interrupt
    } = this.props;

    const activator = () => <span>
      { infile && outfile ? <div>
        { infile.size > outfile.size ? <span>
          infile too big for outfile
          </span> : <span>
          { mounted ? null : <button onClick={()=>start()}>
            Start burn
          </button> }
          <button onClick={()=>clear()}>Clear</button>
        </span> }
      </div> : null }
    </span>;

    return <div>
      <h1>Burner</h1>
      <p>infile {infile ? infile.name : 'none'}</p>
      <p>outfile {outfile ? outfile.name : 'none'}</p>
      { burning ? <span>
        <span>burn progress: {progress}</span>
        <button onClick={()=>interrupt()}>Interrupt burn</button>
      </span> : activator() }
    </div>
  }
});
