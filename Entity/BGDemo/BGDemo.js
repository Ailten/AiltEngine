
// entity background demo.

const BackgroundDemo = {

    uniqueSprite: null,
	uniqueEncrage: Vector.init(0, 0),

    init: function(nameLevel) {
		
		if(!this.uniqueSprite){ //first call, load sprite.
			this.uniqueSprite = Loading.loadAnImage('./Entity/BGDemo/BGDemo.png');
		}
		
		let e = {
			
			pos: Vector.init(-Canvas.size.x/2, -Canvas.size.y/2), //position in world.
			encrage: this.uniqueEncrage,
			size: Canvas.size, //size of sprite.
			zIndex: 2000, //value for order sprite render.
			
			uniqueSprite: this.uniqueSprite //unique sprite object image.
			
		};
		
		Entity.addEntity(e, nameLevel); //push to the entities list.
		
		return e;
		
	}

};