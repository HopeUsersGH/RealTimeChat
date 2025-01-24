//global io() variable

export class Socket {
    constructor() {
        this.socket = io();
    }

    createHandler = eventName => {
        handler => {
            this.socket.on(eventName, handler);
        }
    }

    emit = eventName => {
        message => {
            this.socket.emit(eventName, message);
        }
    }

    //The list of handlers
    onSetUsername = this.createHandler('set username');
    onUserJoined = this.createHandler('user joined');
    onUserLeft = this.createHandler('user left');
    onUserList = this.createHandler('user list');
    onLogin = this.createHandler('login success');

    //The list of emitEvents
    emitLogin = this.emit('login')
}