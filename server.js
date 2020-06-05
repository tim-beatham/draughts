var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// This will store the serverID and the
var servers = {};

var users = {};

function createServer(socket) {
    socket.on("create-server", (username) => {
        servers[socket.id] = [];
        servers[socket.id].push(username);
        console.log(servers);
        socket.emit("server-created", socket.id)
        socket.emit("user-changed", servers[socket.id]);

        // Add the user to the specified socket.
        users[username] = socket.id;
    });
}

function userJoined(socket) {
    socket.on("join-server", (info) => {
        servers[info.server].push(info.username);
        socket.join(info.server);
        io.sockets.in(info.server).emit("user-changed", servers[info.server]);

        // Need to add the user to the users object.
        users[info.username] = info.server;
    });
}

function removeUser(username){
    let socketID = users[username];
    let usersList = servers[socketID];

    // Get the index of the user connected to the server.
    servers[socketID] = usersList.filter((user) => {
        return user !== username;
    }); // Remove the user from the given server.

    // Delete from the user.
    delete users[username];

    // Tell the users of the given socket that the users has changed.
    io.sockets.in(socketID).emit("user-changed", servers[socketID]);
}

function messageSent(socket) {
    socket.on('message-sent', (info) => {
        // Get the socket of the user who sent the message.
        let socket = users[info.username];
        let message = info.username + ": " + info.message;
        // Broadcast the message to all users on the socket.
        io.sockets.in(socket).emit('update-messages', message);
    });
}


io.on('connection', function (socket) {
    console.log("New client connected")
    createServer(socket);
    userJoined(socket);
    messageSent(socket);

    socket.on("user-disconnecting", (username) => {
        removeUser(username);
    })

    socket.on("disconnect", () => {
        console.log("User disconnected");
    })
});


http.listen(4000, function() {
    console.log('Listening on localhost:4000');
})