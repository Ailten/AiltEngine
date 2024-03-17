
//manage entity mob demo.

const MobDemo = {

    manySprite: null,
	uniqueSize: Vector.init(100, 100),
	uniqueEncrage: Vector.init(.5, .5),
	uniqueGeometrySolid: [ //colide.
		Circle.init(
		    Vector.init(0,0), 
			50
		)
	],

    init: function(pos=null, state='MobWhite', nameLevel){
		
		if(!this.manySprite){ //first call, load sprite.
			this.manySprite = {
				MobWhite: {
				    img: Loading.loadAnImage('./Entity/MDemo/MDemo1.png')
				},
				MobRed: {
				    img: Loading.loadAnImage('./Entity/MDemo/MDemo2.png')
				},
			};
		}
		
		let e = {
			
			pos: pos || Vector.init(0, 0), //position in world.
			size: this.uniqueSize, //size of sprite.
			encrage: this.uniqueEncrage, //encrage.
			zIndex: 1000, //value for order sprite render.
			
			geometrySolid: this.uniqueGeometrySolid, //rect solid for colide.
			
			state: state, //current of entity state.
			manySprite: this.manySprite //unique sprite object image.
			
		};
		
		Entity.addEntity(e, nameLevel); //push to the entities list.
		
		return e;
		
	}

};