
//manage entity Trigger zone demo.

const TriggerZoneDemo = {
	
	uniqueGeometryTrigger: [
	    Rectangle.init(
		    Vector.init(-150, 150),
		    Vector.init(150, -150)
		)
	],

    init: function(pos, nameLevel) {
		
	    let e = {
			
			pos: pos, //position in world.
			zIndex: 1000, //value for order sprite render.
			
			noSprite: true,
			
			geometryTrigger: this.uniqueGeometryTrigger, //rect solid for colide.
			
			eventTrigger: this.eventTriggerDefault,
			
		};
		
		Entity.addEntity(e, nameLevel); //push to the entities list.
		
		return e;
		
	},
	
	//event by default, for debug trigger.
	eventTriggerDefault: function(entityTrigger, entitySolide) {
		
		console.log('entity ['+entitySolide.id+'] trigger into entity ['+entityTrigger.id+']');
		
	}

};