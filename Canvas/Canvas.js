
//manage the canvas.

const Canvas = { //[ADD:V1.1]

    canvasHTML: null, //dom canvas.
	canvasContext: null, //context 2d canvas.
	
	size: Vector.init(), //resolution.
	
	ratioCanvas: null, //ratio of resolution canvas.
	ratioWindow: null, //ratio of window.
	ratioEnvironement: null, //ratio for environement canvas to dom.
	
	debug: false, //draw more information (for debuging).
	
	//set up a canvas in body html.
	initCanvas: function(size=null) {
		
		this.size = size || Vector.init(1280, 720);
		this.ratioCanvas = (this.size.x / this.size.y);
		
		this.canvasHTML = document.body.appendChild(document.createElement('canvas'));
		this.setBackgroundColor('#000');
		this.setBodyBackgroundColor('#000');
		this.canvasHTML.style.position = 'absolute';
		this.canvasHTML.setAttribute('width', this.size.x);
		this.canvasHTML.setAttribute('height', this.size.y);
		this.canvasContext = this.canvasHTML.getContext('2d');
		
		this.resize();
		
	},
	
	//set a color in default background to the canvas.
	setBackgroundColor: function(color){
		this.canvasHTML.style.backgroundColor = color;
	},
	
	//set a color in background window (empty space over canvas).
	setBodyBackgroundColor: function(color){
		document.body.style.backgroundColor = color;
	},
	
	//resize the canvas into the window.
	resize: function(){
		
		let width = window.innerWidth;
		let height = window.innerHeight;
		this.ratioWindow = width / height;
	
	    if(this.ratioWindow < this.ratioCanvas){ //window square but canvas rect.
		
	    	this.canvasHTML.style.width = width + "px";
	    	this.canvasHTML.style.height = (width / this.ratioCanvas) + "px";
	    	this.canvasHTML.style.left = "0px";
	    	this.canvasHTML.style.top = (
	    	  (height - (width / this.ratioCanvas)) /2
	    	) + "px";
			
			this.ratioEnvironement = (width / Canvas.size.x);
			
	    }else{ //window long rect but canvas short rect.
		
	    	this.canvasHTML.style.width = (height * this.ratioCanvas) + "px";
	    	this.canvasHTML.style.height = height + "px";
	    	this.canvasHTML.style.left = (
	    	  (width - (height * this.ratioCanvas)) /2
	    	) + "px";
	    	this.canvasHTML.style.top = "0px";
			
			this.ratioEnvironement = ((height * this.ratioCanvas) / Canvas.size.x);
			
	    }
		
	},
	
	//erase all object draw in canvas.
	clean: function() {
		
		this.canvasContext.beginPath();
		this.canvasContext.clearRect(0, 0, this.size.x, this.size.y);
		this.canvasContext.stroke();
		
	},
	
	//draw all entity in canvas.
	draw: function() {
		
		if(Camera.rotate != 0){ //rotate sceen.
		    Canvas.canvasContext.translate(Canvas.size.x/2, Canvas.size.y/2); //translate to center sceen.
			Canvas.canvasContext.rotate(Math.degreeToEuler(Camera.rotate)); //rotate all sceen
			Canvas.canvasContext.translate(-Canvas.size.x/2, -Canvas.size.y/2);
		}
		
		Entity.entities.filter((e) => ( //condition for draw.
		    e.isActive &&  //only all isActive entity.
			!e['noSprite'] //skip if no sprite.
		)).forEach((e) => {
			Canvas.drawEntity(e);
		});
		
		if(this.debug){
			
			Entity.entities.filter((e) => (
		        e.isActive &&  //only all isActive entity.
			    e['geometrySolid'] //skip if no sprite (but allow if mouse event).
			)).forEach((e) => {
			    Canvas.drawGeometry(e, 'geometrySolid');
		    });
			
			Entity.entities.filter((e) => (
		        e.isActive &&  //only all isActive entity.
			    e['geometryTrigger'] //skip if no sprite (but allow if mouse event).
			)).forEach((e) => {
			    Canvas.drawGeometry(e, 'geometryTrigger');
		    });
			
		}
		
		if(Camera.rotate != 0){ //undo rotate sceen.
		    Canvas.canvasContext.translate(Canvas.size.x/2, Canvas.size.y/2); //translate to center sceen.
			Canvas.canvasContext.rotate(Math.degreeToEuler(-Camera.rotate)); //un-rotate all sceen
			Canvas.canvasContext.translate(-Canvas.size.x/2, -Canvas.size.y/2);
		}
		
		if(this.debug){
			
			Canvas.drawGeometry(Mouse.entityMouse, 'geometrySolid');
			
		}
		
		if(Level.transitionIsActive){ //draw transition level.
			this.drawRect(
			    Vector.init(0, 0), 
				Canvas.size, 
				'rgb(0,0,0, '+(Level.transitionOpacity)+')', 
				true
			);
		}
		
	},
	
	//draw a rectangle.
    drawRect: function(pos, size, color='#000', full=false){
    	
		if(full){
			
		    this.canvasContext.fillStyle = color;
		    this.canvasContext.fillRect(
		        pos.x, pos.y,
		    	size.x, size.y
		    );
			
			return;
		}
		
		this.canvasContext.strokeStyle = color;
		this.canvasContext.strokeRect(
		    pos.x, pos.y,
			size.x, size.y
		);
		
    },
	
	//draw a circle.
	drawCircle: function(pos, rayon, color='#000', full=false){
		
		if(full){
			
		    this.canvasContext.fillStyle = color;
		    this.canvasContext.arc(
		        pos.x, pos.y,
		    	rayon,
				0, 2*Math.PI
		    );
            this.canvasContext.fill();
			
			return;
		}
		
		this.canvasContext.beginPath();
		this.canvasContext.strokeStyle = color;
        this.canvasContext.arc(
		    pos.x, pos.y,
		    rayon,
			0, 2*Math.PI);
        this.canvasContext.stroke();
		
	},
	
	//draw a line.
	drawLine: function(posA, posB, color='#000') {
		
		this.canvasContext.beginPath();
		this.canvasContext.strokeStyle = color;
		this.canvasContext.moveTo(posA.x, posA.y);
		this.canvasContext.lineTo(posB.x, posB.y);
		this.canvasContext.stroke();
		
	},
	
	//draw a text.
	drawTxt: function(txt, pos, color='black', typoSize=20, typo='Trebuchet MS'){
		
		this.canvasContext.font = typoSize+'px '+typo;
		this.canvasContext.fillStyle = color;
        this.canvasContext.fillText(
		    txt, 
			pos.x, pos.y
		);
		
	},
	
	//draw an img in canvas.
	drawImg: function(img, pos, size){
		
		this.canvasContext.drawImage(
		    img,
			pos.x, pos.y,
			size.x, size.y
		);
		
	},
	
	//draw sprite of an entity.
	drawEntity: function(entity){
		
		let img = null;
		
		if(entity['uniqueSprite']){
			
			img = entity.uniqueSprite;
			
		}else if(entity['manySprite']){
			
			img = entity.manySprite[entity.state];
			
			if(img['img']){
				
				img = img.img;
				
			}else{ //else = imgs. (animation)
				
				let i = Update.time - entity.timeOfLastChangeState; //start anime from change state.
				i %= img.delayAnime; //clamp to the time loop anime.
				i /= img.delayAnime; //normalise 0 to 0.99.
				i *= img.imgs.length; //multiply by quantity frame in anime.
				i = Math.floor(i); //round for use as index.
				img = img.imgs[i];
				
			}
			
		}
		
		let posToDraw = Canvas.evalPosToDraw(entity);
		
		posToDraw.x -= entity.size.x *(entity['isHud']?1:Camera.zoom) *entity.encrage.x; //start to draw att encrage replacement (in canvas value).
		posToDraw.y -= entity.size.y *(entity['isHud']?1:Camera.zoom) *(1-entity.encrage.y);
		
		if(entity['rotate']){ //draw img with rotation.
			
			if(entity['rotateEncrage']){
				posToDraw.x += entity.size.x * entity.encrage.x;
				posToDraw.y += entity.size.y * (1-entity.encrage.y);
			}else{
				posToDraw.x += entity.size.x * .5;
				posToDraw.y += entity.size.y * .5;
			}
		
		    Canvas.canvasContext.translate(posToDraw.x, posToDraw.y); //translate + rotate.
			Canvas.canvasContext.rotate(Math.degreeToEuler(entity.rotate));
			
			if(entity['rotateEncrage']){
			    Canvas.drawImg( //draw.
			        img, 
			    	Vector.init(-entity.size.x*(entity.encrage.x), -entity.size.y*(1-entity.encrage.y)), //TODO: try hard code (0;0).
			    	Vector.multiply(entity.size, (entity['isHud']?1:Camera.zoom))
			    );
			}else{
			    Canvas.drawImg( //draw.
			        img, 
			    	Vector.init(-entity.size.x/2, -entity.size.y/2),  //TODO: try hard code (0;0).
			    	Vector.multiply(entity.size, (entity['isHud']?1:Camera.zoom))
			    );
			}
			
			Canvas.canvasContext.rotate(-Math.degreeToEuler(entity.rotate)); //cancel translate + rotate.
		    Canvas.canvasContext.translate(-posToDraw.x, -posToDraw.y);
			
		}else{ //draw without rotate.
		
			posToDraw.x = Math.floor(posToDraw.x); //round pos for no spacing between two entity.
			posToDraw.y = Math.floor(posToDraw.y);
			
		    Canvas.drawImg(
		        img, //obj image loaded.
		    	posToDraw, //position to draw in canvas.
		    	Vector.multiply(entity.size, (entity['isHud']?1:Camera.zoom)) //size of sprite draw.
		    );
			
		}
		
	},
	
	//draw rectangle solid of an entity.
	drawGeometry: function(entity, geometry){
		
		let color = (geometry == 'geometrySolid'? 'blue': 'orange');
		
		let posToDraw = Canvas.evalPosToDraw(entity); //pos of object to draw.
		
		for(let ei=0; ei<entity[geometry].length; ei++){
			
			if(entity[geometry][ei].type == 'Rectangle'){
			    Canvas.drawRect(
			        Vector.init(
			    	    posToDraw.x + entity[geometry][ei].posUpLeft.x *Camera.zoom, 
			    		posToDraw.y - entity[geometry][ei].posUpLeft.y *Camera.zoom
			    	), 
			    	Vector.multiply(Vector.init(
			    	    entity[geometry][ei].posDownRight.x - entity[geometry][ei].posUpLeft.x,
			    		entity[geometry][ei].posUpLeft.y - entity[geometry][ei].posDownRight.y
			    	), Camera.zoom), 
			    	color, 
			    	false
			    );
			}
			else if(entity[geometry][ei].type == 'Circle'){
				Canvas.drawCircle(
				    Vector.init(
					    posToDraw.x + entity[geometry][ei].pos.x *Camera.zoom,
					    posToDraw.y - entity[geometry][ei].pos.y *Camera.zoom
					),
					entity[geometry][ei].rayon *Camera.zoom,
			    	color, 
					false
				);
			}
			
		}
		
	},
	
	//calculate the pos to start draw in canvas, for an entity.
	evalPosToDraw: function(entity) {
		
		let posToDraw = Vector.initFrom(entity.pos); //pos of object to draw.
		
		posToDraw.x -= Camera.pos.x; //substract cam pos.
		posToDraw.y -= Camera.pos.y;
		
		if(!entity['isHud']){
			posToDraw.x *= Camera.zoom; //zoom sceen (if came has zoom value).
			posToDraw.y *= Camera.zoom;
		}
		
		posToDraw.x += Canvas.size.x /2; //pos cam is focusing center of screen.
		posToDraw.y += Canvas.size.y /2;
		
		posToDraw.y = Canvas.size.y - posToDraw.y; //invers y axis for draw in canvas.
		
		return posToDraw;
		
	},

};


//event for make resize canvas every time the window was change resolution.
window.addEventListener('resize', function() {
	Canvas.resize();
});