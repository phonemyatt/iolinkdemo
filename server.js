const express = require('express');
const moment = require('moment');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');
const request = require('request');
const port = process.env.PORT || 3000;
const _ = require('lodash');

var allClients = [];

app.use(express.static(__dirname + '/node_modules'));
app.use('/public', express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.get('/data', (req, res) => {
    request.get('https://jsonplaceholder.typicode.com/users')
        .pipe(res);
});

app.get('/iolink', (req, res) => {
    // request.get('http://192.168.0.2/dprop.jsn').pipe(res);

    // request('http://192.168.0.2/dprop.jsn', function (error, response, body) {
    //     if ( response.statusCode == 200) {
    //         // console.log( body );       
    //         var temp = JSON.parse(body);
    //         // console.log( temp[0].ProductId );

    //         var myproduct = _.find(temp, function(o) {
    //             return o.ProductId === "BAE00T4";
    //         });
    //         // console.log(myproduct);
    //         res.send(myproduct.ProductText);
    //     }
    // });
});

io.on('connection', (socket) => {
    // console.log('a user is connected');
    // setInterval(function(){
    //     io.sockets.emit('message', 'hi');
    // }, 1000);
    allClients.push(socket);   

});

setInterval(function () {
        var timenow = moment().format('hh:mm:ss');
        request('http://192.168.0.2/dprop.jsn', function (error, response, body) {
            if (allClients.length > 0 && response.statusCode == 200) {
                var data = JSON.parse(body);
                data = _.find(data, function (o) {
                    return o.ProductId === "BAE00T4";
                });
                var processdata = data.ProcessInputs.split(' ').join('').substring(0, 6);
                console.log(processdata.substring(0, 6));
                var result = {
                    "Time": timenow,
                    "Product": data.ProductText,
                    "Voltage": (parseInt(processdata.substr(0, 3), 16) * 0.1).toString(),
                    "Current": (parseInt(processdata.substring(3, 6), 16) * 0.1).toString()
                };
                io.sockets.emit('voutiout', result);
            }
        });
        // // request 0x0506 - operating hours
        // request.post({url: 'http://192.168.0.2/iolink.htm', form: {Port:'0', Index:'1286',SubIndex:'0'}}, function(err,httpResponse,body){
        //     var myvalue = parseInt(extractHTMLtoValue(body),16).toString();
        //     console.log(myvalue);
        //     io.sockets.emit('operatinghour', myvalue);
        // });
        // // request 0x0502 - life time in years
        // request.post({url: 'http://192.168.0.2/iolink.htm', form: {Port:'0', Index:'1282',SubIndex:'0'}}, function(err,httpResponse,body){
        //     var myvalue = parseInt(extractHTMLtoValue(body),16).toString();
        //     console.log(myvalue);
        //     io.sockets.emit('expectedlifetime', myvalue);
        // });
        //  // request 0x0503 - Primary Capacitor Temperature
        //  request.post({url: 'http://192.168.0.2/iolink.htm', form: {Port:'0', Index:'1283',SubIndex:'0'}}, function(err,httpResponse,body){
        //     var myvalue = parseInt(extractHTMLtoValue(body),16).toString();
        //     console.log(myvalue);
        //     io.sockets.emit('primcaptemp', myvalue);
        // });
        //  // request 0x0504 - Secondary Capacitor Temperature
        //  request.post({url: 'http://192.168.0.2/iolink.htm', form: {Port:'0', Index:'1284',SubIndex:'0'}}, function(err,httpResponse,body){
        //     var myvalue = parseInt(extractHTMLtoValue(body),16).toString();
        //     console.log(myvalue);
        //     io.sockets.emit('seccaptemp', myvalue);
        // });
        
}, 5000);

setInterval(function () {   
    // request 0x0506 - operating hours
    request.post({url: 'http://192.168.0.2/iolink.htm', form: {Port:'0', Index:'1286',SubIndex:'0'}}, function(err,httpResponse,body){
        var myvalue = parseInt(extractHTMLtoValue(body),16).toString();
        console.log(myvalue);
        io.sockets.emit('operatinghour', myvalue);
    });    
}, 6000);

setInterval(function() {
    // request 0x0502 - life time in years
    request.post({url: 'http://192.168.0.2/iolink.htm', form: {Port:'0', Index:'1282',SubIndex:'0'}}, function(err,httpResponse,body){
        var myvalue = parseInt(extractHTMLtoValue(body),16).toString();
        console.log(myvalue);
        io.sockets.emit('expectedlifetime', myvalue);
    });
    
}, 7000);

setInterval(function() {
     // request 0x0503 - Primary Capacitor Temperature
     request.post({url: 'http://192.168.0.2/iolink.htm', form: {Port:'0', Index:'1283',SubIndex:'0'}}, function(err,httpResponse,body){
        var myvalue = parseInt(extractHTMLtoValue(body),16).toString();
        console.log(myvalue);
        io.sockets.emit('primcaptemp', myvalue);
    });
    
}, 8000);

setInterval(function() {
     // request 0x0504 - Secondary Capacitor Temperature
     request.post({url: 'http://192.168.0.2/iolink.htm', form: {Port:'0', Index:'1284',SubIndex:'0'}}, function(err,httpResponse,body){
        var myvalue = parseInt(extractHTMLtoValue(body),16).toString();
        console.log(myvalue);
        io.sockets.emit('seccaptemp', myvalue);
    });
}, 9000);
function extractHTMLtoValue(data) {   
    return data.match(/(elemResult.value\s=\s").*;/g)[0].match(/(["'])(?:(?=(\\?))\2.)*?\1/g)[0].match(/\w./g).join(''); 
}
http.listen(port, function () {
    console.log("server is started");
});