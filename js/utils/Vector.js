/** 
*   Vector Calculation Lib
*   author Iriska
*/

/**
*	vector with two dimension
*/
var Vector2 = function(x, y){
	if(isNaN(x) || isNaN(y)){
		throw "wrong type of parameter";
	}
	this.x = x;
	this.y = y;

	this.plus = function(vec){
		if(vec instanceof Vector2){
			this.x += vec.x;
			this.y += vec.y;
		}else{
			throw "wrong type of parameter";
		}
	}

	this.minus = function(vec){
		if(vec instanceof Vector2){
			this.x -= vec.x;
			this.y -= vec.y;
		}else{
			throw "wrong type of parameter";
		}
	}

	this.negative = function(){
		this.x = - this.x;
		this.y = - this.y;
	}

	this.multiply = function(mul){
		if(!isNaN(mul)){
			this.x *= mul;
			this.y *= mul;
		}else{
			throw "wrong type of parameter";
		}
	}

	this.divide = function(div){
		if(!isNaN(div) && div != 0){
			this.x /= div;
			this.y /= div;
		}else if(div == 0){
			throw "division by zero";
		}else{
			throw "wrong type of parameter";
		}
	}

	this.normalize = function(){
		if(this.x == 0 && this.y == 0){
			throw "try to normalize (0, 0)";
		}else{
			var length = this.modulus()
			this.x /= length;
			this.y /= length;
		}
	}

	this.modulus = function(){
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}
}


Vector2.plus = function(vec0, vec1){
	if(vec0 instanceof Vector2 && vec1 instanceof Vector2){
		return new Vector2(vec0.x + vec1.x, vec0.y + vec1.y);
	}else{
		throw "wrong type of parameter";
	}
}

Vector2.minus = function(vec0, vec1){
	if(vec0 instanceof Vector2 && vec1 instanceof Vector2){
		return new Vector2(vec0.x - vec1.x, vec0.y - vec1.y)
	}else{
		throw "wrong type of parameter";
	}
}

Vector2.negative = function(vec0){
	if(vec0 instanceof Vector2){
		return new Vector2(-vec0.x, -vec0.y);
	}else{
		throw "wrong type of parameter";
	}
}

Vector2.multiply = function(mul, vec){
	if(vec instanceof Vector2 && !isNaN(mul)){
		return new Vector2(mul * vec.x, mul * vec.y);
	}else{
		throw "wrong type of parameter";
	}
}

Vector2.divide = function(vec, div){
	if(vec instanceof Vector2 && div != 0 && !isNaN(div)){
		return new Vector2(vec.x / div, vec.y / div);
	}else if(div == 0){
		throw "division by zero";
	}else{
		throw "wrong type of parameter";
	}
}

Vector2.dot = function(vec0, vec1){
	if(vec0 instanceof Vector2 && vec1 instanceof Vector2){
		return vec0.x * vec1.x + vec0.y * vec1.y;
	}else{
		throw "wrong type of parameter";
	}
}

Vector2.normalize = function(vec){
	var length = vec.modulus();
	if(vec instanceof Vector2 && length != 0){
		return new Vector2(vec.x / length, vec.y / length);
	}else if(length == 0){
		throw "try to divide zero vector";
	}else{
		throw "wrong type of parameter";
	}	
}


/**
*	Vector with three dimension
*/

var Vector3 = function(x, y, z){
	if(isNaN(x) || isNaN(y) || isNaN(z)){
		throw "wrong type of parameter";
	}
	this.x = x;
	this.y = y;
	this.z = z;

	this.plus = function(vec){
		if(vec instanceof Vector3){
			this.x += vec.x;
			this.y += vec.y;
			this.z += vec.z;
		}else{
			throw "wrong type of parameter";
		}
	}

	this.minus = function(vec){
		if(vec instanceof Vector3){
			this.x -= vec.x;
			this.y -= vec.y;
			this.z -= vec.z;
		}else{
			throw "wrong type of parameter";
		}
	}

	this.negative = function(){
		this.x = - this.x;
		this.y = - this.y;
		this.z = - this.z;
	}

	this.multiply = function(mul){
		this.x *= mul;
		this.y *= mul;
		this.z *= mul;
	}

	this.divide = function(div){
		if(div != 0 && !isNaN(div)){
			this.x /= div;
			this.y /= div;
			this.z /= div;
		}else if(div == 0){
			throw "division by zero";
		}else{
			throw "wrong type of parameter";
		}
	}

	this.normalize = function(){
		var length = this.modulus();
		if(length != 0){
			this.x /= length;
			this.y /= length;
			this.z /= length;
		}else{
			throw "try to divide zero vector";
		}
	}

	this.modulus = function(){
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
	}
}

Vector3.plus = function(vec0, vec1){
	if(vec0 instanceof Vector3 && vec1 instanceof Vector3){
		return new Vector3(vec0.x + vec1.x, vec0.y + vec1.y, vec0.z + vec1.z);
	}else{
		throw "wrong type of parameter";
	}
}

Vector3.minus = function(vec0, vec1){
	if(vec0 instanceof Vector3 && vec1 instanceof Vector3){
		return new Vector3(vec0.x - vec1.x, vec0.y - vec1.y, vec0.z - vec1.z);
	}else{
		throw "wrong type of parameter";
	}
}

Vector3.negative = function(vec0){
	if(vec0 instanceof Vector3){
		return new Vector3(-vec0.x, -vec0.y, -vec0.z);
	}else{
		throw "wrong type of parameter";
	}
}

Vector3.multiply = function(mul, vec){
	if(vec instanceof Vector3 && !isNaN(mul)){
		return new Vector3(mul * vec.x, mul * vec.y, mul * vec.z);
	}else{
		throw "wrong type of parameter";
	}
}

Vector3.divide = function(vec, div){
	if(vec instanceof Vector3 && div != 0 && !isNaN(div)){
		return new Vector3(vec.x / div, vec.y / div, vec.z / div);
	}else if(div == 0){
		throw "division by zero";
	}else{
		throw "wrong type of parameter";
	}
}

Vector3.dot = function(vec0, vec1){
	if(vec0 instanceof Vector3 && vec1 instanceof Vector3){
		return vec0.x * vec1.x + vec0.y * vec1.y + vec0.z * vec1.z;
	}else{
		throw "wrong type of parameter";
	}
}

Vector3.normalize = function(vec){
	var length = vec.modulus();
	if(vec instanceof Vector3 && length != 0){
		return new Vector3(vec.x / length, vec.y / length, vec.z / length);
	}else if(length == 0){
		throw "try to divide zero vector";
	}else{
		throw "wrong type of parameter";
	}
}

Vector3.cross = function(vec0, vec1){
	if(vec0 instanceof Vector3 && vec1 instanceof Vector3){
		var x = vec0.y * vec1.z - vec0.z * vec1.y;
		var y = vec0.z * vec1.x - vec0.x * vec1.z;
		var z = vec0.x * vec1.y - vec0.y * vec1.x;
		return new Vector3(x, y, z);
	}else{
		throw "wrong type of parameter";
	}
}