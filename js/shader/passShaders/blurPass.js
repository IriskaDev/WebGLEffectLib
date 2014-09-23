THREE.GLEffectLib.Shaders.BlurPass = {
	shader_name: "blurPass",
	uniform_list: {
		tDiffuse: { type: "t", value: null },
		noiseMap: { type: "t", value: null }
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
		uniform sampler2D noiseMap;\n\
		\n\
		varying vec2 vUv;\n\
		void main(void) { \n\
			
		}\
	"
};