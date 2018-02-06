const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');
const request = require('request');
const port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/node_modules'));
app.use('/public', express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.get('/data', (req,res)=> {
    request.get('https://jsonplaceholder.typicode.com/users')
    .pipe(res);
});

io.on('connection', (socket) => {
    console.log('a user is connected');
    setInterval(function(){
        io.sockets.emit('message', 'hi');
    }, 1000);
});

http.listen(port, () => console.log("server is started"));