const System = require('./system');

class Core {
  init(io){
    this.clients = [];
    this.io = io
    this.system = new System();
    this.system.on('change', ()=> this.sendState())
    return this.system.init().then(()=>
      this.io.on('connection', s=>this.acceptSocket(s))
    ).then(()=>this)
  }
  handleAction (action) {
    switch (action.type) {
      case 'WIFI_CLIENT_SCAN': return this.system.wifiClientScan();
      case 'WIFI_CLIENT_SCAN_END': return this.system.wifiClientScanEnd();
      case 'WIFI_CLIENT_ASSOC': return this.system.wifiClientAssoc(action);
      default: throw new Error('dont know how to handle action '+action.type);
    }
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
    console.log('sent', Object.keys(state).join(','));
  }
}

module.exports = Core;
