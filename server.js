var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var users = []

io.on('connection', function (socket) {
    console.log("New client connected");

    socket.on("client-username", (username) => {
        users.push(username);
        io.sockets.emit("update-users", users);
        socket.userName = username;
    })

    socket.on("disconnect", function () {
        users = users.filter((username) => {
            return username !== socket.userName;
        })
        io.sockets.emit("update-users", users);
    })
});

const getApiAndEmit = socket => {
    const response = new Date();
    socket.emit("FromAPI", response);
}





http.listen(4000, function() {
    console.log('Listening on localhost:4000');
})