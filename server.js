const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const PORT = 8080;

app.use(express.static(__dirname));
app.use(express.static(__dirname + '/src/'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/StartGame', (req, res) => {
    res.sendFile(__dirname + '/src/pages/StartGame/start-game.html');
});

app.get('/GameRunning', (req, res) => {
    res.sendFile(__dirname + '/src/pages/GameRunning/game-running.html');
});

io.on('connection', (socket) => {

    var rooms = []

    socket.emit('ready');

    socket.emit('rooms', getActiveRooms(io));

    socket.on('play game', (room) => {
        var destination = '/GameRunning/' + room;

        app.get(destination, (req, res) => {
            res.sendFile(__dirname + '/src/pages/GameRunning/game-running.html');
        });

        socket.emit('redirect', destination);
    });

    socket.on('join', (room) => {
        socket.join(room);
        // conta usuarios em uma sala
        // console.log(io.sockets.adapter.rooms.get(room).size);
        socket.broadcast.emit('new room', room);
    });

    // socket.leave(socket.id); //sair da sala padrao

    socket.on('disconnect', () => {
        // Sai de todas as salas que esta conectado
        for (var room in Array.from(rooms)) {
            socket.leave(room);
        }
        // setTimeout(function () {
        socket.broadcast.emit('rooms', getActiveRooms(io));
        // }, 1000);
    });
});

server.listen(PORT, () => {
    console.log(`http://localhost:/${PORT}`);
});

function getActiveRooms(io) {
    // Convert map into 2D list:
    // ==> [['4ziBKG9XFS06NdtVAAAH', Set(1)], ['room1', Set(2)], ...]
    const arr = Array.from(io.sockets.adapter.rooms);
    // Filter rooms whose name exist in set:
    // ==> [['room1', Set(2)], ['room2', Set(2)]]
    const filtered = arr.filter(room => !room[1].has(room[0]))
    // Return only the room name: 
    // ==> ['room1', 'room2']
    const res = filtered.map(i => i[0]);
    return res;
}