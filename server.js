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
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('create room', (room) => {
        socket.leave(socket.id); //sair da sala padrao
        socket.join(room);
        console.log(`Entrou na sala ['${room}'].`);
    });
});




server.listen(PORT, () => {
    console.log(`http://localhost:/${PORT}`);
});