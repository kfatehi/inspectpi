import React from 'react';

export const BurnHistory = ({ burns }) => <div>
  { burns.length > 0 ? <div>
    <h1>Burn History</h1>
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
