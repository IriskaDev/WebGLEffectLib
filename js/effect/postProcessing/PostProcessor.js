var PostProcessor = (function (){



	return function( renderer, renderTarget ){

		//private 


		//public
	
		this.renderer = renderer;
		this.camera;
		this.targetCanvas;
		this.scene;

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
		this.renderTarget2 = renderTarget;

		this.inputBuffer = this.renderTarget1;
		this.outputBuffer = this.renderTarget2;

		this.post_processors = [];

		if ( THREE.CopyShader === undefined )
			console.error( "THREE.EffectComposer relies on THREE.CopyShader" );

		this.copyPss = new THREE.ShaderPass( THREE.CopyShader );


	};



	this.swapBuffers = function () {

		var tmpBuffer = this.inputBuffer;
		this.inputBuffer = this.outputBuffer;
		this.outputBuffer = tmpBuffer;

	};


	this.initProcessors = function() {

	};


	this.reset = function ( renderTarget ) {

		if ( renderTarget === undefined ){
			renderTarget = this.renderTarget1.clone( );

			renderTarget.width = window.innerWidth;
			renderTarget.height = window.innerHeight;
		}

		this.renderTarget1 = renderTarget;
		this.renderTarget2 = renderTarget.clone( );

		this.inputBuffer = this.renderTarget1;
		this.outputBuffer = this.renderTarget2;

	};


	this.render = function ( scene, camera, renderToScreen, forceClear ) {

		this.renderer.render( scene, camera, renderTarget, forceClear );

	};

	
})();



PostProcessor.prototype = {
	constructor: PostProcessor,
}