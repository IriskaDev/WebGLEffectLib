function SceneTransforms(c){
	this.stack = [];
	this.camera = c;
	this.mvMatrix	= mat4.create();
	this.pMatrix	= mat4.create();
	this.nMatrix	= mat4.create();
	this.cMatrix	= mat4.create();
};

SceneTransforms.prototype.calculateModelView = function(){
	this.mvMatrix = this.camera.getViewTransform();
};

SceneTransforms.prototype.calculateNormal = function(){
	mat4.identity(this.nMatrix);
	mat4.set(this.mvMatrix, this.nMatrix);
	mat4.inverse(this.nMatrix);
	mat4.transpose(this.nMatrix);
};

SceneTransforms.prototype.calculatePerspective = function(theta, aspect, near, far){
	mat4.identity(this.pMatrix);
	mat4.perspective(theta, aspect, near, far, this.pMatrix);
};

SceneTransforms.prototype.init = function(){
	this.calculateModelView();
	this.calculatePerspective();
	this.calculateNormal();
};

SceneTransforms.prototype.updatePerspective = function(theta, aspect, near, far){
	mat4.perspective(theta, aspect, near, far, this.pMatrix);
};

SceneTransforms.prototype.setMatrixUniforms = function(gl, prg){
	this.calculateNormal();
	gl.uniformMatrix4fv(prg.uMVMatrix, false, this.mvMatrix);
	gl.uniformMatrix4fv(prg.uPMatrix, false, this.pMatrix);
	gl.uniformMatrix4fv(prg.uNMatrix, false, this.nMatrix);
};
SceneTransforms.prototype.setMatrixUniform = function(gl, prg, uMatrix){
	gl.uniformMatrix4fv(prg[uMatrix], false, this.mvMatrix);
}
SceneTransforms.prototype.push = function(){
	var memento = mat4.create();
	mat4.set(this.mvMatrix, memento);
	this.stack.push(memento);
}

SceneTransforms.prototype.pop = function(){
	if(this.stack.length == 0) return;
	this.mvMatrix = this.stack.pop();
};



var CAMERA_ORBITING_TYPE = 1;
var CAMERA_TRACKING_TYPE = 2;

function Camera(t){
	this.matrix		= mat4.create();
	this.up			= vec3.create();
	this.right		= vec3.create();
	this.normal		= vec3.create();
	this.position	= vec3.create();
	this.focus		= vec3.create();
	this.azimuth	= 0.0;
	this.elevation	= 0.0;
	this.type		= t;
	this.steps		= 0;

	this.home = vec3.create();

	this.hookRenderer = null;
}

Camera.prototype.setType = function(t){
	this.type = t;
	
	if(t != CAMERA_ORBITING_TYPE && t != CAMERA_TRACKING_TYPE){
		alert('WRONG CAMERA TYPE!!!');
		this.type = CAMERA_ORBITING_TYPE;
	}
}

Camera.prototype.goHome = function(h){
	if(h != null){
		this.home = h;
	}

	this.setPosition(this.home);
	this.setAzimuth(0);
	this.setElevation(0);
	this.steps = 0;
}

Camera.prototype.dolly = function(s){	//This function can use as scaling function
	var c = this;
	var p = vec3.create();
	var n = vec3.create();

	p = c.position;
	var step = s - c.steps;

	vec3.normalize(c.normal, n);

	var newPosition = vec3.create();

	if(c.type == CAMERA_TRACKING_TYPE){
		newPosition[0] = p[0] - step*n[0];
		newPosition[1] = p[1] - step*n[1];
		newPosition[2] = p[2] - step*n[2];
	}else{
		newPosition[0] = p[0];
		newPosition[1] = p[1];
		newPosition[2] = p[2] - step;
	}

	c.setPosition(newPosition);
	c.steps = s;
}

Camera.prototype.setPosition = function(p){
	vec3.set(p, this.position);
	this.update();
}

Camera.prototype.setFocus = function(f){
	vec3.set(f, this.focus);
	this.update();
}

Camera.prototype.setAzimuth = function(az){
	this.changeAzimuth(az - this.azimuth);
}

Camera.prototype.changeAzimuth = function(az){
	var c = this;
	c.azimuth += az;
	if(c.azimuth > 360 || c.azimuth < -360){
		c.azimuth = c.azimuth % 360;
	}
	c.update();
}

Camera.prototype.setElevation = function(el){
	this.changeElevation(el - this.elevation);
}

Camera.prototype.changeElevation = function(el){
	var c = this;

	c.elevation += el;

	if(c.elevation > 360 || c.elevation < -360){
		c.elevation = c.elevation % 360;
	}

	c.update();
}

Camera.prototype.calculateOrientation = function(){
	var m = this.matrix;
	mat4.multiplyVec4(m, [1,0,0,0], this.right);
	mat4.multiplyVec4(m, [0,1,0,0], this.up);
	mat4.multiplyVec4(m, [0,0,1,0], this.normal);
}
Camera.prototype.orientation = function(){
	var i;
}
Camera.prototype.update = function(){
	mat4.identity(this.matrix);

	this.calculateOrientation();

	if(this.type == CAMERA_TRACKING_TYPE){
		mat4.translate(this.matrix, this.position);
		mat4.rotateY(this.matrix, this.azimuth * Math.PI/180);
		mat4.rotateX(this.matrix, this.elevation * Math.PI/180);
	}else{
		var trxLook = mat4.create();
		mat4.rotateY(this.matrix, this.azimuth * Math.PI/180);
		mat4.rotateX(this.matrix, this.elevation * Math.PI/180);
		mat4.translate(this.matrix, this.position);
	}


	this.calculateOrientation();

	if(this.type == CAMERA_TRACKING_TYPE){
		mat4.multiplyVec4(this.matrix, [0,0,0,1], this.position);
	}

	//ABOUT HOOKRENDER

	//ABOUT HOOKGUIUPDATE
	if(this.hookRenderer){
		this.hookRenderer();
	}

}

Camera.prototype.getViewTransform = function(){
	var m = mat4.create();
	mat4.inverse(this.matrix, m);
	return m;
}

Camera.prototype.setViewPoint = function(viewPoint){
}






/*Vector Calculation tools*/
function normalize(v){
	var vn = [];
	var length;
	length = Math.sqrt(v[0]*v[0]+v[1]*v[1]+v[2]*v[2]);
	for(var i = 0; i < 3; i ++){
		vn.push(v[i]/length);
	}
	return vn;
}

function crossProduct(v1, v2){
	var ret = [v1[1]*v2[2]-v2[1]*v1[2], -(v1[0]*v2[2]-v2[0]*v1[2]), v1[0]*v2[1]-v2[0]*v1[1]];
	return ret;
}


function dotProduct(v1, v2){
	var ret = v1[0]*v2[0] + v1[1]*v2[1] + v1[2]*v2[2];
	return ret;
}

function vectorPlus(v1, v2){
	var ret = [v1[0]+v2[0], v1[1]+v2[1], v1[2]+v2[2]];
	return ret;
}

function vectorMinus(v1, v2){
	var ret = [v1[0]-v2[0], v1[1]-v2[1], v1[2]-v2[2]];
	return ret;
}

function quadraticAbsVector(v){
	var ret = v[0]*v[0] + v[1]*v[1] + v[2]*v[2];
	return ret;
}

function vectorMulti(para, v){
	var ret = [para*v[0], para*v[1], para*v[2]];
	return ret;
}

function vectorModuls(v){
	var ret = Math.sqrt(quadraticAbsVector(v));
	return ret;
}

function vectorCosAngle(v1, v2){
	var ret = dotProduct(v1, v2) / vectorModuls(v1)*vectorModuls(v2);
	return ret;
}

function linePlaneIntersection(planeNormal, planePoint, lineDirection, linePoint){
	var t = (dotProduct(planePoint, planeNormal) - dotProduct(linePoint, planeNormal)) / dotProduct(lineDirection, planeNormal);
	var ret = vectorPlus(linePoint, vectorMulti(t, lineDirection));
	return ret;
}
