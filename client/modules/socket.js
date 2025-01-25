//global io() variable

export class Socket {
    constructor() {
        this.socket = io();
    }

    createHandler = eventName => 
        handler => {
            this.socket.on(eventName, handler);
        }
    

    emit = eventName => 
        message => {
            this.socket.emit(eventName, message);
        }
    

    //The list of handlers
    onSetUsername = this.createHandler('set username');
    onUserJoined = this.createHandler('user joined');
    onUserLeft = this.createHandler('user left');
    onChatMessage = this.createHandler('chat message');
    onUserTyping = this.createHandler('user typing');
    onUserList = this.createHandler('user list');
    onSearchMessage = this.createHandler('search user');
    onUserRemove = this.createHandler('remove user');
    onLogin = this.createHandler('login success');
    
    //The list of emitEvents
    emitChatMessage = this.emit('chat message');
    emitUserTyping = this.emit('user typing');
    emitRoomChange = this.emit('change room');
    emitUserJoin = this.emit('assign user');
    emitSearchMessage = this.emit('search user');
    emitUserRemove = this.emit('remove user');
    emitLogin = this.emit('login');
}