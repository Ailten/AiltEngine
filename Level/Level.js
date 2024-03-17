
//manage all levels.

const Level = {

    levels: [], //list of all block level can be load.
	
	//set a level in array.
	addLevel: function(blockLevel, nameLevel) {
		
		blockLevel['name'] = nameLevel;
		blockLevel['isActive'] = false;
		blockLevel['id'] = this.levels.length; //set an id to the level.
		blockLevel['timeStartLevel'] = 0; //used calculate the time paste from player start a level.
		
		this.levels.push(blockLevel);
		
	},
	
	//get level by his name.
	findLevel: function(nameLevel) {
		return this.levels.find((l) => l.name == nameLevel);
	},
	
	//active/unactive a level (do instantly).
	activeLevel: function(nameLevel, active=true) {
		
		let lvl = this.findLevel(nameLevel);
		
		lvl.isActive = active; //active the level.
		
		if(active){ //active lvl.
		
		    lvl.loadEntity(); //create all entity of lvl.
			
		    Entity.sortZIndex(); //after create new entity, sort by zIndex.
			
			lvl.timeStartLevel = Update.time; //safe the time when level is activated.
			
		}else{ //unactive lvl.
		
		    Entity.entities = Entity.entities.filter((e) => e.idLevel != lvl.id); //drop all entity of lvl.
		
		    if(lvl.cleanLevel)
			    lvl.cleanLevel(); //clean.
			
		}
		
	},
	
	transitionDelay: 1000, //time in milisec, for transition from one level to another.
	transitionStartTime: 0, //time when transition start.
	transitionFrom: null, //level from.
	transitionTo: null, //level to.
	transitionIsActive: false, //flag for during transition.
	transitionMidAnimationPass: false, //flag for midel of animation (do the active/unactive in mid anime).
	transitionOpacity: 0, //the opacity of transition.
	
	//transition from one level to another.
	transitionLevel: function(fromLevel=null, toLevel=null) {
		
		this.transitionFrom = fromLevel; //data for transition.
		this.transitionTo = toLevel;
		this.transitionStartTime = Update.time;
		this.transitionIsActive = true;
		this.transitionMidAnimationPass = false;
		this.transitionOpacity = 0;
		
	},
	
	//update for the level manager.
	updateLevel: function(){
		
		if(this.transitionIsActive){ //manage transition scene update.
			
			let i = (Update.time - this.transitionStartTime) / this.transitionDelay;
			
			if(i >= 0.5 && !this.transitionMidAnimationPass){ //mid transition, switch scene when all is mask.
				
		        this.transitionOpacity = 1;
				this.transitionMidAnimationPass = true;
				
				if(this.transitionFrom){
				    Level.activeLevel(this.transitionFrom, false); //unactive level from.
					
		            Audio.longVolume(this.transitionFrom, 0); //audio of level from.
		            Audio.longStop(this.transitionFrom);
				}
				if(this.transitionTo){
				    Level.activeLevel(this.transitionTo, true); //active level to.
		
		            Audio.longVolume(this.transitionTo, 0); //audio of level to.
		            Audio.longPlay(this.transitionTo);
				}
				
				return;
			}
			
			if(i >= 1){ //end transition.
			
		        this.transitionIsActive = false;
				
				if(this.transitionTo){
		            Audio.longVolume(this.transitionTo, 1); //audio of level to.
				}
				
				return;
			}
			
			if(i < .5){ //0 to .5.
				i = i*2; //0 to 1.
				
				this.transitionOpacity = i; //opacity up.
			
			    if(this.transitionFrom){
		            Audio.longVolume(this.transitionFrom, 1-i); //audio down.
			    }
			}else{ //.5 to 1.
				i = (i-.5) *2; //0 to 1.
				
				this.transitionOpacity = 1-i; //opacity down.
				
			    if(this.transitionTo){
		            Audio.longVolume(this.transitionTo, i); //audio up.
			    }
			}
			
		}
		
	},
	
	//call the update function of all level active.
	updateAllLevels: function() {
		this.levels.forEach((l) => {
			if(l.isActive && l.updateLevel)
				l.updateLevel();
		});
	},
	
	

};


/*// model of level.
let newLevel = {
	
	name: 'newLevel', //name of the level in string (sent in param when create).
	isActive: false, //if this level is active at screen (sent when create).
	id: 0, //the index in array level (sent when create).
	timeStartLevel: 0, //the time when the level start (sent when create).
	
    loadEntity: function() {}, //function for load entity of level.
	
	~updateLevel: function() {}, //do the update specify of this menu.
	~cleanLevel: function() {}, //use to clean or reset variable (when a level is unload).
};
//*/