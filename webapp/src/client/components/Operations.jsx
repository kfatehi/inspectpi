import React from 'react';

import { SimplePrompt } from './SimplePrompt';

export const Operations = ({
  status: { burning },
  section,
  setInput,
  setOutput,
  makeImage,
  renameImage,
  burnImage,
  unlink,
  target
}) => {
  const btnBurnerLoadIn = () => <button 
    onClick={()=>setInput(target)}>
    Load in burner as Input
  </button>;
  const btnBurnerLoadOut = () => <button 
    onClick={()=>setOutput(target)}>
    Load in burner as Output
  </button>;
  const btnUnlink = () => unlink ? <button
    onClick={()=>confirm('really?') ? unlink(target) : null}>
    Delete
  </button> : null;
  const btnRename = () => renameImage ? <SimplePrompt
    startLabel={"Rename"}
    initialValue={target.name}
    handleSubmit={(newName) => renameImage(target, newName)}
  /> : null;
  const btnMakeImage = () => <button onClick={()=>makeImage(target)}>
    { section === 'disk' ? 'Save as Image' : 'Duplicate Image' }
  </button>;
  const btnBurnImage = () => target.type === 'bootable disk image' ? <button
    onClick={()=>confirm('really?') ? burnImage(target) : null}>
    Burn Image
  </button> : null;
  const btnExtract = () => target.type.match(/g?zip$/) ? <button
    onClick={()=>extract(target)}>
    Extract
  </button> : null;
  const buttons = () => <div>
    {btnUnlink()}
    {btnRename()}
    {btnMakeImage()}
    {btnBurnImage()}
    {btnExtract()}
  </div>
  return burning ? null : buttons()
}
