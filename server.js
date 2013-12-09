"use strict";
var port = process.env.PORT || 8000;
var express = require('express');
var app = express()
    , server = require('http').createServer(app);

server.listen(port);

app.configure(function () {
  app.use(express.static(__dirname + '/app'));
});

app.get('/', function (req, res) {
  res.sendfile(__dirname + 'app/index.html');
});

