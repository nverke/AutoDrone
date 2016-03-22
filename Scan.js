var statistics = require('math-statistics');
var usonic     = require('../lib/usonic.js');


var scan = function() {
    var sensors = [usonic.createSensor(24, 23, 750), usonic.createSensor(21, 20, 750), usonic.createSensor(16, 12, 750), usonic.createSensor(26, 19, 750), usonic.createSensor(6, 5, 750)];
    var readings;
    
    
                      
                      
                      
