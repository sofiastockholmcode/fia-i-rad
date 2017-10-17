const express = require('express');
const path = require('path');


var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

const port = process.env.PORT || 8080;

// serve static assets normally
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'dist')));

let enviroment = app.get('env');

var numUsers = 0; // lol, was connecting twice...

var typeIsTaken = new Map();
typeIsTaken.set('heart', false);
typeIsTaken.set('cross', false);

io.on('connection', function(socket){
    let thisClient = {};
    thisClient.username = socket.client.id.substring(0,5);
    numUsers++;

    // if either heart or cross is free, let this client be heart or cross
    for (const [type, taken] of typeIsTaken.entries()) {
        if (!taken) {
            thisClient.type = type;
            typeIsTaken.set(type, true);
            break;
        }
    }

    if (thisClient.type == undefined) {
        console.log('client has not yet a type')
        thisClient.type = 'viewer';
    }

    console.log('a client connected: ', thisClient.username + " type: ", thisClient.type);

    // emit each time a client connects
    io.emit('numusers', {
        numUsers
    });

    // only emit to this client, move whole game state to server side since we want clients connecting later to see current state
      socket.emit('initialstate', {
          username: thisClient.username,
          type: thisClient.type
      });


    socket.on('myname', function(data) {
        console.log('my name is: ', data);
        thisClient.username = data;
        io.emit('myname', {
            username: thisClient.username,
        })
    });

    socket.on('new message', function(data) {
        console.log('new message', data);

        io.emit('new message', {
            username: thisClient.username,
            text: data
        })
    });

    socket.on('square', function(data) {
        data.type = thisClient.type;
        console.log('got square', data);
        io.emit('square', {
            username: thisClient.username,
            square: data
        })
    });

    socket.on('disconnect', function() {
        numUsers--;
        console.log('disconnect', thisClient.username);
        typeIsTaken.set(thisClient.type, false);
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

