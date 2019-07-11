const http = require('http');
const express = require('express');
const socket = require('socket.io');

const PORT = 4000;
const app = express();
const server = http.Server(app);
const ws = socket(server);
let db = {
    users: [],
    messages: []
};
server.listen(PORT, () => console.log(`Listening at 4000`));
let clients = {};
let users = {};

ws.on('connection', (connection) => {
    console.log(`Connection established. ${connection.id}`);
    clients[connection.id] = connection;
    ws.on('join', (user) => OnUserJoin(user, connection));
    ws.on('message', (message) => OnMessage(message, connection));
});

const OnMessage = (message, connection) => {
    let userId = users[connection.id];
    if (!userId) return;
    SaveAndSendMessages(message, connection);
};

const OnUserJoin = (user, connection) => {
    try {
        if (user) {
            users[connection.id] = user.id;
            let existyingUser = db.users.find(zz => zz.id === user.id);
            if (!existyingUser) {
                db.users.push({ id: user.id, user });
            }
            ws.emit('join', user.id);
        } else {
            users[connection.id] = user.id;
        }
        SendPreviousMessages(connection);
    }
    catch (ex) {
    }
};

const SendPreviousMessages = (connection) => {
    const list = db.messages.find({ chatId }).sort({ createdAt: 1 });
    if (!list && list.length) return;
    connection.emit('message', list.reverse());
};

const SaveAndSendMessages = (data, connection, isBoradcaast) => {
    var data = {
        text: data.message,
        user: data.user.name,
        time: new Date(data.createdAt),
        chatId: chatId || 1
    };
    db.messages.push(data);
    var emitter = isBoradcaast ? ws : connection.broadcast;
    emitter.emit('message', [data]);
};