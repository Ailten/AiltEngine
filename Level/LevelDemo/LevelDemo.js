
//level demo.

const LevelDemo = {

    //instantie entities of level (call when level is activated).
    loadEntity: function() {
		
		this.player = PlayerDemo.init( //init an entity player.
			Vector.init(0, 0), //pos.
			this.name //nameLevel.
		);
		
		PlayerDemo.init( //init an entity player.
			Vector.init(200, 0), //pos.
			this.name //nameLevel.
		);
		
		Camera.setFollowedEntity(this.player); //set an entity to follow with camera.
		
	},
	
	player: null, //stock entity player in level for axes easily on updateLevel.
	
	//update of level.
	updateLevel: function() {
		
		//player walk.
		let vectorUserWalk = Vector.init(
			(Input.isDown('ArrowLeft')? -1: 0) + (Input.isDown('ArrowRight')? 1: 0),
			(Input.isDown('ArrowUp')? 1: 0) + (Input.isDown('ArrowDown')? -1: 0)
		);
		if(!Vector.equals(vectorUserWalk, Vector.init(0, 0))){
			vectorUserWalk = Vector.normalize(vectorUserWalk);
			vectorUserWalk = Vector.multiplyNum(vectorUserWalk, 6); //speed walk.
			
			Colide.tryMove(this.player, Vector.multiply(vectorUserWalk, Vector.init(1, 0))); //try move if no colide (both axes splite, for more smooth).
			Colide.tryMove(this.player, Vector.multiply(vectorUserWalk, Vector.init(0, 1)));
		}
		
		//player rotate in front of mouse.
		let vectorUserToMouse = Vector.substract(Mouse.entityMouse.pos, this.player.pos);
		this.player.rotate = Vector.castVectorToAngle(vectorUserToMouse);
		
	},
	
	//clean value in level.
	cleanLevel: function() {
		
		this.player = null; //clean entity stock in level.
		
	}

};