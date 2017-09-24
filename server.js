const express = require('express');
const path = require('path');


var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

const port = process.env.PORT || 8080

// serve static assets normally
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'dist')));

let enviroment = app.get('env');

var numUsers = 0;

io.on('connection', function(socket){
    console.log('a user connected');
    let username = socket.client.id.substring(0,5);

    socket.on('new message', function(data) {
        console.log('new message', data);

        io.emit('new message', {
            username: username,
            text: data
        })
    });

    socket.on('square', function(data) {
        console.log('got square');
        io.emit('square', {
            username: username,
            square: data
        })
    });

    socket.on('disconnect', function() {
        console.log('disconnect');
    })

});

app.get('/', function (req, res){
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'))
})



http.listen(port, function(){
    console.log('listening on port ', port);
});

