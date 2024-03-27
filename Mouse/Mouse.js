
//manage mouse event.

const Mouse = {
	
	entityMouse: null, //fake entity for mouse.
	entityFind: null, //entity find with mouse.
	
	//init the mouse manager.
	initMouse: function() {
		
		this.entityMouse = {
			pos: Vector.init(0, 0), //pos click.
			size: Vector.init(0, 0),
			encrage: Vector.init(0.5, 0.5),
			rotate: 0,
			scale: Vector.init(1, 1),
			zIndex: 1,
			
			geometrySolid: [ //zone colide click.
			    Circle.init(
				    Vector.init(0, 0),
					4
				)
			],
			noSprite: true,
			isMouse: true,
		};
		
		Canvas.canvasHTML.addEventListener('click', function(evnt){
			Mouse.mouseEvent(evnt, 'click');
		});
		Canvas.canvasHTML.addEventListener('mousemove', function(evnt){
			Mouse.mouseEvent(evnt, 'over');
		});
		
		Canvas.canvasHTML.addEventListener('wheel', function(evnt){
			Mouse.wheelScrol(Math.round(evnt.deltaY/100));
		});
		
	},
	
	//handle an event mouse.
	mouseEvent: function(evnt, typeEvent){
		
		this.entityMouse.pos.x = Math.floor(evnt.offsetX /Canvas.ratioEnvironement); //replace pos obj click to mouse pos.
		this.entityMouse.pos.y = Math.floor(evnt.offsetY /Canvas.ratioEnvironement);
		
		this.entityMouse.pos.y = Canvas.size.y - this.entityMouse.pos.y; //reverce y axis (froomTopToDown to fromDownToTop).
		
		this.entityMouse.pos.x = Math.floor(this.entityMouse.pos.x - Canvas.size.x/2); //normalize on center canvas.
		this.entityMouse.pos.y = Math.floor(this.entityMouse.pos.y - Canvas.size.y/2);
		
		this.entityMouse.pos.x *= 1/Camera.scale.x; //apply camera zoom.
		this.entityMouse.pos.y *= 1/Camera.scale.y;
		
		this.entityMouse.pos.x += Camera.pos.x; //place encrage from camera.
		this.entityMouse.pos.y += Camera.pos.y;
		
		let entityColide = Colide.executeEventTriggerFind(this.entityMouse, 'triggerByMouse'); //get entity is colide to mouse.
		
		if(typeEvent == 'click' && entityColide != null && entityColide['eventClick']){ //do click.
		    entityColide.eventClick(entityColide, evnt);
		    return;
		}
		
		if(this.entityFind == null && entityColide == null) //nothing.
			return;
		else if(this.entityFind != null && entityColide == null && this.entityFind['eventLeave']) //exit last obj.
			this.entityFind.eventLeave(this.entityFind, evnt);
		else if(this.entityFind == null && entityColide != null && entityColide['eventEnter']) //enter new obj.
			entityColide.eventEnter(entityColide, evnt);
		else if(this.entityFind != null && entityColide != null && this.entityFind.id != entityColide.id){ //exit last obj + enter new obj.
		    if(this.entityFind['eventLeave'])
		        this.entityFind.eventLeave(this.entityFind, evnt);
			if(entityColide['eventEnter'])
			    entityColide.eventEnter(entityColide, evnt);
		}
		
		this.entityFind = entityColide; //save new obj as last obj.
		
	},
	
	wheelScrol: function(y) { //overide this function for event scrol.
		console.log('scrol : '+y)
	},
	
	//function to map a sprite to mouse.
	setSprite: function(pathSprite, size=null){
		this.entityMouse.noSprite = undefined;
		this.entityMouse['uniqueSprite'] = Loading.loadAnImage(pathSprite);
		this.entityMouse['size'] = size || Vector.init(20, 20);
		this.entityMouse['encrage'] = Vector.init(0, 1);
		this.entityMouse['isHud'] = true;
		Canvas.canvasHTML.style.cursor = 'none';
	}

};