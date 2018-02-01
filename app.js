var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var PubNub = require('pubnub');


app.use(express.static('D:/xampp/htdocs/socket.io_sample/dist'));

app.get('/', function(req, res) {
   res.sendfile('index.html');
});

io.on('connection', function (socket) {
	var strDat
	pubnub = new PubNub({
        publishKey : 'demo',
        subscribeKey : 'sub-c-4377ab04-f100-11e3-bffd-02ee2ddab7fe'
    })
       
    pubnub.addListener({
        message: function(message) {
        	if(message.message.symbol=='Apple'){
        		var x = new Date(message.message.timestamp);
				var formatted =  (x.getHours()) + ':' + (x.getMinutes()) + ':' + (x.getSeconds()) + ':' + (x.getMilliseconds());
        		strData = {"label": formatted,
						   "value":message.message.order_quantity
						}
				socket.emit('news', strData);
        	};  
        }
    })      
    console.log("Subscribing..");
    pubnub.subscribe({
        channels: ['pubnub-market-orders'] 
    });
});

http.listen(3000, function() {
   console.log('listening on *:3000');
});