class Core {
  constructor(io) {
    this.io = io;
    io.on('connection', socket => {
      socket.on('action', this.handleAction)
      socket.emit('action', { type: "HELLO" });
    });
  }
  handleAction (action) {
    switch (action.type) {
      case 'DO_LOGIN': 
        return core.login(action.username, action.password);
      case 'CHECK_AUTH':
        return core.checkAuth(action.token);
      case 'LOAD_WORKBOOKS':
        return core.loadWorkbooks(action.token);
    }
  }
}


module.exports = Core;
