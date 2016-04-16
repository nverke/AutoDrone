'use strict';

var arDrone    = require('ar-drone');
var readline   = require('readline');
var statistics = require('math-statistics');
var usonic     = require('../lib/usonic.js');


//var sensor = usonic.createSensor(24, 23, 750);
//var sensor2 = usonic.createSensor(21, 20, 750);
//var sensor3 = usonic.createSensor(16, 12, 750);
//var sensor4 = usonic.createSensor(26, 19, 750);
//var sensor5 = usonic.createSensor(6, 5, 750);

var client = arDrone.createClient();
var speed = 0.05;
var time = 1000;

var droneX = 50;
var droneY = 50;

var map = new Array(100);
for (var i = 0; i < 100; i++){
    map[i] = new Array(100);
}

usonic.init(function(error) {
            if (error) {
            
            } else {
            var sensor = usonic.createSensor(24, 23, 750);
            var sensor2 = usonic.createSensor(21, 20, 750);
            var sensor3 = usonic.createSensor(16, 12, 750);
            var sensor4 = usonic.createSensor(26, 19, 750);
            //var sensor5 = usonic.createSensor(6, 5, 750);
            }
            });

var sense = function() {
    map[droneX][droneY] = false;
    console.log(sensor());
    console.log(sensor2());
    console.log(sensor3());
    console.log(sensor4());
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

var move = function() {
    if (map[droneX][droneY+1]) {
        client.front(speed);
        client.after(time, function() {
                     client.stop();
                     });
    }
    if (map[droneX+1][droneY]) {
        client.right(speed);
        client.after(time, function() {
                     client.stop();
                     });
    }
    if (map[droneX][droneY-1]) {
        client.back(speed);
        client.after(time, function() {
                     client.stop();
                     });
    }
    if (map[droneX-1][droneY]) {
        client.left(speed);
        client.after(time, function() {
                     client.stop();
                     });
    }
}

while(1) {
    //client.takeoff();
    sense();
    //move();
}
