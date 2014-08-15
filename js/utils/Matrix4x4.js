/**
*	Matrix Structure
*	[
*		m0, m4, m8,  m12,
*		m1,	m5, m9,  m13,
*		m2, m6, m10, m14,
*		m3, m7, m11, m15
*	]
*
*/


var Matrix4x4 = function(){

}


Matrix4x4.create = function(){
	var m = Array(16);
	for(var i = 0; i < 16; ++i){
		m[i] = 0;
	}
	return m;
}

Matrix4x4.identity = function(m){
	for(var i = 0; i < 16; ++i){
		if(i%5 == 0){
			m[i] = 1.0;
		}else{
			m[i] = 0.0;
		}
	}
}

Matrix4x4.create_identity = function(){
	var mat4x4 = [];
	for(var i = 0; i < 16; ++i){
		if(i%5 == 0){
			mat4x4.push(1.0);
		}else{
			mat4x4.push(0.0);
		}
	}
}

Matrix4x4.multiply = function(para1, para2){
	var m = Matrix4x4.create();
	if(para1 instanceof Array && para2 instanceof Vector3){
		//return an vector
	}else if(para1 instanceof Vector3 && para2 instanceof Array){
		//return an vector
	}else if(para1 instanceof Array && para2 instanceof Array){
		if(para1.length == 16 && para2.length == 16){
			var row, col;
			for(var i = 0; i < 16; ++i){
				row = i % 4;
				col = Math.floor(i/4);
				for(var j = 0; j < 4; ++j){
					m[i] += para1[row+j*4] * para2[col*4+j];
				}
			}
			return m;
		}else{

		}
	}else{
		throw "Wrong parameter!";
	}
}