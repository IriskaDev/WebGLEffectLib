
var BeamGeometry = (function (){

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

	return function (radius, length){
		THREE.Geometry.call(this);

		var modelData = genBeam(radius, length);

		for ( var i = 0; i < modelData.length; ++i ){
			var partial = new THREE.Geometry();
			for( var j = 0; j < modelData[i]["vertices"].length; ++j ){
				partial.vertices.push(modelData[i]["vertices"][j]);
			}
			for( var j = 0; j < modelData[i]["index"].length; ++j ){
				partial.faces.push(modelData[i]["index"][j]);
			}
			this.merge( partial );
		}

	}
})();

BeamGeometry.prototype = Object.create( THREE.Geometry.prototype );