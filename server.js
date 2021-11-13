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

    socket.emit('ready');

    socket.emit('rooms', getActiveRooms(io));

    socket.on('join', (room) => {
        socket.join(room);

        socket.broadcast.emit('new room', room);
    });

    socket.leave(socket.id); //sair da sala padrao
    console.log('a user connected');

    socket.on('disconnect', () => {

        var rooms = socket.rooms;
        console.log(rooms);
        // Sai de todas as salas que esta conectado
        for (var room in rooms) {
            socket.leave(room);

            socket.get('username', function (err, username) {
                if (username) {
                    socket.broadcast.to(room).emit('Deixou o jogo', { name: username });
                }
            });
        }
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