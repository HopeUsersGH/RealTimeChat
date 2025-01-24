export class Label {
    constructor(selector) {
        this.node = document.querySelector(selector);
    }

    render(message = '') {
        this.node.innerHTML = message;
    }
}