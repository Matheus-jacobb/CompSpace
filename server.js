const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const {Server} = require("socket.io");
const io = new Server(server);
const PORT = 8081;
let clients = [];

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

app.get('/Controller', (req, res) => {
    res.sendFile(__dirname + '/src/nipple/nipple.html');
});

io.on('connection', (socket) => {

    var rooms = [];

    socket.emit('ready');

    socket.on('players connected', (room) => {
        socket.emit('players count', io.sockets.adapter.rooms.get(room).size)
    });

    socket.emit('rooms', getActiveRooms(io));

    socket.on('open controller', () => {
        var destination = '/Controller/' + socket.id;

        app.get(destination, (req, res) => {
            res.sendFile(__dirname + '/src/nipple/nipple.html');
        });
        socket.emit('redirect', destination);
    })

    socket.on('joystick move', (data) => {
        socket.broadcast.to(data.id).emit('joystick move client', data.direction)
    });

    socket.on('play game', (room) => {
        var destination = '/GameRunning/' + room;

        app.get(destination, (req, res) => {
            res.sendFile(__dirname + '/src/pages/GameRunning/game-running.html');
        });

        socket.emit('redirect', destination);
    });

    socket.on('join', (room) => {
        socket.join(room);
        if (io.sockets.adapter.rooms.get(room).size > 4) {
            socket.leave(room);
        } else if (io.sockets.adapter.rooms.get(room).size == 1) {
            socket.broadcast.emit('new room', room);
        } else {
            socket.broadcast.to(room).emit('new player', io.sockets.adapter.rooms.get(room).size);
        }
    });

    socket.on('start game button', (room) => {
        socket.broadcast.to(room).emit('start game');
    });

    socket.on('player died', (client) => {
        let clientName = clients.filter((e) => e.clientId === client.id )[0].customId;
        io.sockets.in(client.room).emit('dead players', {id: client.id, userName: clientName, score: client.score});
    })

    socket.on('disconnect', () => {
        // Sai de todas as salas que esta conectado
        clients = clients.filter((e) => e.clientId !== socket.id);
        for (var room in Array.from(rooms)) {
            socket.broadcast.to(room).emit('player disconnect', io.sockets.adapter.rooms.get(room).size);
            socket.leave(room);
        }
        // setTimeout(function () {
        socket.broadcast.emit('rooms', getActiveRooms(io));
        // }, 1000);
    });

    socket.on('storeClientInfo', function (data) {
        let clientInfo = new Object();
        clientInfo.customId = data;
        clientInfo.clientId = socket.id;
        clients.push(clientInfo);
        console.log(clients);
    });
});

server.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
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
