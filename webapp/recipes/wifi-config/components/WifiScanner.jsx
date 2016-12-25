import React from 'react';
import { WifiAssociator } from './WifiAssociator';

export const WifiScanner = ({
  scan,
  close,
  associate,
  scanning,
  baseStations
}) => <div>
  <button
    disabled={scanning}
    onClick={()=>scan()}>
    {scanning ? 'Scanning...' : 'Scan'}
  </button>

  { baseStations.length > 0 ? <button
    disabled={scanning}
    onClick={()=>close()}>
    Close Scanner
  </button> : null }

  { baseStations.length > 0 ? <div>
    <h2>Base Stations</h2>
    <ul>
      {baseStations.map(bss=><li key={bss.address}>
        <pre>{JSON.stringify(bss, null, 4)}</pre>
        <WifiAssociator
          bss={bss}
          associate={associate}
        />
      </li>)}
    </ul>
  </div> : null }
</div>;
