

function graph(c) {
    
    //initilize canvases and contexts for graphical representation.
    this.canvas = document.getElementById(c);
    this.context = this.canvas.getContext("2d");
    
    //createing the imgData array to be used later for graphical representation.
    this.imgData = this.context.createImageData(this.canvas.width,this.canvas.height);
    
    //fill the imgData with RGB packets describing black pixels (0,0,0) and max transparency (visible).
    for (var i = 0; i < this.imgData.data.length; i += 4) {
        this.imgData.data[i + 0] = 0;
        this.imgData.data[i + 1] = 0;
        this.imgData.data[i + 2] = 0;
        this.imgData.data[i + 3] = 255;
    }
    
    //put that imagData onto the canvas.
    this.context.putImageData(this.imgData,0,0);
    
    //create an array to keep track of the changes made to the imgData array.
    this.changes = [];
    this.changeCount = 0;
    
    //initilize the density of this map as 100.
    this.density = 100;
    this.oldDensity = 100;
    
    //create empty 2d array to be used as a binary map.
    this.binaryMap = new Array(this.canvas.width);
    for (var x = 0; x < this.binaryMap.length; x++) {
        this.binaryMap[x] = new Array(this.canvas.height);
        for (var y = 0; y < this.binaryMap[x].length; y++) {
            this.binaryMap[x][y] = "u";
        }
    }
    
    //function used to update the imgData array with the changes described by the "changes" array.
    this.update = function()  {
        for (var i = 0; i < this.changes.length; i++) {
            var offset = 4*(this.changes[i].x + this.changes[i].y*this.canvas.width);
            if (this.changes[i].value == "empty") {
                this.imgData.data[offset + 0] = 255;
                this.imgData.data[offset + 1] = 255;
                this.imgData.data[offset + 2] = 255;
                this.imgData.data[offset + 3] = 255;
                this.density -= 100/(this.canvas.width*this.canvas.height);
            } else if (this.changes[i].value == "object") {
                this.imgData.data[offset + 0] = 255;
                this.imgData.data[offset + 1] = 0;
                this.imgData.data[offset + 2] = 0;
                this.imgData.data[offset + 3] = 255;
            }
        }
        
        this.changeCount += this.changes.length;
        this.changes = [];
        this.context.putImageData(this.imgData, 0, 0);
    };
    
    //function used to easily create test data in the form of solid rectangles.
    this.createObject = function(x,y,width,height) {
        for (var i = x; i < width + x; i++) {
            for (var j = y; j < height + y; j++) {
                if(this.binaryMap[i][j] != "object") {
                    this.binaryMap[i][j] = "object";
                    this.changes.push({x:i,y:j,value:"object"});
                }
            }
        }
        this.update();
    };
    
    //function used to test if a coordinate is within the acceptable range for the canvas.
    this.testCoord = function(x,y) {
        if(x >= this.canvas.width || x < 0 || y >= this.canvas.height || y < 0) {
            return false;
        } else {
            return true;
        }
    };
    
    //function used to check an area to see how much of it has been cleared.
    this.checkFogDensity = function(x, y, width, height) {
        var count = 0;
        for (var i = Math.round(x - width/2); i < Math.round(x + width/2); i++) {
            for (var j = Math.round(y - height/2); j < Math.round(y + height/2); j++) {
                if(this.testCoord(i,j) && this.binaryMap[i][j] == "u") {
                    //increment the count if the pixel is unknown and only unknown.
                    count++;
                } 
            }
        }
        return 100*count/(width*height);
    };
}

//Object used to describe the drone's goals.
function path(start, end, spacing) {
    
    this.start = start;
    this.end = end;
    this.length = start.distanceFrom(end);
    this.spacing = spacing; //number of elements between each node.
    this.nodes = new Array(Math.floor(this.length/this.spacing));
    this.pathAngle = start.angleBetween(end); //angle between the start of the path and the end.
    
    //create a straight path between the start and end.
    for (var i = 0; i < this.nodes.length; i++) {
        this.nodes[i] = new point(Math.floor(this.start.x + this.spacing*i*Math.cos(this.pathAngle)), Math.floor(this.start.y + this.spacing*i*Math.sin(this.pathAngle)));
    }
    this.nodes[this.nodes.length] = this.end;
    
    this.insertNode = function(index, point) {
        this.nodes.splice(index,0,point);
    };
    
    this.removeNode = function(index) {
        this.nodes.splice(index,1);
    };
    
    this.replaceNode = function(index, point) {
        this.nodes.splice(index,1,point);
    };
}

//Object used to make code easier to understand.
function point(x,y) {
    this.x = x;
    this.y = y;
    
    this.distanceFrom = function(point) {
        return Math.sqrt(Math.pow(point.x - this.x,2) + Math.pow(point.y - this.y,2));
    };
    
    this.angleBetween = function(point) {
        return Math.atan2(point.y - this.y, point.x - this.x);
    };
}

//Object type used to describe the vectors used.
function vector(magnitude, angle) {
    this.magnitude = magnitude;
    this.angle = angle;
    this.x = magnitude*Math.cos(angle);
    this.y = magnitude*Math.sin(angle);
    
    this.componentSet = function(x,y) {
        this.x = x;
        this.y = y;
        this.magnitude = Math.sqrt(Math.pow(this.x,2) + Math.pow(this.y,2));
        this.angle = Math.atan2(this.y, this.x);
    };
    
    this.add = function(vector2) {
        this.x += vector2.magnitude*Math.cos(vector2.angle);
        this.y += vector2.magnitude*Math.sin(vector2.angle);
        this.magnitude = Math.sqrt(Math.pow(this.x,2) + Math.pow(this.y,2));
        this.angle = Math.atan2(this.y, this.x);
    };
    
    this.resize = function(length) {
        if (this.magnitude !== 0) {
            this.x = length*this.x/this.magnitude;
            this.y = length*this.y/this.magnitude;
            this.magnitude = Math.sqrt(Math.pow(this.x,2) + Math.pow(this.y,2));
            this.angle = Math.atan2(this.y, this.x);
        }
    };
}

//Object used to store all data relevent to the drone and perform the functions of the drone.
var drone = function() {
    
    this.sensorRange = 150; //defined by the ultrasonic sensor
    this.sensorErrorRange = 10; //defined by the ultrasonic sensor
    this.width = 40; //drones width
    
    this.position = new point(360,360);
    this.velocity = new vector(0,0);
    this.acceleration = new vector(0,0);
    this.rotation = new vector(0,0); //magnitude describes the rotational velocity and angle describes the angle the drone is facing.
    
    this.goal = new point(this.position.x, this.position.y);
    this.sensorData = [this.sensorRange,this.sensorRange,this.sensorRange,this.sensorRange]; //array that holds the sensorData for the right, front, left, back facing sensors respectively.
    this.path = new path(this.position, this.goal, this.sensorRange);
    
    //function that takes a reading from the four outward facing sensors.
    this.scan = function(testMap) {
        
        for (var i = 0; i < this.sensorData.length; i++) {
            for (var amplitude = 0; amplitude <= this.sensorRange; amplitude++) {
                
                var x = Math.round(this.position.x + amplitude*Math.cos(this.rotation.angle + i*Math.PI/2));
                var y = Math.round(this.position.y - amplitude*Math.sin(this.rotation.angle + i*Math.PI/2));
                
                this.sensorData[i] = amplitude - 1;
                
                if(map.testCoord(x,y) && testMap.binaryMap[x][y] == "object") {
                    amplitude = this.sensorRange+1;
                }
                
            }
        }
    };
    
    //updates the internal binary map that the drone keeps track of. This binary map is then converted into an image for graphical representation
    this.updateBinaryMap = function(map) {
        
        for (var i = 0; i < this.sensorData.length; i++) {
            for (var amplitude = 0; amplitude <= this.sensorData[i]; amplitude++) {
                
                var x = Math.round(this.position.x + amplitude * Math.cos(this.rotation.angle + i * Math.PI/2));
                var y = Math.round(this.position.y - amplitude * Math.sin(this.rotation.angle + i * Math.PI/2));
                
                if (amplitude == this.sensorData[i] && map.binaryMap[x][y] != "object" && this.sensorData[i] < this.sensorRange - this.sensorErrorRange) {
                    map.binaryMap[x][y] = "object";
                    map.changes.push({x:x,y:y,value:"object"});
                } else if (map.binaryMap[x][y] != "empty") {
                    map.binaryMap[x][y] = "empty";
                    map.changes.push({x:x,y:y,value:"empty"});
                }
            }
        }
        map.update();
        map.context.fillStyle = "#0000FF"; //draw the drone
        map.context.fillRect(this.position.x,this.position.y,10,10);
        map.context.fillStyle = "#00FF00"; //draw the goal
        map.context.fillRect(this.goal.x,this.goal.y,10,10);
    };
    
    //updates the goal for the drone via one of two algorithms
    this.updateGoal = function(map) {
        
        //if the goal has been reached
        if (this.position.distanceFrom(this.goal) < 10) {
            
            if (this.path.nodes.length > 1) {
                
                this.path.removeNode(0);
                this.goal = this.path.nodes[0];
                
            //find which direction has lowest density of discovered pixels
            } else {
                
                var maxFogDensity = 0;
                for (var i = 0; i < this.sensorData.length; i++) {
                    if (this.sensorData[i] >= this.sensorRange - this.sensorErrorRange) {
                        
                        var x = this.position.x + Math.round(this.sensorData[i]*Math.cos(this.rotation.angle + i*Math.PI/2));
                        var y = this.position.y - Math.round(this.sensorData[i]*Math.sin(this.rotation.angle + i*Math.PI/2));
                        
                        var fogDensity = map.checkFogDensity(x,y,this.sensorRange,this.sensorRange);
                        
                        if (fogDensity > maxFogDensity) {
                            maxFogDensity = fogDensity;
                            this.goal = new point(x,y);
                        }
                    }
                }
                
                map.changeCount = 0;
            }
        }
    };
    

    this.updatePosition = function () {
        this.position.x += this.velocity.x * timeInterval;
        this.position.y += this.velocity.y * timeInterval;
        this.rotation.angle += this.rotation.magnitude * timeInterval;
        if (this.rotation.angle < 0) {
            this.rotation.angle += 2*Math.PI;
        } else if (this.rotation.angle > 2*Math.PI) {
            this.rotation.angle -= 2*Math.PI;
        }
    };
    
    //update velocity making sure to rotate toward the goal before accelerating toward it.
    this.updateVelocity = function() {
        if (Math.abs(this.angleClamp(this.position.angleBetween(this.goal) - this.rotation.angle)) < Math.PI/45) {
            this.velocity.componentSet(this.goal.x - this.position.x, this.goal.y - this.position.y);
            this.velocity.resize(5);
            this.rotation.magnitude = 0;
        } else {
            this.rotation.magnitude = Math.sign(this.angleClamp(this.position.angleBetween(this.goal) - this.rotation.angle)) * Math.PI/90;
            this.velocity.componentSet(0,0);
        }
    };
    
    //ensures no angles are outside of 0 to 2pi.
    this.angleClamp = function(angle) {
        if (angle > 2*Math.PI) {
            return angle - 2*Math.PI;
        } else if (angle < 0) {
            return angle + 2*Math.PI;
        } else {
            return angle;
        }
    };
    
    this.navigate = function(map, testMap) {
        this.scan(testMap);
        this.updateBinaryMap(map);
        this.updateGoal(map);
        this.updateVelocity();
        this.updatePosition();
    };
};

var timeInterval = 1;

//create the map objects.
var map = new graph("map");
var testMap = new graph("testMap");

testMap.createObject(0,150,testMap.canvas.width - 200,20);
testMap.createObject(100,150,50,100);
testMap.createObject(500,370,50,100);
testMap.createObject(0,550,50,50);
testMap.createObject(0,0,testMap.canvas.width,50);
testMap.createObject(0,testMap.canvas.height - 20,testMap.canvas.width,20);
testMap.createObject(0,0,20,testMap.canvas.height);
testMap.createObject(testMap.canvas.width - 20,0,20,testMap.canvas.height);

//create the drone object and perform intitial scan.
var drone = new drone();
drone.scan(testMap);
drone.updateBinaryMap(map);

//eventlistener used for updateing the drone whenever a key is pressed. (For testing purposes)
addEventListener("keydown", function (e) {
                 if (e.keyCode == 32) {
                    //spacebar runs a given number of steps.
                    for (var i = 0; i < 100; i++) {
                        drone.navigate(map, testMap);
                    }
                 } else {
                 //have the drone navigate after any key press.
                 drone.navigate(map, testMap);
                 }
                 }, false);

