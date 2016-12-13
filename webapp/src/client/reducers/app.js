const init = {
  disks: [],
  images: []
}

export default function(state = init, action) {
  switch (action.type) {
    case 'SET_STATE': {
      console.log('setting state', action.state);
      return action.state
    }
  }
  return state
}

