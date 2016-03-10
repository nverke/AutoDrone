'use strict';

var readline   = require('readline');
var statistics = require('math-statistics');
var usonic     = require('../lib/usonic.js');
var arDrone    = require('/home/pi/node_modules/ar-drone');

var client = arDrone.createClient();
client.takeoff();

var print = function (distances, distances2, distances3, distances4, distances5) {
    var distance = statistics.median(distances);
    var distance2 = statistics.median(distances2);
    var distance3 = statistics.median(distances3);
    var distance4 = statistics.median(distances4);
    var distance5 = statistics.median(distances5);

    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    if (distance < 10) {
        client.land();
    }
    if (distance < 0) {
        process.stdout.write('Error: Measurement timeout.\n');
    } else {
        process.stdout.write('Distance: ' + distance.toFixed(2) + ' cm  Distance2: ' + distance2.toFixed(2) + 'cm distance3:  ' + distance3.toFixed(2) +' cm distance4: ' + distance4.toFixed(2) + ' cm distance5: ' + distance5.toFixed(2));
    }
};

var initSensor = function (config) {
    var sensor = usonic.createSensor(config.echoPin, config.triggerPin, config.timeout);
    var sensor2 = usonic.createSensor(22, config.triggerPin, 750);
    var sensor3 = usonic.createSensor(18, config.triggerPin, 750);
    var sensor4 = usonic.createSensor(20, config.triggerPin, 750);
    var sensor5 = usonic.createSensor(19, config.triggerPin, 750);

    console.log('Config: ' + JSON.stringify(config));

    var distances;
    var distances2;
    var distances3;
    var distances4;
    var distances5;

    (function measure() {
        if (!distances || distances.length === config.rate) {
            if (distances) {
                print(distances, distances2, distances3, distances4, distances5);
            }

            distances = [];
            distances2 = [];
            distances3 = [];
            distances4 = [];
            distances5 = [];
        }

        setTimeout(function () {
            distances.push(sensor());
            distances2.push(sensor2());
            distances3.push(sensor3());
            distances4.push(sensor4());
            distances5.push(sensor5());

            measure();
        }, config.delay);
    }());
};

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

var askForInteger = function (name, defaultValue, callback) {
    rl.question(name + ' (default ' + defaultValue + '): ', function (response) {
        var value = parseInt(response, 10);

        callback(isNaN(value) ? defaultValue : value);
    });
};

askForInteger('Echo pin', 24, function (echoPin) {
    askForInteger('Trigger pin', 23, function (triggerPin) {
        askForInteger('Measurement timeout in µs', 750, function (timeout) {
            askForInteger('Measurement delay in ms', 60, function (delay) {
                askForInteger('Measurements per sample', 5, function (rate) {
                    rl.close();

                    usonic.init(function (error) {
                        if (error) {
                            console.log(error);
                        } else {
                            initSensor({
                                echoPin: echoPin,
                                triggerPin: triggerPin,
                                timeout: timeout,
                                delay: delay,
                                rate: rate
                            });
                        }
                    });
                });
            });
        });
    });
});

