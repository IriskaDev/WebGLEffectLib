
var BeamMesh = (function (){

	var genBeam = function (radius, length){
		var beam = new Array();
		var vertexPositionData = new Array();
		var normalData = new Array();
		var textureCoordData = new Array();
		var indexData = new Array();
	
		for (var i = 0; i < 8; i ++){
			var angle = Math.PI / 4.0 * i;
			var z = Math.cos(angle) * radius;
			var y = Math.sin(angle) * radius;
			var x = length;

			vertexPositionData.push( new THREE.Vector3(x, y, z) );
			textureCoordData.push(0, 0);
			vertexPositionData.push( new THREE.Vector3(0, y, z) );
			textureCoordData.push(0, 1);
			vertexPositionData.push( new THREE.Vector3(0, 0, 0) );
			textureCoordData.push(1, 1);
			vertexPositionData.push( new THREE.Vector3(x, 0, 0) );
			textureCoordData.push(1, 0);

			indexData.push( new THREE.Face3(0, 1, 2) );
			indexData.push( new THREE.Face3(2, 1, 0) );
			indexData.push( new THREE.Face3(0, 2, 3) );
			indexData.push( new THREE.Face3(3, 2, 0) );


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

	return function (radius, length, material, camera){
		THREE.Object3D.call(this);

		this.cameraPtr = camera;
		this.oriUp = new THREE.Vector4( 0.0, 1.0, 0.0, 0.0 );
		this.oriRight = new THREE.Vector4( 0.0, 0.0, 1.0, 0.0 );

		var modelData = genBeam(radius, length);

		for ( var i = 0; i < modelData.length; ++i ){
			var partial = new THREE.Geometry();
			for( var j = 0; j < modelData[i]["vertices"].length; ++j ){
				partial.vertices.push(modelData[i]["vertices"][j]);
			}
			for( var j = 0; j < modelData[i]["index"].length; ++j ){
				partial.faces.push(modelData[i]["index"][j]);
			}
			if( material == undefined ){
				this.add( new THREE.Mesh(partial) );
			}else{
				this.add( new THREE.Mesh(partial, material) );
			}
		}

		for(var i = 0; i < this.children.length; ++i){
			console.log(this.children[i].geometry.vertices[0]);
		}


		this.renderDepthUpdate = function ( ) {
			var upCpy = this.oriUp.clone( );
			upCpy.applyMatrix4( this.matrix );
			var rightCpy = this.oriRight.clone( );
			rightCpy.applyMatrix4( this.matrix );
			var drawingSequence;


			//calculate the value that needed in determining the condition's value
			var vectorSC = this.cameraPtr.position.sub( this.position );
			var modSC = vectorSC.length( );
			var cosPIDiv4 = Math.sqrt( 2 ) / 2.0;

			//transfer the camera's vectex to the axis we build up there
			//beamCoordX is the axis z 's value
			var beamCoordX = modSC * vectorSC.dot( rightCpy );
			var beamCoordY = modSC * vectorSC.dot( upCpy );
			var modPrVecSc = Math.sqrt( beamCoordX * beamCoordX + beamCoordY * beamCoordY );
			var cosVecSc = beamCoordX / modPrVecSc;
			var condition;

			//according the values that calculated above to detemine condition's value
			if( beamCoordY > 0 ) {
				if( cosVecSc >= cosPIDiv4 ) condition = 0;
				else if( cosVecSc < cosPIDiv4 && cosVecSc >= 0 ) condition = 1;
				else if( cosVecSc < 0 && cosVecSc >= -cosPIDiv4 ) condition = 2;
				else condition = 3;
			}else{
				if( cosVecSc < -cosPIDiv4 ) condition = 4;
				else if( cosVecSc >= -cosPIDiv4 && cosVecSc < 0 ) condition = 5;
				else if( cosVecSc >= 0 && cosVecSc < cosPIDiv4 ) condition = 6;
				else condition = 7;
			}


			//according condition's value to decide what drawing sequence should be;
			switch( condition ){
				case 0: drawingSequence = [4, 3, 5, 6, 2, 7, 1, 0]; break;
				case 1: drawingSequence = [5, 4, 3, 2, 6, 7, 0, 1]; break;
				case 2: drawingSequence = [6, 5, 4, 3, 7, 0, 1, 2]; break;
				case 3: drawingSequence = [7, 6, 5, 4, 0, 1, 2, 3]; break;
				case 4: drawingSequence = [0, 7, 6, 5, 1, 2, 3, 4]; break;
				case 5: drawingSequence = [1, 0, 7, 6, 2, 3, 4, 5]; break;
				case 6: drawingSequence = [3, 2, 4, 1, 5, 0, 6, 7]; break;
				case 7: drawingSequence = [4, 3, 5, 6, 2, 7, 1, 0]; break;
				default: break;
			}


			//set partial's depth value
			var depthVal = 9;
			for (var i = 0; i < this.children.length; ++i, --depthVal){
				this.children[drawingSequence[i]].renderDepth = depthVal;
			}

		}
	}
})();

BeamMesh.prototype = Object.create( THREE.Object3D.prototype );