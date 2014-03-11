"use strict";

var http = require('http');
var path = require('path');

var express = require('express');

var app = express();

app.use(express.bodyParser());

//get user status handler
app.get('/status/:id', function(req, res){
    var 
        id = parseInt(req.params['id'], 10),
        result = {
            id      : id,
            user    : 'user_'+id,
            online  : !!Math.round(Math.random())
        };
    
    
    //random response time
    var longOperationTime = Math.round(Math.random()*300);
    setTimeout(
        function(){
            console.log("User "+id+" request took "+longOperationTime+"ms.");
            res.json(result);
        }, 
        longOperationTime
    );
});

//results handler
app.post('/result', function(req, res){

    //what to do with it ?
    console.log(req.body);
    
    res.send(200);
});

//static files
app.use(express.static(path.resolve(__dirname, 'public')));

var server = http.createServer(app);
server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Server listening at", addr.address + ":" + addr.port);
});
