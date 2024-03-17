
//manage camera.

const Camera = {

    pos: Vector.init(), //position of camera.
	
	followedEntity: null, //the entity followed by camera.
	speedLerp: 0.05, //speed lerp camera to followed entity.
	
	zoom: 1, //can zoom the sceen.
	rotate: 0, //can rotate the sceen.
	
	//action to follow the entity.
	followEntity: function(){
		
		if(this.followedEntity == null)
			return;
		
		this.pos = Vector.lerp(
		    this.pos,
			this.followedEntity.pos,
			this.speedLerp
		);
		
		this.pos = Vector.floor(this.pos);
		
	},
	
	//set an entity to follow.
	setFollowedEntity: function(followedEntity) {
		this.followedEntity = followedEntity;
	},
	
	//focus instantly on the target follow.
	followFocus: function() {
		
		this.pos = Vector.initFrom(this.followedEntity.pos);
		
	},

};