import { Socket } from "./modules/socket.js";
import { Username } from "./modules/username.js";
import { Messages } from "./modules/messages.js";
import { MessageForm } from "./modules/message-form.js";
import { TypingStatus } from "./modules/typings-status.js";
import { RoomForm } from "./modules/room-form.js";
import { RoomList } from "./modules/room-list.js";
import { UserList } from "./modules/user-list.js";
import { SearchForm } from "./modules/search-form.js";
import { RemoveForm } from "./modules/remove-form.js";
import { LoginForm } from "./modules/login-form.js";

document.addEventListener('DOMContentLoaded', () => {
    const socket = new Socket();
    const username = new Username('#username');
    const messages = new Messages('#messages');
    const messageForm = new MessageForm('#messageForm');
    const typingStatus = new TypingStatus('#typingStatus');
    const roomForm = new RoomForm('#joinRoomForm');
    const roomList = new RoomList('#rooms');
    const userList = new UserList('#userList');
    const searchForm = new SearchForm('#searchForm');
    const userSearch = new UserList('#userSearch');
    const removeForm = new RemoveForm('#removeUserForm');
    const loginForm = new LoginForm('#loginForm');
    const loginOverlay = new LoginForm('#loginOverlay');

    roomList.renderList();

    socket.onSetUsername(user => {
        username.render(user);
        messages.appendSystem(`${user} assigned to you.`);
    });

    socket.onUserJoined(user => {
        messages.appendSystem(`${user} joined.`);
    });

    socket.onUserLeft(user => {
        messages.appendSystem(`${user} left.`);
    });

    socket.onUserList(users => {
        userList.clearUser();
        userList.addUser(users);
    });

    searchForm.onSubmit(username => {
        socket.emitSearchMessage(username);
        document.getElementById('resultSearching').style.display = 'block';
        setTimeout(() => {
            document.getElementById('resultSearching').style.display = 'none';
        }, 3000);
    });

    loginForm.onSubmit(username => {
        console.log(username);
        socket.emitLogin(username);
        loginOverlay.closeDialog();
    });

    removeForm.onSubmit(username => {
        socket.emitUserRemove(username);
    });

    socket.onUserRemove(user => {
        messages.appendSystem(`${user} removed.`);
    });
    
    socket.onLogin(user => {
        console.log(`Welcome, ${user}`);
        document.getElementById('authButton').style.display = 'none';
        document.getElementById('login').style.display = 'none';
        document.getElementById('content').style.display = 'flex';
        document.getElementById('header').style.display = 'block';
    });

    messageForm.onSubmit(message => {
        socket.emitChatMessage(message);
    });

    socket.onChatMessage(({name, message}) => {
        messages.append(name, message);
        typingStatus.removeUser(name);
    });

    socket.onSearchMessage(username => {
        userSearch.clearUser();
        userSearch.addUser(username);
    });

    messageForm.onKeypress(() => {
        socket.emitUserTyping();
    });

    socket.onUserTyping(user => {
        typingStatus.addUser(user);
    });
    
    roomForm.onSubmit(room => {
        roomList.add(room);
        roomList.select(room);
        socket.emitRoomChange(room);
    });
});