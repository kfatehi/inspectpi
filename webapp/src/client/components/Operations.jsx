import React from 'react';

import { SimplePrompt } from './SimplePrompt';

export const Operations = ({
  status: { burning },
  setInput,
  setOutput,
  makeImage,
  renameImage,
  unlink,
  target
}) => {
  return <div>
    { burning ? null : <div>
      { setInput  ? 
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
      { unlink ?
          <button onClick={()=>confirm('really?') ? unlink(target) : null}>Delete</button>
          : null
      }
      <button onClick={()=>makeImage(target)}>
        { target.type === "image" ? "Duplicate" : "Backup" }
      </button>
      { renameImage ? <SimplePrompt
        startLabel={"Rename"}
        initialValue={target.name}
        handleSubmit={(newName) => renameImage(target, newName)}
      /> : null }
    </div>}
  </div>
}
