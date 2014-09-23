THREE.GLEffectLib.PostProcessUnit.BlurUnit = (function (){

	return function (){
		this.material = null
	}

})();


THREE.GLEffectLib.PostProcessUnit.BlurUnit.prototype = {

	configMaterial: function ( delta_time ) {

		return this.material;

	}

}