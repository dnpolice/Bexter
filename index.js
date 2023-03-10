const express = require('express');
const mysql = require('mysql2');
const app = express();
const socketio = require('socket.io');

require('./mysql/config');

// app.use(express.json({ extended: false }));
app.use(express.json({ limit: '200mb', extended: true }));
var cookieParser = require('cookie-parser')
app.use(cookieParser())


app.use('/auth', require('./routes/auth'));
app.use('/users', require('./routes/users'));
app.use('/stories', require('./routes/stories'));
app.use('/test', require('./routes/test'));

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

const io = socketio(server);


io.on('connection', (socket) => {
    socket.on('join', (robotSerialNumber) => {
        socket.join(robotSerialNumber);
    });

    socket.on('input', ({robotSerialNumber, command, storyId}) => {
        io.to(robotSerialNumber).emit('play', {command, storyId});
    });
});