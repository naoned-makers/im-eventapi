"use strict";

require('babel-register');
let threerest = require('threerest');
let path = require('path');
let cors = require('cors');
let request = require('request');
let fs = require('fs');

import * as ServiceSessions from "./services/serviceSessions";
import * as ServiceSchedules from "./services/serviceSchedules";
import * as ServiceSpeakers from "./services/serviceSpeakers";
import * as ServiceTalks from "./services/serviceTalks";

import express from "express";

var app = express();

app.use(cors());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(express.static(path.join(__dirname + './')));
app.get("/", function(req, res){
  res.send("Les ressources disponibles sont /sessions /speakers et /rooms");
});
app.get("/jarvis", function(req, res){
  res.sendFile('/naoned-makers/ironman/im-eventapi/speaktojarvis.html', { root: __dirname });
});

// Update Devfest data
request('https://devfest.gdgnantes.com/data/schedule.json').pipe(fs.createWriteStream('database/schedule.json'));
request('https://devfest.gdgnantes.com/data/sessions.json').pipe(fs.createWriteStream('database/sessions.json'));
request('https://devfest.gdgnantes.com/data/speakers.json').pipe(fs.createWriteStream('database/speakers.json'));

// load the service Test
threerest.ServiceLoader.loadService(app, new ServiceSessions.default());
threerest.ServiceLoader.loadService(app, new ServiceSchedules.default());
threerest.ServiceLoader.loadService(app, new ServiceSpeakers.default());
threerest.ServiceLoader.loadService(app, new ServiceTalks.default());

app.listen(8082, () => {
  console.log("Express start...");
  console.log("Les APIs sont consultables aux adresses :"); 
  console.log("http://localhost:8082/sessions");
  console.log("http://localhost:8082/speakers");
  console.log("http://localhost:8082/schedule");
});
