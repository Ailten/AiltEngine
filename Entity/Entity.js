
//manage all entities.

const Entity = {
	
	entities: [], //array of all entities for the game.
	
	//push an entity in liste of entity.
	addEntity: function(newEntity, levelName=null) {
		
		if(Array.isArray(newEntity)){
			newEntity.forEach((e) => {
				Entity.addEntity(e, levelName);
			});
			return;
		}
		
		newEntity['isActive'] = true; //set an id to the new entity.
		newEntity['id'] = this.entities.length; //set an id to the new entity.
		newEntity['idLevel'] = Level.findLevel(levelName)?.id; //set id of the level.
		
		if(newEntity['uniqueSprite'] && newEntity['manySprite']) //if has no sprite, tag "noSprite" (for skip draw).
			newEntity['noSprite'];
		
		this.entities.push(newEntity);
		
	},
	
	//sort all entity by zIndex.
	sortZIndex: function() {
		this.entities = this.entities.sort((a, b) => b.zIndex - a.zIndex);
	},
	
	entitiesFollowCam: function(){
		for(let i=0; i<Entity.entities.length; i++){
			if(!Entity.entities[i]['followCam']) //skip entity not followCam.
				continue;
			if(!Entity.entities[i]['posFollowCamLastUpdate']){ //fix the pos first update.
				Entity.entities[i]['posFollowCamLastUpdate'] = Vector.initFrom(Entity.entities[i].pos);
				continue;
			}
			let moveThisUpdate = Vector.init( //distance move during this update.
				Entity.entities[i].pos.x - Entity.entities[i]['posFollowCamLastUpdate'].x,
				Entity.entities[i].pos.y - Entity.entities[i]['posFollowCamLastUpdate'].y
			);
			Entity.entities[i].pos = Vector.add(Camera.pos, Entity.entities[i]['posFollowCamLastUpdate'], moveThisUpdate); //apply distance, and distance move, starting from cam pos.
			Entity.entities[i]['posFollowCamLastUpdate'] = Vector.initFrom(Entity.entities[i].pos); //backup for next update.
		}
	},
	
};


/*// model of entity.
let newEntity = {
	
	isActive: true, //boolean, if draw or note the entity, can change in runtime (send at creation).
	id: 0, //the number for distinct every entity (send at creation).
	idLevel: null, //the number for level associed (send at creation).
	
	pos: Vector.init(), //position in world.
	size: Vector.init(), //size of sprite.
	~encrage: Vector.init(), //pos meaning by size sprite, betwin 0 and 1.
	~rotate: 0, //rotation of sprite, 0 to 360.
	~rotateEncrage: false, //apply rotation at encrage position (default center of sprite).
	zIndex: 1000, //value for order sprite render, 
		//2000:backgroundLayer,
	    //1000:playerLayer, 
	    // 500:HUD...
	--fixAtScreen: false, //if pos is apply at screen. [remove in 1.2 !!! become followCam]
	~followCam: false, //if an entity is followCam, his position remove every update to follow the camera pos.
	~isHud: false, //not apply cam zoom.
	
	~geometrySolid: [      //the entity have colide/physics systeme.
	    Rectangle.init(),
	    Circle.init()
	],
	
	~geometryTrigger: [    //the entity have rect trigger when a solid enter into.
	    Rectangle.init(),
	    Circle.init()
	],
	
	~eventClick: function(entity, evnt) {}, //event for mouse click (using rectTrigger for find mouse).
	~eventEnter: function(entity, evnt) {}, //event for mouse enter (over enter).
	~eventLeave: function(entity, evnt) {}, //event for mouse leave (over exit).
	
	~eventTrigger: function(entityTrigger, entitySolid){}, //event for solid enter in trigger.
	
	~uniqueSprite: Loading.loadAnImage('...'), //if the entity have only one sprite and never change.
	
	~noSprite: false, //when the entity has no render at screen (send at creation).
	
	~isPlayer: false, //the entity is a player.
	
	~state: 'MyEntity_default', //state of entity, refer to the sprite declare.
	~timeOfLastChangeState: 0, //save the time now of last frame change state. (for animation)
	~manySprite: {
		'...': { //name state.
			img: Loading.loadAnImage('...')
		},
		'...': {
			imgs [Loading.loadAnImage('...')],
			delayAnime: 1000 //delay for loop animation in milisec.
		}
	},
	
};
//*/