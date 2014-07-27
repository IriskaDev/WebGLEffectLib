function genBeam(radius, length){
	var beam = new Array();
	var vertexPositionData = new Array();
	var normalData = new Array();
	var textureCoordData = new Array();
	var indexData = new Array();
	
	for (var i = 0; i < 8; i ++){
		var angle = Math.PI / 4.0 * i;
		var z = Math.cos(angle) * radius;
		var y = Math.sin(angle) * radius;
		var x = length / 2.0;

		vertexPositionData.push(x, y, z);
		textureCoordData.push(0, 0);
		vertexPositionData.push(-x, y, z);
		textureCoordData.push(0, 1);
		vertexPositionData.push(-x, 0, 0);
		textureCoordData.push(1, 1);
		vertexPositionData.push(x, 0, 0);
		textureCoordData.push(1, 0);

		indexData.push(0, 1, 2);
		indexData.push(2, 1, 0);
		indexData.push(0, 2, 3);
		indexData.push(3, 2, 0);


		beam.push(new Object());
		beam[i]["vertices"] = vertexPositionData;
		beam[i]["normal"] = normalData;
		beam[i]["texture"] = textureCoordData;
		beam[i]["index"] = indexData;

		vertexPositionData = new Array();
		normalData = new Array();
		textureCoordData = new Array();
		indexData = new Array();
	}

	return beam;
}

function Beam(gl, prg, radius, length){
	this.len = length;
	this.originStartPoint = [-length/2.0, 0.0, 0.0, 1.0];
	this.startPoint = [-length/2.0, 0.0, 0.0, 1.0];
	this.radius = radius;
	this.originUp = [0.0, 1.0, 0.0, 0.0];
	this.up = [0.0, 1.0, 0.0, 0.0];
	this.originRight = [0.0, 0.0, 1.0, 0.0];
	this.right = [0.0, 0.0, 1.0, 0.0];
	this.shininess = 7.5;
	this.color = [1.3, 2.5, 5.8, 1.4];

	this.gl = gl;
	this.prg = prg;
	this.texture = null;
	this.textureData = new Image();
	this.mvMatrix = mat4.create();
	this.mMatrix = mat4.create();
	this.modelData = genBeam(radius, length);

	this.initTexture = function(src){
		this.textureData.src = src;
		this.texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, this.texture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.textureData);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.bindTexture(gl.TEXTURE_2D, null);
	}

	this.config_prg = function(){
		gl.uniform1f(prg.uShininess, this.shininess);
		gl.uniform1f(prg.uRadius, this.radius);
		gl.uniform4fv(prg.uColor, this.color);
	}

	this.set_shininess = function(shininess){
		this.shininess = shininess;
	}

	this.set_color = function(color){
		this.color = color;
	}

	this.init_mmatrix = function(){
		this.mMatrix = mat4.create();
		this.mMatrix[0] = 1.0;
		this.mMatrix[5] = 1.0;
		this.mMatrix[10] = 1.0;
		this.mMatrix[15] = 1.0;
	}

	this.initBuffers = function(){
		for (var i = 0; i < this.modelData.length; i ++){
			this.modelData[i]["vertexBuffer"] = gl.createBuffer();
			this.modelData[i]["indexBuffer"] = gl.createBuffer();

			gl.bindBuffer(gl.ARRAY_BUFFER, this.modelData[i]["vertexBuffer"]);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.modelData[i]["vertices"]), gl.STATIC_DRAW);

			gl.bindBuffer(gl.ARRAY_BUFFER, null);

			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.modelData[i]["indexBuffer"]);
			gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.modelData[i]["index"]), gl.STATIC_DRAW);
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
		}
	}

	this.draw = function (transforms, camera){
		gl.enableVertexAttribArray(this.prg.aVertexPosition);

		var drawingSequence = [];
		

		//calculate the value that needed in determining the condition's value
		var vectorSC = vectorMinus(camera.position, this.startPoint.slice(0, 3));
		var modSC = vectorModuls(vectorSC);
		var cosPIDiv4 = Math.sqrt(2)/2.0;
		//transfer the camera's vectex to the axis we build up there
		//beamCoordX is the axis z 's value
		var beamCoordX = modSC * dotProduct(vectorSC, this.right.slice(0, 3));
		var beamCoordY = modSC * dotProduct(vectorSC, this.up.slice(0, 3));
		var modPrVecSc = Math.sqrt(beamCoordX*beamCoordX+beamCoordY*beamCoordY);
		var cosVecSc = beamCoordX / modPrVecSc;
		var condition;
		//according the values that calculated above to detemine condition's value
		if(beamCoordY > 0){
			if(cosVecSc >= cosPIDiv4) condition = 0;
			else if(cosVecSc < cosPIDiv4 && cosVecSc >= 0) condition = 1;
			else if(cosVecSc < 0 && cosVecSc >= -cosPIDiv4) condition = 2;
			else condition = 3;
		}else{
			if(cosVecSc < -cosPIDiv4) condition = 4;
			else if(cosVecSc >= -cosPIDiv4 && cosVecSc < 0) condition = 5;
			else if(cosVecSc >= 0 && cosVecSc < cosPIDiv4) condition = 6;
			else condition = 7;
		}

		//according condition's value to decide what drawing sequence should be;
		switch(condition){
			case 0: drawingSequence = [4, 3, 2, 1, 5, 6, 7, 0]; break;
			case 1: drawingSequence = [5, 4, 3, 2, 6, 7, 0, 1]; break;
			case 2: drawingSequence = [6, 5, 4, 3, 7, 0, 1, 2]; break;
			case 3: drawingSequence = [7, 6, 5, 4, 0, 1, 2, 3]; break;
			case 4: drawingSequence = [0, 7, 6, 5, 1, 2, 3, 4]; break;
			case 5: drawingSequence = [1, 0, 7, 6, 2, 3, 4, 5]; break;
			case 6: drawingSequence = [2, 1, 0, 7, 3, 4, 5, 6]; break;
			case 7: drawingSequence = [3, 2, 1, 0, 4, 5, 6, 7]; break;
			default: break;
		}

		//draw them
		for(var i = 0; i < this.modelData.length; i ++){
			gl.bindBuffer(gl.ARRAY_BUFFER, this.modelData[drawingSequence[i]]["vertexBuffer"]);
			gl.vertexAttribPointer(this.prg.aVertexPosition, 3, gl.FLOAT, false, 0, 0);
		
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.modelData[drawingSequence[i]]["indexBuffer"]);
			gl.drawElements(gl.TRIANGLES, this.modelData[drawingSequence[i]]["index"].length, gl.UNSIGNED_SHORT, 0);
		}
		gl.bindBuffer(gl.ARRAY_BUFFER, null);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

	}

	this.translate = function(dest){
		mat4.translate(this.mvMatrix, dest);
	}
	
	this.rotate = function(angle, rot){
		mat4.rotate(this.mvMatrix, angle, rot);
		mat4.rotate(this.mMatrix, angel, rot);
	}
	
	this.set_position = function(transforms, target_pos){
		this.currentPosition = target_pos;
		transforms.calculateModelView();
		transforms.push();
		mat4.translate(transforms.mvMatrix, target_pos);
		mat4.translate(this.mMatrix, target_pos);
		transforms.setMatrixUniforms(gl, this.prg);
		transforms.pop();
	}

	this.arr_cpy = function(input_arr){
		var tmp_ret_arr = new Array();
		for(var i = 0; i < input_arr.length; ++i){
			tmp_ret_arr.push(input_arr[i]);
		}
		return tmp_ret_arr;
	}

	this.apply_model_transform = function(){
		this.startPoint = mat4.multiplyVec4(this.mMatrix, this.arr_cpy(this.originStartPoint));
		this.up = mat4.multiplyVec4(this.mMatrix, this.arr_cpy(this.originUp));
		this.right = mat4.multiplyVec4(this.mMatrix, this.arr_cpy(this.originRight));
	}
}
