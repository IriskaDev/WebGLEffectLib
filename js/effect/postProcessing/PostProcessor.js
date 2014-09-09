var PostProcessor = (function (){



	return function( renderer, renderTarget ){

		//private 


		//public
	
		this.renderer = renderer;
		this.camera = new THREE.OrthographicCamera( -1, 1, 1, -1, 0, 1 );
		this.scene = new THREE.Scene();
		this.artbord = new THREE.Mesh( new THREE.PlaneGeometry( 2, 2 ), null );
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
		this.renderTarget2 = renderTarget;

		this.inputBuffer = this.renderTarget1;
		this.outputBuffer = this.renderTarget2;

		this.post_processors = [];

		if ( THREE.CopyShader === undefined )
			console.error( "THREE.EffectComposer relies on THREE.CopyShader" );

		this.copyPss = new THREE.ShaderPass( THREE.CopyShader );


	};

	
})();



PostProcessor.prototype = {
	constructor: PostProcessor,

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

	render: function ( scene, camera, forceClear, inputBuffer, outputBuffer ) {

		var newTime = (new Date()).valueOf();
		var delta_time = newTime - this.currentTime;
		this.currentTime = newTime;

		this.renderer.render( scene, camera, this.inputBuffer, forceClear );

		for (var i = 0; i < this.post_processors.length; ++i){
			this.post_processors[i].uniforms[ "tDiffuse" ].value = this.inputBuffer;

			if( this.post_processors[i].uniforms[ "delta_time" ] !== undefined )
				this.post_processors[i].uniforms[ "delta_time" ].value = delta_time;

			this.artbord.material = this.post_processors[i];
			this.renderer.render( this.scene, this.camera, this.outputBuffer, forceClear );

			if( i != this.post_processors.length - 1 )
				this.swapBuffers();
			else
				if( this.renderToScreen )
					this.renderer.render( this.scene, this.camera );
		}	

	},

	addProcessor: function ( shader ) {
		this.post_processors.push( shader );
	},

	swapBuffers: function () {

		var tmpBuffer = this.inputBuffer;
		this.inputBuffer = this.outputBuffer;
		this.outputBuffer = tmpBuffer;

	}
}