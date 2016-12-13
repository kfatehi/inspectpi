const System = require('./system');

class Core {
  init(io){
    this.io = io
    this.system = new System();
    this.system.on('stateChange', ()=> this.sendState())
    return this.system.init().then(()=>
      this.io.on('connection', s=>this.acceptSocket(s))
    ).then(()=>this)
  }
  handleAction (action) {
    console.log('server got action', action);
  }
  acceptSocket (socket) {
    this.socket = socket;
    this.socket.on('action', a=>this.handleAction(a))
    this.sendState();
  }
  sendState () {
    if ( this.socket ) {
      let state = this.system.getState();
      this.socket.emit('action', {
        type: "SET_STATE", state
      });
      console.log('sent state', state);
    }
  }
}

module.exports = Core;
