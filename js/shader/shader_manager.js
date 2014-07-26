var ShaderManager = (function() {
	var instance;
	var shader_instance_dict = {};

	function init_program(gl, prg_def){
		var vs_shader = gl.createShader(gl.VERTEX_SHADER);
		var fg_shader = gl.createShader(gl.FRAGMENT_SHADER);
		gl.shaderSource(vs_shader, prg_def["vs_shader"]);
		gl.shaderSource(fg_shader, prg_def["fg_shader"]);
		gl.compileShader(vs_shader);
		gl.compileShader(fg_shader);
		if(!gl.getShaderParameter(vs_shader, gl.COMPILE_STATUS))
			alert(gl.getShaderInfoLog(vs_shader));
		if(!gl.getShaderParameter(fg_shader, gl.COMPILE_STATUS))
			alert(gl.getShaderInfoLog(fg_shader));
		var prg = gl.createProgram();
		gl.attachShader(prg, vs_shader);
		gl.attachShader(prg, fg_shader);
		gl.linkProgram(prg);
		for (var i = 0; i < prg_def["attr_list"].length; ++i){
			prg[prg_def["attr_list"][i]] = gl.getAttribLocation(prg, prg_def["attr_list"][i]);
		}
		for (var i = 0; i < prg_def["uniform_list"].length; ++i){
			prg[prg_def["uniform_list"][i]] = gl.getUniformLocation(prg, prg_def["uniform_list"][i]);
		}
		return prg;
	}

	function init(){
		return {
			register_shader: function(gl, prg_name, prg_def){
				if(shader_instance_dict.hasOwnProperty(prg_name)){
					throw "program " + prg_name + " is already exist!";
				}else{
					shader_instance_dict[prg_name] = init_program(gl, prg_def)
				}
			},
			unregister_shader: function(gl, prg_name){
				if(shader_instance_dict.hasOwnProperty(prg_name)){
					delete shader_instance_dict[prg_name];
				}
			},
			get_shader_by_name: function(prg_name){
				if(shader_instance_dict.hasOwnProperty(prg_name))
					return shader_instance_dict[prg_name];
				else
					return null;
			}
		};
	};

	return {
		get_instance: function(){
			if(!instance){
				instance = init();
			}
			return instance;
		}
	};
})();


