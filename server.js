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

var numUsers = 0; // note: you get 2 connections per window if you use webpack-dev-server

io.on('connection', function(socket){
    let user = {};
    user.username = socket.client.id.substring(0,5);
    console.log('a user connected', ++numUsers);
    console.log('a user connected ', user.username + " ", numUsers);
    if (numUsers == 1) {
        user.type = 'heart';
    } else if (numUsers == 3) {
        user.type = 'cross';
    } else {
        user.type = 'viewer';
    }

    io.emit('numusers', {
        numUsers
    });


    socket.on('myname', function(data) {
        console.log('my name is: ', data);
        user.username = data;
    })

    socket.on('new message', function(data) {
        console.log('new message', data);

        io.emit('new message', {
            username: user.username,
            text: data
        })
    });

    socket.on('square', function(data) {
        data.type = user.type;
        console.log('got square', data);
        io.emit('square', {
            username: user.username,
            square: data
        })
    });

    socket.on('disconnect', function() {
        numUsers--;
        console.log('disconnect', numUsers);
        io.emit('numusers', {
            numUsers
        })
    })

});

app.get('/', function (req, res){
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'))
})



http.listen(port, function(){
    console.log('listening on port ', port);
});

