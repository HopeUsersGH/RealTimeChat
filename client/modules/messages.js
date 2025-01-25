export class Messages {
    constructor(selector) {
        this.node = document.querySelector(selector);
    }

    append = (username, message, className = 'message') => {
        const messageElement = document.createElement('div');
        messageElement.textContent = `${username}: ${message}`;
        
        if (className) {
            messageElement.classList.add(className);
        }
        
        this.node.appendChild(messageElement);
        
        messageElement.scrollIntoView({ behavior: 'smooth' });
    }

    appendSystem = message => {
        this.append('system', message, 'system-message');
    }
}