const System = require('./system');

class Core {
  init(io){
    this.clients = [];
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
    this.clients.push(socket)
    socket.on('disconnect', () => {
      this.clients.splice(this.clients.indexOf(socket), 1);
    })
    socket.on('action', a=>this.handleAction(a))
    this.sendState();
  }
  sendState () {
    let state = this.system.getState();
    this.io.emit('action', { type: "SET_STATE", state });
    console.log('sent state', state);
  }
}

module.exports = Core;
