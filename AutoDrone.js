'use strict';

var arDrone    = require('/home/pi/node_modules/ar-drone');
var readline   = require('readline');
var statistics = require('math-statistics');
var usonic     = require('home/pi/node_modules/r-pi-usonic/lib/usonic.js');


var sensor  = usonic.createSensor(24, 23, 750);
var sensor2 = usonic.createSensor(22, 23, 750);
var sensor3 = usonic.createSensor(18, 23, 750);
var sensor4 = usonic.createSensor(20, 23, 750);
var sensor5 = usonic.createSensor(19, 23, 750);

var client = arDrone.createClient();
var speed = 0.1;
var time = 2000;

var droneX = 50;
var droneY = 50;

var map = new Array(100);
for (int i = 0; i < 100; i++){
    map[i] = new Array(100);
}

client.takeoff();
sense();
move();

var sense: function() {
    map[droneX][droneY] = false;
    
    if (sensor() < 20) {
        map[droneX][droneY+1] = true;
    }
    if (sensor2() < 20) {
        map[droneX+1][droneY] = true;
    }
    if (sensor3() < 20) {
        map[droneX][droneY-1] = true;
    }
    if (sensor4() < 20) {
        map[droneX-1][droneY] = true;
    }
}

var move: function() {
    if (map[droneX][droneY+1]) {
        Commands.Forward(client, speed, time);
    }
    if (map[droneX+1][droneY]) {
        Commands.Right(client, speed, time);
    }
    if (map[droneX][droneY-1]) {
        Commands.Back(client, speed, time);
    }
    if (map[droneX-1][droneY]) {
        Commands.Left(client, speed, time);
    }
}
