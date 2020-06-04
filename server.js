var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var servers = {};


io.on('connection', function (socket) {
    console.log("New client connected");

    socket.on("create-server", (username) => {
        servers[socket.id] = [];
        servers[socket.id].push(username);
        console.log(servers);
        socket.emit("server-created", socket.id)
        socket.emit("user-changed", servers[socket.id]);
    })

    socket.on("join-server", (info) => {
        servers[info.server].push(info.username);
        socket.join(info.server);
        io.sockets.in(info.server).emit("user-changed", servers[info.server]);
    });

    socket.on("disconnect", function () {
        console.log("User has disconnected!")
    })
});


http.listen(4000, function() {
    console.log('Listening on localhost:4000');
})