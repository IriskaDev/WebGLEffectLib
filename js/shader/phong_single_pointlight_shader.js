phong_single_pointlight_shader = {
	shader_name: "phong_single_pointlight_shader",
	attr_list: [
		"aVertexPosition",
		"aVertexNormal",
		"aVertexTextureCoord"
	],
	uniform_list: [
		"uShininess",
		"uLightPosition",
		"uLightAmbient",
		"uLightDiffuse",
		"uLightSpecular",
		"uMaterialAmbient",
		"uMaterialDiffuse",
		"uMaterialSpecular",
		"uMVMatrix",
		"uPMatrix",
		"uNMatrix",
		"uMVMatrixL"
	],
	vs_shader: "\n\
		attribute vec3 aVertexPosition;\n\
		attribute vec3 aVertexNormal;\n\
		attribute vec2 aVertexTextureCoord;\n\
		uniform mat4 uMVMatrix;\n\
		uniform mat4 uPMatrix;\n\
		uniform mat4 uNMatrix;\n\
		uniform vec3 uLightPosition;\n\
		uniform mat4 uMVMatrixL;	//the model-view matrix of light source\n\
		varying vec3 vNormal;\n\
		varying vec3 vEyeVec;\n\
		varying vec2 vTextureCoords;\n\
		varying vec3 vLightRay;\n\
		void main(void) {\n\
		     //Transformed vertex position\n\
		     vec4 vertex = uMVMatrix * vec4(aVertexPosition, 1.0);\n\
		     //Transformed normal position\n\
		     vNormal = vec3(uNMatrix * vec4(aVertexNormal, 1.0));\n\
		     //Vector Eye\n\
		     vEyeVec = -vec3(vertex.xyz);\n\
			 vec4 LightPosition = uMVMatrixL * vec4(uLightPosition, 1.0);\n\
			 vLightRay = vertex.xyz - LightPosition.xyz;\n\
			 vTextureCoords = aVertexTextureCoord;\n\
		     //Final vertex position\n\
		     gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);\n\
		}\
	",
	fg_shader: "\n\
		#ifdef GL_ES\n\
		precision highp float;\n\
		#endif\n\
		uniform float uShininess;        //shininess\n\
		uniform vec4 uLightAmbient;      //light ambient property\n\
		uniform vec4 uLightDiffuse;      //light diffuse property \n\
		uniform vec4 uLightSpecular;     //light specular property\n\
		uniform vec4 uMaterialAmbient;  //object ambient property\n\
		uniform vec4 uMaterialDiffuse;   //object diffuse property\n\
		uniform vec4 uMaterialSpecular;  //object specular property\n\
		uniform sampler2D uSampler;\n\
		varying vec2 vTextureCoords;\n\
		varying vec3 vNormal;\n\
		varying vec3 vEyeVec;\n\
		varying vec3 vLightRay;\n\
		void main(void){\n\
		     vec3 L = normalize(vLightRay);\n\
		     vec3 N = normalize(vNormal);\n\
    	     //Lambert's cosine law\n\
		     float lambertTerm = dot(N,-L);\n\
    	     //Ambient Term\n\
		     vec4 Ia = uLightAmbient * texture2D(uSampler, vTextureCoords);\n\
    	     //Diffuse Term\n\
		     vec4 Id = vec4(0.0,0.0,0.0,1.0);\n\
    	     //Specular Term\n\
		     vec4 Is = vec4(0.0,0.0,0.0,1.0);\n\
		     //if(lambertTerm >= 0.0) {\n\
		    	Id = texture2D(uSampler, vTextureCoords) * lambertTerm; //add diffuse term\n\
    	    	vec3 E = normalize(vEyeVec);\n\
		    	vec3 R = reflect(L, N);\n\
		     	float specular = pow(max(dot(R, E), 0.0), uShininess);\n\
		     	Is = uLightSpecular * texture2D(uSampler, vTextureCoords) * specular; //add specular term \n\
		     //}\n\
 		     //Final color\n\
		     vec4 finalColor = Ia + Id + Is;\n\
			 if (finalColor.x < Ia.x || finalColor.y < Ia.y || finalColor.z < Ia.z){\n\
			 	finalColor = Ia;\n\
			 }\n\
		     finalColor.a = 1.0;\n\
		     gl_FragColor = finalColor;\n\
		 }\
	"
};