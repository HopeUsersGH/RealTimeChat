const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;
const io = socketIO(server);

//takes data from JSON
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

io.on('connection', socket => {
    socket.setMaxListeners(90);
  
    socket.on('login', username => {
  
      for (let i = 0; i < usersData.length; i++) {
        if(usersData[i].username === username) {
          socket.join(DEFAULT_ROOM);
          socket.activeRoom = DEFAULT_ROOM;
          
          socket.username = username;
              
          socket.emit('login success', socket.username);
                  
          let room = roomList.find(r => r.name === socket.activeRoom);
  
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
          
          
          for (let i = 0; i < roomList.length; i++) {
            if(roomList[i].name == socket.activeRoom) {
              io.emit('user list', roomList[i].users);
            }
          }
          
          socket.emit('set username', socket.username);
          
          // this "for" is check for active user room
          for (let i = 0; i < roomList.length; i++) {
            if(roomList[i].name == socket.activeRoom) {
              socket.to(socket.roomList[i].name).emit('user joined', socket.username);
            }
          }
  
          socket.on('disconnect', () => {
            for (let i = 0; i < roomList.length; i++) {
              if(roomList[i].name == socket.activeRoom) {
                roomList[i].users = roomList[i].users.filter(username => username !== socket.username);
                io.emit('user list', roomList[i].users);
              }
            }
            console.log('disconnect', roomList);
            socket.to(socket.activeRoom).emit('user left', socket.username);
          });
  
          socket.on('chat message', message => {
            io.in(socket.activeRoom).emit('chat message', {
              name: socket.username,
              message,
            });
          });
  
          // status typing message above chat
          socket.on('user typing', () => {
            socket.to(socket.activeRoom).emit('user typing', socket.username)
          })
  
          socket.on('change room', roomName => {
            socket.leave(socket.activeRoom);
  
            socket.to(socket.activeRoom).emit('user left', socket.username);
  
            socket.join(roomName);
  
            socket.activeRoom = roomName;
  
            // roomFound is flag to check a room
            let roomFound = false; 
            // the try adds users to the room, else creates a new room with socket.username
            try {
              for (let i = 0; i < roomList.length; i++) {
                if (roomList[i].name === socket.activeRoom) {
                  for (let j = 0; j < roomList[i].users.length; j++) {
                    if (roomList[i].name === socket.activeRoom) {
                      roomFound = true; 
                      
                      if (!roomList[i].users.includes(socket.username)) {
                        roomList[i].users.push(socket.username);
                      }
                    }
                  }
                  roomFound = true;
                }
              }
              
              if (!roomFound) {
                userRoom = {
                  name: socket.activeRoom,
                  users: [socket.username], 
                  creator: socket.username,
                };
                roomList.push(userRoom);
              }
            } catch (error) {
              console.log('change room error', error);
            }
  
            console.log('change room', roomList);
  
            for (let i = 0; i < roomList.length; i++) {
              if(roomList[i].name == socket.activeRoom) {
                io.in(socket.activeRoom).emit('user list', roomList[i].users);
              }
            }
  
            socket.to(socket.activeRoom).emit('user joined', socket.username);
          });
  
          //removing users from userlist with creator check
          socket.on('remove user', usernameToRemove => {
            const room = roomList.find(r => r.name === socket.activeRoom);
            
            
            if (room && room.creator === socket.username) {
              room.users = room.users.filter(username => username !== usernameToRemove);
              
              for (let i = 0; i < roomList.length; i++) {
                if(roomList[i].name == socket.activeRoom) {
                  room.users = roomList[i].users.filter(username => username !== usernameToRemove);
                }
              }
  
              const userSocket = Object.values(io.sockets.sockets).find(s => s.username === usernameToRemove);
            
              if (userSocket) {
                userSocket.leave(socket.activeRoom);
                userSocket.join(DEFAULT_ROOM);
                userSocket.activeRoom = DEFAULT_ROOM;
              }  
              
              io.in(socket.activeRoom).emit('user list', room.users);
              io.to(socket.activeRoom).emit('remove user', usernameToRemove);
            } else {
              socket.emit('remove user', 'Only the room creator can remove users!');
            }
            
          });
  
          socket.on('search user', user => {
            const searchTerm = user.toLowerCase();
  
            for (let i = 0; i < roomList.length; i++) {
              if(roomList[i].name == DEFAULT_ROOM) {
                const userList = roomList[i].users.filter(username => username.toLowerCase().includes(searchTerm));
                
                if (userList.length > 0) {
                  socket.emit('search user', userList);
                } else {
                  socket.emit('search user', ['User not found']);
                }
                
              }
            }
          });
  
        } else {
            socket.on('disconnect', () => {
          });
        }
      }
    });
  });