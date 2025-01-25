import { Label } from "./label.js";

export class UserList extends Label {
    constructor(...args) {
        super(...args);

        this.userList = [];
    }
    
    addUser(users) {

        users.forEach(userName => {
            this.userList.push(userName);
        });
        
        this.renderUserList();
    }
    
    removeUserList(user) {
        this.userList = this.userList.filter(username => username !== user);
        this.renderUserList();
    }

    getUserList() {
        return this.userList.map(user => (
            `<li class="users-item">
                <div class="users-item__title">${user}</div>
            </li>`
        )).join('\n');
    }

    // Метод для рендеринга списка пользователей
    renderUserList() {
        this.render(this.getUserList());
    }

    clearUser() {
        this.userList = [];
    }

}