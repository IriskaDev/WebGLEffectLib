THREE.GLEffectLib.PostProcessUnit.BlurUnit = (function (){

	return function (blurLev, resolutionX, resolutionY){
		this.material = new THREE.ShaderMaterial({
			uniforms: THREE.GLEffectLib.Shaders.BlurPass.uniforms,
			vertexShader: THREE.GLEffectLib.Shaders.BlurPass.vx_shader,
			fragmentShader: THREE.GLEffectLib.Shaders.BlurPass.fg_shader
		});

		this.blurLev = blurLev;

		this.material.uniforms["uResolutionXRec"].value = (resolutionX === undefined ? 1.0 / window.width: 1.0 / resolutionX);
		this.material.uniforms["uResolutionYRec"].value = (resolutionY === undefined ? 1.0 / window.height: 1.0 / resolutionY);
		this.material.uniforms["uCountX"].value = this.blurLev * 2 + 1;
		this.material.uniforms["uCountY"].value = this.blurLev * 2 + 1;
	}

})();


THREE.GLEffectLib.PostProcessUnit.BlurUnit.prototype = {

	configMaterial: function ( delta_time ) {

		//return this.blurArr;
		return this.material;

	}

}