const System = require('./system');
const { createStore, combineReducers, applyMiddleware } = require('redux');

const sdcardReducer = system => (state={}, action) => {
  switch (action.type) {
    case 'GET_FACTS': {
      return { path: system.facts['disks']['/dev/sda'] }
    }
  }
  return state;
}

class Core {
  constructor(io) {
    this.system = new System();
    this.io = io;
    this.store = createStore(combineReducers({
      sdcard: sdcardReducer(this.system)
    }))
    this.system.updateFacts([
      'disks'
    ]).then(() => {
      
      io.on('connection', s=>this.acceptSocket(s));
    }).catch((err) => {
      console.error(err);
    });
  }
  handleAction (action) {
    console.log('server got action', action);
    switch (action.type) {
    }
  }
  acceptSocket (socket) {
    this.socket = socket;
    this.socket.on('action', a=>this.handleAction(a))
    console.log('accepted socket');
    this.sendState();
  }
  sendState () {
    this.socket.emit('action', {
      type: "SET_STATE",
      state: this.store.getState()
    });
    console.log('sent state');
  }
}


module.exports = Core;
