/**
*	parameters{
*		scene:  THREE.Scene(),  ---default null, if not null the particle will add to target scene
*		position: THREE.Vector3,  ---default THREE.Vector3( 0, 0, 0 )
*		direction: THREE.Vector3,  ---default THREE.Vector3( 0, 0, 1 )
*		particle: THREE.Sprite,  
*					---default THREE.Sprite( new THREE.SpriteMaterial( { color: 0x66ccff } ) )
*		max_num: Number,  ---default 32
*		life_time: Number,  ---default 30000, millisecond as unit
*		frequency: Number,  ---default 1000, millisecond as unit
*		num_per_shot: Number,  ---default 1, launch num_per_shot particles every time;
*		movementController: Function,  ---default, function(target, eplased_time)
*		reseter: Function,  ---default, function(particle)
*		velocity: Function,  ---default function(){ return new THREE.Vector3( 0, 0, 1 ); }
*	}
*	movementController is a Function 
*	which takes an instance of THREE.Sprite and a number as parameter
*
*
*/


THREE.GLEffectLib.ParticleGenerator = (function(){

	return function ( params ) {
		
		THREE.Object3D.call(this);

		//parameter proccess
		params.scene instanceof THREE.Scene ? this.scene = params.scene: this.scene = null;
		params.position instanceof THREE.Vector3 ? this.position = params.position: this.position = new THREE.Vector3(0, 0, 0);
		params.direction instanceof THREE.Vector3 ? this.direction = params.direction: this.direction = new THREE.Vector3(0, 0, 1);
		params.particle instanceof THREE.Sprite ? this.particle = params.particle: this.particle = new THREE.Sprite(new THREE.SpriteMaterial({color: 0x66ccff}));
		(! isNaN(params.max_num)) ? this.max_num = params.max_num: this.max_num = 32;
		(! isNaN(params.life_time)) ? this.life_time = params.life_time: this.life_time = 30000;
		(! isNaN(params.frequency)) ? this.frequency = params.frequency: this.frequency = 1000;
		(! isNaN(params.num_per_shot)) ? this.num_per_shot = params.num_per_shot: this.num_per_shot = 1;


		if ( params.movementController === undefined || ! params.movementController instanceof Function)
			this.movementController = function ( target, eplased_time ){
				var opacity_reduce_rate = 1.0 / target.life_time;
				target.scale.x += eplased_time * (0.6 / target.life_time);
				target.scale.y += eplased_time * (0.6 / target.life_time);

				target.velocity.add( new THREE.Vector3( 
						-.0025 + 0.005 * Math.random(),
						-.0025 + 0.005 * Math.random(),
						-.0025 + 0.005 * Math.random()
					) );
				target.material.opacity -= opacity_reduce_rate * eplased_time;

				target.material.rotation += eplased_time / 10000 + (-0.001 + 0.002 * Math.random());
				target.position.add( target.velocity.clone( ).multiplyScalar( eplased_time / 1000 ) ); 

			};
		else
			this.movementController = params.movementController;

		if( params.reseter === undefined || ! params.reseter instanceof Function )
			this.reset = function ( particle ) {
				particle.position.set( this.position.x,
									   this.position.y,
									   this.position.z );
				particle.velocity = this.velocity( );
				particle.material.opacity = 1.0;
				particle.scale.x = 0.4;
				particle.scale.y = 0.4;
			};
		else
			this.reset = params.reseter;

		if ( params.velocity === undefined || ! params.velocity instanceof Function )
			this.velocity = function () {
				return new THREE.Vector3( 0, 0.2, 0 );
			};
		else
			this.velocity = params.velocity;
			

		this.particle_buffer = new Array(this.max_num);
		this.swap_buffer = new Array(this.max_num);

		this.cur_time = 0;
		this.last_launch_time = 0;
		this.is_launching = false;
	}; //end return

})();

THREE.GLEffectLib.ParticleGenerator.prototype = Object.create( THREE.Object3D.prototype );


THREE.GLEffectLib.ParticleGenerator.prototype.init = function () {

	while(this.particle_buffer.length > 0) this.particle_buffer.pop();

	for(var i = 0; i < this.max_num; ++i){
		var particle = this.particle.clone( );
		particle.material = this.particle.material.clone( );
		particle.life_time = this.life_time;
		particle.born_time = 0;
		this.swap_buffer[i] = particle;
		this.reset(this.swap_buffer[i]);
	}

	for(var i = 0; i < this.max_num; ++i){
		if ( this.scene !== null ) {
			this.scene.add ( this.swap_buffer[i] );
		} else {
			this.add(this.swap_buffer[i]);
		}
		this.swap_buffer[i].visible = false;
	}

}

THREE.GLEffectLib.ParticleGenerator.prototype.start = function () {
	this.cur_time = (new Date()).valueOf();
	this.is_launching = true;
}

THREE.GLEffectLib.ParticleGenerator.prototype.update = function () {

	var new_time = (new Date()).valueOf();
	var eplased_time = new_time - this.cur_time;
	this.cur_time = new_time;

	for(var i = 0; i < this.particle_buffer.length; ++i){
		if (this.cur_time - this.particle_buffer[i].born_time > this.particle_buffer[i].life_time) {
			var particle = this.particle_buffer.shift();
			//this.reset(particle);
			particle.visible = false;
			this.swap_buffer.push(particle);
		}else{
			break;
		}
	}

	if ( this.is_launching ){
		if ( this.particle_buffer.length < this.max_num ){
			if( this.cur_time - this.last_launch_time > this.frequency ){
				for ( var i = 0; i < this.num_per_shot; ++i ){
					if ( this.swap_buffer.length > 0 ){
						var particle = this.swap_buffer.pop();
						this.reset( particle );
						particle.visible = true;
						particle.born_time = new_time;
						this.particle_buffer.push( particle );
						this.last_launch_time = this.cur_time;
					} //end if 
				} //end for 
			} //end if 
		} //end if 
	} //end if 

	for ( var i = 0; i < this.particle_buffer.length; ++i ){
		this.movementController(this.particle_buffer[i], eplased_time);
	}

}

THREE.GLEffectLib.ParticleGenerator.prototype.stop = function () {
	this.is_launching = false;
}

THREE.GLEffectLib.ParticleGenerator.prototype.dispose = function () {

	for (var i = 0; i < this.particle_buffer.length; ++i){
		if( this.particle_buffer[i] !== undefined ) {
			this.particle_buffer[i].material.dispose();
		}
	}
	for (var i = 0; i < this.swap_buffer.length; ++i) {
		if( this.swap_buffer[i] !== undefined ) {
			this.swap_buffer[i].material.dispose();
		}
	}

}