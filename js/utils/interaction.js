function moveFoward(camera, rate){
	var direction = crossProduct(camera.up, camera.right);
	direction = normalize(direction);
	var newPosition = vectorPlus(camera.position, vectorMulti(rate, direction));
	camera.setPosition(newPosition);
}

function moveBackward(camera, rate){
	var direction = crossProduct(camera.right, camera.up);
	direction = normalize(direction);
	var newPosition = vectorPlus(camera.position, vectorMulti(rate, direction));
	camera.setPosition(newPosition);
}

function panLeft(camera, rate){
	var direction = vectorMulti(-1, camera.right);
	direction = normalize(direction);
	var newPosition = vectorPlus(camera.position, vectorMulti(rate, direction));
	camera.setPosition(newPosition);
}

function panRight(camera, rate){
	var direction = camera.right;
	direction = normalize(direction);
	var newPosition = vectorPlus(camera.position, vectorMulti(rate, direction));
	camera.setPosition(newPosition);
}

function panUp(camera, rate){
	var direction = camera.up;
	direction = normalize(direction);
	var newPosition = vectorPlus(camera.position, vectorMulti(rate, direction));
	camera.setPosition(newPosition);
}

function panDown(camera, rate){
	var direction = vectorMulti(-1, camera.up);
	direction = normalize(direction);
	var newPosition = vectorPlus(camera.position, vectorMulti(rate, direction));
	camera.setPosition(newPosition);
}

function turnLeft(camera, rate){
	var angle = rate % 360 + camera.azimuth;
	camera.setAzimuth(angle % 360);
}

function turnRight(camera, rate){
	var angle = camera.azimuth - rate % 360;
	camera.setAzimuth(angle % 360);
}

function turnUp(camera, rate){
	var angle = rate % 360 + camera.elevation;
	camera.setElevation(angle % 360);
}

function turnDown(camera, rate){
	var angle = camera.elevation - rate % 360;
	camera.setElevation(angle % 360);
}

var PanningRate = .1;
var TurningRate = 1;
var ScaleRate = 0.1;
var TurningRateMode2 = 0.025;



var mode = 0;
var target = 0;
var cameraLevelAng = 0;
var cameraVerticalAng = 0;
var scale = 10.0;

window.onkeydown = function(ev){
	console.log(ev.keyCode);
	//` is Pressed, change mode;
	if(ev.keyCode == 192){
		mode = 1 - mode;
		target = 0;
		cameraLevelAng = 0;
		cameraVerticalAng = 0;
	}
	if(mode == 0){
		//W is Pressed
		if(ev.keyCode == 87){
			moveFoward(camera, PanningRate);
		}
		//S is Pressed
		if(ev.keyCode == 83){
			moveBackward(camera, PanningRate);
		}
		//A is Pressed
		if(ev.keyCode == 65){
			panLeft(camera, PanningRate);
		}
		//D is Pressed
		if(ev.keyCode == 68){
			panRight(camera, PanningRate);
		}
		//Q is Pressed
		if(ev.keyCode == 81){
			turnLeft(camera, TurningRate);
		}
		//E is Pressed
		if(ev.keyCode == 69){
			turnRight(camera, TurningRate);
		}
		//R is Pressed
		if(ev.keyCode == 82){
			turnUp(camera, TurningRate);
		}
		//F is Pressed
		if(ev.keyCode == 70){
			turnDown(camera, TurningRate);
		}
		//Z is Pressed
		if(ev.keyCode == 90){
			panUp(camera, PanningRate);
		}
		//C is Pressed
		if(ev.keyCode == 67){
			panDown(camera, PanningRate);
		}
		//+ is Pressed
		if(ev.keyCode == 187){
			if(PanningRate < 100.0){
				PanningRate += 0.1;
			}
		}
		//- is Pressed
		if(ev.keyCode == 189){
			if(PanningRate > 0.05){
				PanningRate -= 0.1;
			}
		}
		//[ is Pressed
		if(ev.keyCode == 219){
			if(TurningRate > 0.05){
				TurningRate -= 0.1;
			}
		}
		//] is Pressed
		if(ev.keyCode == 221){
			if(TurningRate < 100.0){
				TurningRate += 0.1;
			}
		}
	}else{
		//Q is Pressed
		if(ev.keyCode == 81){
			turnLeft(camera, TurningRate);
		}
		//E is Pressed
		if(ev.keyCode == 69){
			turnRight(camera, TurningRate);
		}
		//R is Pressed
		if(ev.keyCode == 82){
			turnUp(camera, TurningRate);
		}
		//F is Pressed
		if(ev.keyCode == 70){
			turnDown(camera, TurningRate);
		}
		//W is Pressed
		if(ev.keyCode == 87){
			if(scale > 2.0){
				scale -= ScaleRate;
			}
		}
		//S is Pressed
		if(ev.keyCode == 83){
			scale += ScaleRate;
		}
		//A is Pressed
		if(ev.keyCode == 65){
			cameraLevelAng += TurningRateMode2;
		}
		//D is Pressed
		if(ev.keyCode == 68){
			cameraLevelAng -= TurningRateMode2;
		}
		//Z is Pressed
		if(ev.keyCode == 90){
			cameraVerticalAng += ScaleRate;
		}
		//C is Pressed
		if(ev.keyCode == 67){
			cameraVerticalAng -= ScaleRate;
		}
		if(ev.keyCode == 49){
			target = 0;
		}
		if(ev.keyCode == 50){
			target = 1;
		}
		if(ev.keyCode == 51){
			target = 2;
		}
		if(ev.keyCode == 52){
			target = 3;
		}
		if(ev.keyCode == 53){
			target = 4;
		}
		if(ev.keyCode == 54){
			target = 5;
		}
		if(ev.keyCode == 55){
			target = 6;
		}
		if(ev.keyCode == 56){
			target = 7;
		}
	}
}


