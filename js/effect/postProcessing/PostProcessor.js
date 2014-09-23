
THREE.GLEffectLib.PostProcessor = (function (){

	return function( renderer, renderTarget ){

		this.renderer = renderer;
		this.camera = new THREE.OrthographicCamera( -1, 1, 1, -1, 0, 1 );
		this.scene = new THREE.Scene();
		this.quad = new THREE.Mesh( new THREE.PlaneGeometry( 2, 2 ), null );
		this.scene.add(this.quad);
		this.renderToScreen = true;
		this.currentTime = (new Date()).valueOf();

		if ( renderTarget === undefined ){
			var width = window.innerWidth || 1;
			var height = window.innerHeight || 1;
			var parameters = { 
				minFilter: THREE.LinearFilter, 
				magFilter: THREE.LinearFilter, 
				format: THREE.RGBFormat, 
				stencilBuffer: false 
			};

			renderTarget = new THREE.WebGLRenderTarget( width, height, parameters );

		}

		this.renderTarget1 = renderTarget;
		this.renderTarget2 = renderTarget.clone( );

		this.inputBuffer = this.renderTarget1;
		this.outputBuffer = this.renderTarget2;

		this.copyShader = new THREE.ShaderMaterial({
			uniforms: THREE.GLEffectLib.Shaders.CopyPass.uniforms,
			vertexShader: THREE.GLEffectLib.Shaders.CopyPass.vx_shader,
			fragmentShader: THREE.GLEffectLib.Shaders.CopyPass.fg_shader
		});

		this.postProcessors = [];

	};

	
})();



THREE.GLEffectLib.PostProcessor.prototype = {
	constructor: THREE.GLEffectLib.PostProcessor,

	initProessors: function () {

	},

	reset: function ( renderTarget ) {

		if ( renderTarget === undefined ){
			renderTarget = this.renderTarget1.clone( );

			renderTarget.width = window.innerWidth;
			renderTarget.height = window.innerHeight;
		}

		this.renderTarget1 = renderTarget;
		this.renderTarget2 = renderTarget.clone( );

		this.inputBuffer = this.renderTarget1;
		this.outputBuffer = this.renderTarget2;

	},

	render: function ( scene, camera, forceClear ) {

		var newTime = (new Date()).valueOf();
		var delta_time = newTime - this.currentTime;
		this.currentTime = newTime;

		forceClear = (forceClear === undefined ? true: false);

		if ( this.postProcessors.length > 0 ){
			this.renderer.render( scene, camera, this.inputBuffer, forceClear );
		}else{
			this.renderer.render( scene, camera );
		}

		for (var i = 0; i < this.postProcessors.length; ++i){
			if ( this.postProcessors[i] instanceof THREE.ShaderMaterial ){

				this.postProcessors[i].uniforms[ "tDiffuse" ].value = this.inputBuffer;

				if( this.postProcessors[i].uniforms[ "delta_time" ] !== undefined )
					this.postProcessors[i].uniforms[ "delta_time" ].value = delta_time;

				this.quad.material = this.postProcessors[i];

				this.process( i == this.postProcessors.length - 1 );

			} else if ( this.postProcessors[i].configMaterial instanceof Function ) {
				var tmp = this.postProcessors[i].configMaterial( delta_time );
				var last_unit = (i == this.postProcessors.length - 1);
				if ( tmp instanceof Array ) {
					for (var j = 0; j < tmp.length; ++j ){
						tmp[j].uniforms[ "tDiffuse" ].value = this.inputBuffer;
						this.quad.material = tmp[j];

						this.process( last_unit && j == tmp.length - 1 );
					}
				}else{

					tmp.uniforms[ "tDiffuse" ].value = this.inputBuffer;
					this.quad.material = tmp;
					this.process( last_unit );

				}
			}
		}	

	},

	addProcessor: function ( shader ) {
		this.postProcessors.push( shader );
	},

	swapBuffers: function () {

		var tmpBuffer = this.inputBuffer;
		this.inputBuffer = this.outputBuffer;
		this.outputBuffer = tmpBuffer;

	},

	process: function(last_pass) {
		if( !last_pass ){
			this.renderer.render( this.scene, this.camera, this.outputBuffer, forceClear );
			this.swapBuffers();
		}else{
			if( this.renderToScreen ){
				this.renderer.render( this.scene, this.camera );
			}else{
				this.renderer.renderer( this.scene, this.camera, this.outputBuffer, forceClear );
			}
		}
	}
}