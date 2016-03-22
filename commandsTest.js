var arDrone = require('ar-drone');
var commands = require('/Users/noahverke/Documents/AutoDrone/commands.js');
console.log(commands);
var client = arDrone.createClient();

//client.takeoff();
//client.on('navdata', console.log);

var stdin = process.stdin;
stdin.setRawMode(true);
stdin.resume();
stdin.setEncoding('utf8');

stdin.on('data', function(key){
         if (key == '\u001B\u005B\u0042') {
         process.stdout.write('land');
         client.land();
         }
         });

client
.after(5000, function() {
       client.front()
       })
.after(7000, function() {
       client.land();
       });