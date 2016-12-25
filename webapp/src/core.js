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
    if (action.meta.recipe) {
      console.log('core: recipe action', action);
      return sys.handleRecipeAction(action);
    }
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
      case 'BURNER_CLEAR':
        return sys.burnerClear();
      case 'BURNER_INTERRUPT':
        return sys.burnerInterrupt();
      case 'IMAGE_OPERATION_DUPLICATE':
        return sys.imageOperationDuplicate(action.src);
      case 'IMAGE_OPERATION_BURN':
        return sys.imageOperationBurn(action.img);
      case 'IMAGE_OPERATION_EXTRACT':
        return sys.imageOperationExtract(action.img);
      case 'IMAGE_OPERATION_UNLINK':
        return sys.imageOperationUnlink(action.img);
      case 'IMAGE_OPERATION_RENAME':
        return sys.imageOperationRename(action.img, action.name);
      case 'MOUNTER_OPERATION_MOUNT_DISK':
        return sys.mounterOperationMountDisk();
      case 'MOUNTER_OPERATION_UNMOUNT_DISK':
        return sys.mounterOperationUnmountDisk();
      case 'RECIPES_RELOAD_RECIPE':
        return sys.recipesReloadRecipe(action.name);
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
