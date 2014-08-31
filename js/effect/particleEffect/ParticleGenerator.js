/**
*	parameters{
*		position: THREE.Vector3,  ---default THREE.Vector3( 0, 0, 0 )
*		direction: THREE.Vector3,  ---default THREE.Vector3( 0, 0, 1 )
*		particle: THREE.Sprite,  
*					---default THREE.Sprite( new THREE.SpriteMaterial( { color: 0x66ccff } ) )
*		max_num: Number,  ---default 32
*		life_time: Number,  ---default 30000, millisecond as unit
*		frequency: Number,  ---default 1000, millisecond as unit
*		num_per_shot: Number  ---default 1, launch num_per_shot particles every time;
*		movementController: Function,  ---default
*	}
*	movementController is a Function 
*	which takes an instance of THREE.Sprite and a number as parameter
*
*
*/


var ParticleGenerator = (function(){
	//private

	return function ( params ) {
		//public
		THREE.Object3D.call(this);

		//parameter proccess
		if ( params.position !== undefined || ! params.position instanceof THREE.Vector3 )
			this.position = params.position;
		if ( params.direction === undefined || ! params.direction instanceof THREE.Vector3 )
			this.direction = new THREE.Vector3( 0, 0, 1 );
		else
			this.direction = params.direction;
		if ( params.particle === undefined || ! params.particle instanceof THREE.Sprite )
			this.particle = new THREE.Sprite( new THREE.SpriteMaterial( { color: 0x66ccff } ) );
		else
			this.particle = params.particle;
		if ( params.max_num === undefined || NaN( params.max_num ) )
			this.max_num = 32;
		else
			this.max_num = params.max_num;
		if ( params.life_time === undefined || NaN( params.life_time ) )
			this.life_time = 30000;
		else
			this.life_time = params.life_time;
		if ( params.frequency === undefined || NaN( params.frequency ) )
			this.frequency = 1000;
		else
			this.frequency = params.frequency;
		if( params.num_per_shot === undefined || NaN( params.num_per_shot ) )
			this.num_per_shot = 1;
		else
			this.num_per_shot = params.num_per_shot
		if ( params.movementController !== undefined && params.movementController instanceof Function)
			this.movementController = params.movementController;
		else
			this.movementController = function (target, eplased_time){

			}

		var particle_buffer = new Array(this.max_num);
		var swap_buffer = new Array(this.max_num);

		while(particle_buffer > 0) particle_buffer.pop();

		for(var i = 0; i < this.max_num; ++i){
			swap_buffer[i] = this.particle.clone( );
			swap_buffer[i].life_time = this.life_time;
			swap_buffer[i].born_time = 0;
			this.reset(swap_buffer[i]);
		}


		var cur_time;
		var last_launch_time = 0;
		var is_launching;


		this.init = function(){
			for(var i = 0; i < this.max_num; ++i){
				this.add(swap_buffer[i]);
				swap_buffer[i].visible = false;
			}
		}

		this.reset = function(particle){
			particle.position = this.position.clone( );
		}

		this.start = function(){
			cur_time = (new Date()).valueOf();
			is_launching = true;
		}

		this.update = function(){
			var new_time = (new Date()).valueOf();
			var eplased_time = new_time - cur_time;
			cur_time = new_time;

			for(var i = 0; i < alive_particle_buffer.length; ++i){
				if (cur_time - particle.born_time > particle.life_time) {
					var particle = alive_particle_buffer.shift();
					this.reset(particle);
					particle.visible = false;
					swap_buffer.push(particle);
				}else{
					break;
				}
			}

			if ( is_launching ){
				if ( alive_particle_buffer.length < this.max_num ){
					if( cur_time - last_launch_time > this.frequency ){
						for ( var i = 0; i < this.num_per_shot; ++i ){
							if ( swap_buffer.length > 0 ){
								var particle = swap_buffer.pop();
								particle.visible = true;
								particle.born_time = new_time;
								alive_particle_buffer.push( particle );
								last_launch_time = cur_time;
							} //end if 
						} //end for 
					} //end if 
				} //end if 
			} //end if 

			for ( var i = 0; i < alive_particle_buffer.length; ++i ){
				this.movementController(alive_particle_buffer[i], eplased_time);
			}
		}

		this.stop = function(){
			is_launching = false;
		}

		this.dispose = function(){
			for (var i = 0; i < this.max_num; ++i){
				if(alive_particle_buffer[i] !== undefined){
					alive_particle_buffer[i].material.dispose();
				}
			}
		}
	}
})();

ParticleGenerator.prototype = Object.create( THREE.Object3D.prototype );
