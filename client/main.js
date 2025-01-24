import { Socket } from "./modules/socket.js";
import { Username } from "./modules/username.js";


document.addEventListener('DOMContentLoaded', () => {
    const socket = new Socket();
    const username = new Username('#username');


    socket.onSetUsername(name => {
        username.render(name);
    });

    socket.on('set username', console.log(socket));

});