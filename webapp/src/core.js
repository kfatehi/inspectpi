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
    const sys = this.system;
    switch (action.type) {
      case 'WIFI_CLIENT_SCAN':
        return sys.wifiClientScan();
      case 'WIFI_CLIENT_SCAN_END':
        return sys.wifiClientScanEnd();
      case 'WIFI_CLIENT_ASSOC':
        return sys.wifiClientAssoc(action);
      case 'BURNER_SET_INPUT':
        return sys.burnerSetInput(action.value);
      case 'BURNER_SET_OUTPUT':
        return sys.burnerSetOutput(action.value);
      case 'BURNER_START':
        return sys.burnerStart();
      case 'BURNER_INTERRUPT':
        return sys.burnerInterrupt();
      default:
        console.error('Unhandled action', action.type);
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
