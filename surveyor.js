'use strict';

var readline   = require('readline');
var statistics = require('math-statistics');
var usonic     = require('../lib/usonic.js');

var print = function (distances) {

    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    
    if (distances[0] < 0) {
        process.stdout.write('Error: Measurement timeout.\n');
    } else {
        process.stdout.write('Distance: ' + distances[0].toFixed(2) + ' cm  Distance2: ' + distances[1].toFixed(2) + 'cm distance3:  ' + distances[2].toFixed(2) +' cm distance4: ' + distances[3].toFixed(2) + ' cm distance5: ' + distances[4].toFixed(2));
    }
};

var initSensor = function () {
    var sensors = [usonic.createSensor(24, 23, 750), usonic.createSensor(21, 20, 750), usonic.createSensor(16, 12, 750), usonic.createSensor(26, 19, 750), usonic.createSensor(6, 5, 750)];
    var readings;

    (function measure() {
        if (!distances || distances.length === config.rate) {
            if (distances) {
                var distances = [statistics.median(readings[0]), statistics.median(readings[1]), statistics.median(readings[2]), statistics.median(readings[3]), statistics.median(readings[4]);
                return distances;
            }
            readings[0] = [];
            readings[1] = [];
            readings[2] = [];
            readings[3] = [];
            readings[4] = [];
        }
        setTimeout(function () {
            readings[0].push(sensors[0]);
            readings[1].push(sensors[1]);
            readings[2].push(sensors[2]);
            readings[3].push(sensors[3]);
            readings[4].push(sensors[4]);

            measure();
        }, config.delay);
    }());
};



