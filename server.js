const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');
const request = require('request');
const port = process.env.PORT || 3000;
const _ = require('lodash');

app.use(express.static(__dirname + '/node_modules'));
app.use('/public', express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.get('/data', (req, res)=> {
    request.get('https://jsonplaceholder.typicode.com/users')
    .pipe(res);
});

app.get('/iolink', (req, res) => {
    // request.get('http://192.168.0.2/dprop.jsn').pipe(res);

    request('http://192.168.0.2/dprop.jsn', function (error, response, body) {
        if ( response.statusCode == 200) {
            // console.log( body );       
            var temp = JSON.parse(body);
            // console.log( temp[0].ProductId );

            var myproduct = _.find(temp, function(o) {
                return o.ProductId === "BAE00T4";
            });
            // console.log(myproduct);
            res.send(myproduct.ProductText);
        }
    });
});

io.on('connection', (socket) => {
    // console.log('a user is connected');
    // setInterval(function(){
    //     io.sockets.emit('message', 'hi');
    // }, 1000);

    setInterval(function() {
        request('http://192.168.0.2/dprop.jsn', function(error,response,body) {
            if ( response.statusCode == 200 ) {
                var data = JSON.parse(body);
                data = _.find(data, function(o) {
                    return o.ProductId === "BAE00T4";
                });
                var processdata = data.ProcessInputs.split(' ').join('').substring(0,6);
                console.log(processdata.substring(0,6));
                var result = {                    
                    "Voltage" : (parseInt(processdata.substr(0,3), 16) * 0.1).toString() ,
                    "Current" : (parseInt(processdata.substring(3,6), 16) * 0.1).toString()
                };

                io.sockets.emit('message', result);
            }
        });
    }, 1500);
    
});



http.listen(port, function(){
    console.log("server is started");
});