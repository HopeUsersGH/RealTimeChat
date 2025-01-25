import { Label } from "./label.js";

const TIMEOUT = 3000;

export class TypingStatus extends Label {
    constructor (...args) {
        super(...args);

        this.timeout = TIMEOUT;
        this.users = {};
    }
    
    addUser(username) {
        clearTimeout(this.users[username]);
        this.users[username] = setTimeout(() => this.removeUser(username), this.timeout);
        this.renderMessage();
    }

    removeUser(username) {
        clearTimeout(this.users[username]);
        delete this.users[username];
        this.renderMessage();
    }
    
    renderMessage() {
        this.render(this.getMessage());
    }

    getMessage() {
        const usernames = Object.keys(this.users);

        switch (usernames.length) {
            case 0:
                return '';
            case 1:
                return `${usernames[0]} is typing...`;
            case 2:
                return `${usernames.join(' and ')} are typing...`;
            default:
                return 'Multiple users are typing...';
        }
    }
}