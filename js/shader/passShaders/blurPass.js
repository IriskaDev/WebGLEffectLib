THREE.GLEffectLib.Shaders.BlurPass = {
	shader_name: "blurPass",
	uniforms: {
		tDiffuse: { type: "t", value: null },
		uResolutionXRec: { type: "f", value: 0 },   // 1.0 / ResolutionX
		uResolutionYRec: { type: "f", value: 0 },	// 1.0 / ResolutionY
		uCountX: { type: "i", value: 7 },
		uCountY: { type: "i", value: 7 }
	},
	vx_shader: "\n\
		varying vec2 vUv;\n\
		void main(void){\n\
			vUv = uv; \n\
			vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n\
			gl_Position = projectionMatrix * mvPosition;\n\
		}\
	",
	fg_shader: "\n\
		#ifdef GL_ES\n\
		precision highp float;\n\
		#endif\n\
		uniform sampler2D tDiffuse;\n\
		uniform float uResolutionXRec;\n\
		uniform float uResolutionYRec;\n\
		uniform int uCountX;\n\
		uniform int uCountY;\n\
		\n\
		varying vec2 vUv;\n\
		\n\
		\n\
		void main(void) { \n\
			vec3 tmpColor = vec3( 0.0, 0.0, 0.0 );\n\
				//for ( float i = vUv.x - uRadius; i < vUv.x + uRadius; i += uResolutionXRec ) { \n\
				//	for ( float j = vUv.y - uRadius; j < vUv.y + uRadius; j += uResolutionYRec ) { \n\
				//		tmpColor += texture2D( tDiffuse, vUv ).rgb;\n\
				//	}\n\
				//}\n\
				for ( int i = 0; i < 64; ++i ) {\n\
					if( i >= uCountX ) {\n\
						break;\n\
					}\n\
					for(int j = 0; j < 64; ++j ) {\n\
						if( j >= uCountY ) {\n\
							break;\n\
						}\n\
						tmpColor += texture2D( tDiffuse, vec2(vUv.x + (float(i) - float(uCountX) / 2.0) * uResolutionXRec, vUv.y + (float(j) - float(uCountY) / 2.0) * uResolutionYRec) ).rgb; \n\
					}\n\
				}\n\
			gl_FragColor = vec4( tmpColor / float(uCountX * uCountY), 1.0 );\n\
		}\
	"
};