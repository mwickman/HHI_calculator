"use strict";
var port = process.env.PORT || 8000;
var express = require('express');
var app = express()
    , server = require('http').createServer(app);

server.listen(port, function(){
  console.log('server started on port ', port);
});

app.configure(function () {
  app.use(express.static(__dirname + '/app'));
  app.use("/bower_components", express.static(__dirname + '/bower_components'));
});

app.get('/', function (req, res) {
  res.sendfile(__dirname + 'app/index.html');
});

app.get('/sample.csv', function (req, res){
  res.sendfile(__dirname + '/sample.csv');
});