var ParticleGenerator = function(vel, direction, max_particles, life_time, movement_controller){
	var particle_velocity = vel;
	var generator_dir = direction;
	var max_particle_num = max_particles;
	var life_time = life_time;
	var particle_movement_controller = movement_controller;
	var launched_buffer = [];
	var ready_for_launch_buffer = [];
	var recycle_frequency = life_time / max_particle_num;

	var ticker = null;

	function init(){
		return {
			pre_generate_particles: function(){
				for(var i = 0; i < max_particle_num; ++i){
					ready_for_launch_buffer.push(/*new particle*/);
				}
			},
			launch_particle: function(){
				var particle = ready_for_launch_buffer.pop();
				particle.born();
				launched_buffer.push(particle);
			},
			recycle_particle: function(){
				var particle = launched_buffer.shift();
				particle.dead();
				ready_for_launch_buffer.push(particle);
			},
			pre_proccess: function(){
				//should run once before the WebGl app start render loop
			},
			update: function(){
				//should run once per frame
			}
		};
	};

	return init();

};