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

        // Get the number of users on the server.
        if (servers[info.server].length === 2){
            io.sockets.in(info.server).emit("start");
        }
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

function moveMade(socket) {
    socket.on("client-move-made", (info) => {
        // Broad cast it to everyone on the socket.
        io.sockets.in(users[info.username]).emit("server-move-made", {board: info.board, team: info.team});
    });
}


function canJoin(socket) {
    socket.on("check-join", (info) => {
        // Check if the user does not exist
        if (users[info.username]) {
            socket.emit("user-exists-error");
        }
        if (!servers[info.server]) {
            socket.emit("no-server-error");
        } else if (servers[info.server].length >= 2){
            socket.emit("server-full");
        }

        if (!users[info.username] && servers[info.server] && servers[info.server].length < 2){
            socket.emit("can-join");
        }

    });

    socket.on("check-create", username => {
        if (users[username]){
            socket.emit("user-exists-error");
        }

        if (!users[username]){
            socket.emit("can-join");
        }

    });
}


io.on('connection', function (socket) {
    console.log("New client connected")
    createServer(socket);
    userJoined(socket);
    messageSent(socket);
    canJoin(socket);
    moveMade(socket);

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