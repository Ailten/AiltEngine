
//entity player demo.

const PlayerDemo = {
	
	//params static in block PlayerDemo (for have one instance of params, when instentiate many entity).
	uniqueSprite: null,
	uniqueSize: Vector.init(100, 100),
	uniqueEncrage: Vector.init(.5, .5),
	uniqueGeometrySolid: [
		Circle.init(
			Vector.init(0, 0),
			40
		)
	],

    //function for initialize/instantiate an entity PlayerDemo.
	init: function(pos, nameLevel){
		
		if(!this.uniqueSprite){
			this.uniqueSprite = Loading.loadAnImage('./Entity/PlayerDemo/PlayerDemo.png');
		}
		
		let e = {
			pos: pos,
			size: this.uniqueSize, //size of sprite.
			encrage: this.uniqueEncrage, //encrage.
			scale: Vector.init(1, 1), //scale.
			rotate: 0, //rotation.
			zIndex: 1000, //value for order sprite render.
			
			uniqueSprite: this.uniqueSprite, //unique sprite object image.
			
			geometrySolid: this.uniqueGeometrySolid, //geometry solid of entity.
			
			isPlayer: true, //tag.
		};
		
		Entity.addEntity(e, nameLevel); //push to the entities list (and add some params).
		
		return e;
		
	},

};