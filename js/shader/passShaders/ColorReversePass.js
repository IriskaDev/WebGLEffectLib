THREE.GLEffectLib.Shaders.ColorReversePass = {
	shader_name: "color_reverse_pass",
	uniforms: {
		tDiffuse: { type: "t", value: null }
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
		\n\
		varying vec2 vUv;\n\
		void main(void) { \n\
			vec4 tColor = texture2D( tDiffuse, vUv ); \n\
			float r = 1.0 - tColor.r; \n\
			float g = 1.0 - tColor.g; \n\
			float b = 1.0 - tColor.b; \n\
			float a = tColor.a; \n\
			gl_FragColor = vec4(r, g, b, a);\n\
		}\
	"
};