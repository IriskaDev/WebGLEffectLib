beam_shader = {
	shader_name: "beam_shader",
	attr_list: ["aVertexPosition"],
	uniform_list: [
		"uShininess",
		"uMVMatrix",
		"uPMatrix",
		"uNMatrix",
		"uRadius",
		"uColor"
	],
	vs_shader: "\n\
		attribute vec3 aVertexPosition;\n\
		uniform mat4 uMVMatrix;\n\
		uniform mat4 uPMatrix;\n\
		uniform mat4 uNMatrix;\n\
		varying vec3 vertex;\n\
		void main(void){\n\
			vertex = aVertexPosition;\n\
			gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);\n\
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
}
