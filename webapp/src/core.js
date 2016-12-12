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
    }
  }
}


module.exports = Core;
