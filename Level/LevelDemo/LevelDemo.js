
//level demo.

const LevelDemo = {

    //instantie entities of level (call when level is activated).
    loadEntity: function() {
		
		BackgroundDemo.init(this.name); //background.
		
		this.player = MobDemo.init( //mob (player).
		    Vector.init(0, 0), 
			'MobWhite', 
			this.name
		);
		this.player['isPlayer'] = true;
		
		Camera.setFollowedEntity(this.player); //follow cam.
		Camera.followFocus(); //focus instantly the follow entity.
		
		this.mob = MobDemo.init( //mob.
		    Vector.init(500, 0), 
			'MobRed', 
			this.name
		);
		
		this.mob.geometryTrigger = [ //add a trigger zone to mob.
		    Circle.init(
			    Vector.init(0, 0),
				300
			)
		];
		this.mob.eventTrigger = function(entityTrigger, entitySolid){ //trigger mob make chassing player.
		
		    if(!entitySolid['isPlayer'])
				return;
			
		    let vectorMouvementMob = Vector.init(
		        entitySolid.pos.x - entityTrigger.pos.x, 
		    	entitySolid.pos.y - entityTrigger.pos.y
		    );
		    vectorMouvementMob = Vector.normalize(vectorMouvementMob);
		    vectorMouvementMob = Vector.multiply(vectorMouvementMob, LevelDemo.mobSpeedWalk);
			
			vectorMouvementMob = Vector.add(entityTrigger.pos, vectorMouvementMob);
			Colide.tryMoveTo(entityTrigger, vectorMouvementMob, 2);
			
		};
		
		let triggerZone = TriggerZoneDemo.init( //trigger zone.
		    Vector.init(-200, 500),
			this.name
		);
		triggerZone.eventTrigger = function(entityTrigger, entitySolide){ //action execute when trigger.
			entitySolide['rotate'] = (entitySolide['rotate'] || 0) + 1;
		}
		
	},
	
	player: null, //entity player.
	playerSpeedWalk: 6, //speed walk for player.
	
	mob: null, //entity mob.
	mobSpeedWalk: 4, //speed walk for mob.
	
	//update of level.
	updateLevel: function() {
		
		//*/ --- player move.
		let vectorMouvementPlayer = Vector.init(
		    (Input.isDown('ArrowRight')? 1: 0)+ //x.
		    (Input.isDown('ArrowLeft')? -1: 0),
		    (Input.isDown('ArrowUp')? 1: 0)+ //y.
		    (Input.isDown('ArrowDown')? -1: 0)
		);
		vectorMouvementPlayer = Vector.normalize(vectorMouvementPlayer);
		vectorMouvementPlayer = Vector.multiply(vectorMouvementPlayer, this.playerSpeedWalk); //apply speed.
		
		vectorMouvementPlayer = Vector.add(this.player.pos, vectorMouvementPlayer);
		if(!Colide.tryColide(this.player, vectorMouvementPlayer)){
		    this.player.pos = vectorMouvementPlayer;
		}
		//*/
		
		//*/ --- active trigger with solid player.
		Colide.executeTrigger(this.player);
		//*/
		
		//*/ --- and player.
		Colide.executeTrigger(this.mob);
		//*/
		
	},
	
	//clean value in level.
	cleanLevel: function() {
		
		this.player = null;
		this.mob = null;
		
		Camera.setFollowedEntity(null);
		
	}

};