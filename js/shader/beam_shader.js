beam_shader = {
	shader_name: "beam_shader",
	uniform_list: {
		uShininess: { type: "f", value: 5.0 },
		uRadius: { type: "f", value: 1.0 },
		uColor: { type: "v4", value: new THREE.Vector4( 1.3, 2.5, 5.8, 1.2 ) }

	},
	vx_shader: "\n\
		varying vec3 vertex;\n\
		void main(void){\n\
			vertex = position;\n\
			//gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);\n\
			vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n\
			gl_Position = projectionMatrix * mvPosition;\n\
		}\
	",
	fg_shader: "\n\
		#ifdef GL_ES\n\
		precision highp float;\n\
		#endif\n\
		uniform float uShininess;\n\
		uniform float uRadius;\n\
		uniform vec4 uColor;\n\
		varying vec3 vertex;\n\
		void main(void){\n\
			float rate;\n\
			float alphaTerm;\n\
			rate = 1.0 - sqrt(pow(vertex.z, 2.0) + pow(vertex.y, 2.0)) / uRadius;\n\
			alphaTerm = pow(rate, uShininess);\n\
			vec4 finalColor = uColor * alphaTerm;\n\
			gl_FragColor = finalColor;\n\
		}\
	"
};
