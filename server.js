const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const fs = require('fs');

const app = express();
const server = http.Server(app);
const PORT = process.env.PORT || 3000;

const io = socketIO(server);

let usersData = [];
fs.readFile('./client/users.json', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading users data:', err);
        return;
    }
    usersData = JSON.parse(data);  
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/client/index.html');
});

app.use(express.static('./client'));

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});