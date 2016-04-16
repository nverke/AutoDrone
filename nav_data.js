var arDrone = require('ar-drone');
var client = arDrone.createClient();

var string,mask,index,string_form;
var xVelocity,yVelocity;
var masks = ["xVelocity","yVelocity","zVelocity"];

client.on('navdata', (data) => {
          //onsole.log(data);
          print(parseData(data,masks));
          });

function parseData(data,masks) {
    var output_data = new Array(masks.length);
    for (var i = 0; i < masks.length; i++) {
        string = JSON.stringify(data);
        mask = masks[i];
        index = string.search(mask);
        string_form = string.substr(index+(mask.length+2),6);
        datum = parseFloat(string_form);
        output_data[i] = datum;
    }
    return output_data;
}

function print(argument) {
    console.log(argument);
}