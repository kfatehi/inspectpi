const init = {
  disks: []
}

export default function(state = init, action) {
  switch (action.type) {
    case 'SET_STATE': {
      console.log('setting state', action.state);
      return {
        disks: action.state.disks
      }
    }
  }
  return state
}

