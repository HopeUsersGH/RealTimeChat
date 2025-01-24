const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
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

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

const DEFAULT_ROOM = 'general';
//array "roomList" of objects(rooms)
let roomList = [];

io.on('connection', (socket) => {
    socket.emit('set username', socket.id);
    socket.on('login', username => {
        for (let i = 0; i < usersData.length; i++) {
            if (usersData[i].username === username) {
                socket.join(DEFAULT_ROOM);
                socket.activeRoom = DEFAULT_ROOM;

                socket.username = username;
                console.log('login username', username);
                
                socket.emit('login success', socket.username)

                //find a room used name
                let room = roomList.find(r => r.name === socket.activeRoom);
                // if a room is not found then we create a new room
                if (!room) {
                    room = {
                        name: socket.activeRoom,
                        users: [],
                    };
                    roomList.push(room);
                }

                if (!room.users.includes(socket.username)) {
                    room.users.push(socket.username);
                }

                socket.roomList = roomList;
                console.log('connection', roomList);

                // find by object.name(room.name)
                for (let i = 0; i < roomList.length; i++) {
                    if (roomList[i].name == socket.activeRoom) {
                        io.emit('user list', roomList[i].users);
                    }
                }

                socket.emit('set username', socket.username);

                for (let i = 0; i < roomList.length; i++) {
                    if (roomList[i].name == socket.activeRoom) {
                        socket.to(socket.roomList[i].users).emit('user joined', socket.username);
                    }
                }

                socket.on('disconnect', () => {
                    for (let i = 0; i < roomList.length; i++) {
                        if (roomList[i].name == socket.activeRoom) {
                            roomList[i].name = roomList[i].users.filter(username => username !== socket.username);
                            io.emit('user list', roomList[i].users);
                        }
                    }
                });
                console.log('disconnect', roomList);
                socket.to(socket.activeRoom).emit('user left', socket.username);
                



            } else {
                socket.on('disconnect', () => {});
            }
        }
    });
});
    