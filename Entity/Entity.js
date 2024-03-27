
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
		
		if(newEntity['uniqueSprite']==undefined && newEntity['manySprite']==undefined) //if has no sprite, tag "noSprite" (for skip draw).
			newEntity['noSprite'] = true;
		if(newEntity['pos']==undefined)
			newEntity['pos'] = Vector.init(0, 0);
		if(newEntity['size']==undefined)
			newEntity['size'] = Vector.init(100, 100);
		if(newEntity['encrage']==undefined)
			newEntity['encrage'] = Vector.init(.5, .5);
		if(newEntity['rotate']==undefined)
			newEntity['rotate'] = 0;
		if(newEntity['scale']==undefined)
			newEntity['scale'] = Vector.init(1, 1);
		if(newEntity['zIndex']==undefined)
			newEntity['zIndex'] = 1000;
		
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
	
	pos: Vector.init(0, 0), //position in world.
	size: Vector.init(1, 1), //size of sprite.
	~encrage: Vector.init(.5, .5), //pos meaning by size sprite, betwin 0 and 1.
	~rotate: 0, //rotation of sprite, 0 to 360.
	~scale: Vector.init(1, 1), //scale entity (size multiplyer).
	zIndex: 1000, //value for order sprite render, 
		//2000:backgroundLayer,
	    //1000:playerLayer, 
	    // 500:HUD...
	
	~followCam: false, //if an entity is followCam, his position remove every update to follow the camera pos.
	~isHud: false, //not apply cam zoom.
	
	~geometrySolid: [      //the entity have colide/physics systeme.
		Line.init(),
	    Circle.init(),
		Triangle.init(),
	    Rectangle.init(),
		Geometry.init(),
	],
	
	~geometryTrigger: [    //the entity have rect trigger when a solid enter into.
		Line.init(),
	    Circle.init(),
		Triangle.init(),
	    Rectangle.init(),
		Geometry.init(),
	],
	~eventTrigger: function(entityTrigger, entitySolid){}, //event for solid enter in trigger.
	
	~eventClick: function(entity, evnt) {}, //event for mouse click (using rectTrigger for find mouse).
	~eventEnter: function(entity, evnt) {}, //event for mouse enter (over enter).
	~eventLeave: function(entity, evnt) {}, //event for mouse leave (over exit).
	~triggerByMouse: false, //colision tag, for entity can be trigger by mouse (hover, enter, leave).
	
	~uniqueSprite: Loading.loadAnImage('...'), //if the entity have only one sprite and never change.
	
	~noSprite: false, //when the entity has no render at screen (send at creation).
	
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
	
	~addDraw: function(entity, posEntityCanvas){}, //event add after draw in entity in canvas (for add draw).
	
	~isPlayer: false, //tag, entity is a player (not use on engine, but standard usefull).
	~isMouse: false, //tag, entity is the mouse fake entity.
	
};
//*/