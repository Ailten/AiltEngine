
//manage the canvas.

const Canvas = {

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
		    e.isActive  //only all isActive entity.
		)).forEach((e) => {
			
			let posECanvas = Canvas.evalPosToDraw(e); //pos entity current cast into canvas pos.
			
			if(!e['noSprite'])
				Canvas.drawEntity(e, posECanvas);
			
			if(e['addDraw'])
				e.addDraw(e, posECanvas);
			
			if(Canvas.debug){
				if(e['geometrySolid'])
					Canvas.drawEntityGeometry(e, posECanvas, 'geometrySolid', 'blue');
				if(e['geometryTrigger'])
					Canvas.drawEntityGeometry(e, posECanvas, 'geometryTrigger', 'orange');
			}
			
		});
		
		if(Camera.rotate != 0){ //undo rotate sceen.
		    Canvas.canvasContext.translate(Canvas.size.x/2, Canvas.size.y/2); //translate to center sceen.
			Canvas.canvasContext.rotate(Math.degreeToEuler(-Camera.rotate)); //un-rotate all sceen
			Canvas.canvasContext.translate(-Canvas.size.x/2, -Canvas.size.y/2);
		}
		
		if(Canvas.debug){
			let posECanvas = Canvas.evalPosToDraw(Mouse.entityMouse);
			Canvas.drawEntityGeometry(Mouse.entityMouse, posECanvas, 'geometrySolid', 'blue');
		}
		
		if(Level.transitionIsActive){ //draw transition level.
			Canvas.drawRect(
			    Vector.init(0, 0), 
				Canvas.size, 
				'rgb(0,0,0, '+(Level.transitionOpacity)+')', 
				true
			);
		}
		
	},
	
	//draw a rectangle.
    drawRect: function(pos, size, color='#000', fill=false){
    	
		if(fill){
			
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
	drawCircle: function(pos, rayon, color='#000', fill=false){
		
		if(fill){
			
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
	drawLine: function(posA, posB, color='#000', thicness=1) {
		
		this.canvasContext.beginPath();
		this.canvasContext.lineWidth = thicness;
		this.canvasContext.strokeStyle = color;
		this.canvasContext.moveTo(posA.x, posA.y);
		this.canvasContext.lineTo(posB.x, posB.y);
		this.canvasContext.stroke();
		
	},
	//draw an array of geometry lines.
	drawArrayLines: function(lines, color='#000', posCanvas=null){
		
		posCanvas ||= Vector.multiplyNum(Canvas.size, 0.5);
		
		this.canvasContext.beginPath();
		this.canvasContext.lineWidth = 1;
		this.canvasContext.strokeStyle = color;
		
		lines.forEach(l => {
			let posA = Vector.add(posCanvas, l.posStart);
			let posB = Vector.add(posCanvas, l.posEnd);
			
			this.canvasContext.moveTo(posA.x, posA.y);
			this.canvasContext.lineTo(posB.x, posB.y);
		});
		
		this.canvasContext.stroke();
	},
	
	//draw a text.
	drawTxt: function(txt, pos, color='black', typoSize=20, typo='Trebuchet MS', alignX=.5, alignY=.5){
		
		this.canvasContext.font = typoSize+'px '+typo;
		this.canvasContext.fillStyle = color;
		Canvas.canvasContext.textAlign = (
			(alignX == 0)? 'left':
			(alignX == 1)? 'right':
			'center'
		);
		Canvas.canvasContext.textBaseline = (
			(alignY == 0)? 'bottom':
			(alignY == 1)? 'top':
			'middle'
		);
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
	drawEntity: function(entity, posECanvas){
		
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
		
		let posToDraw = Vector.initFrom(posECanvas);
		let encrageForCanvas = Vector.init(entity.encrage.x, 1-entity.encrage.y);
		let camZoom = (entity['isHud']? Vector.init(1, 1): Camera.scale);
		
		posToDraw.x -= (entity.size.x*entity.scale.x) *camZoom.x *encrageForCanvas.x; //start to draw att encrage replacement (in canvas value).
		posToDraw.y -= (entity.size.y*entity.scale.y) *camZoom.y *encrageForCanvas.y;
		
		if(entity.rotate != 0){ //draw img with rotation.
			
			posToDraw.x += (entity.size.x*entity.scale.x) *encrageForCanvas.x;
			posToDraw.y += (entity.size.y*entity.scale.y) *encrageForCanvas.y;
		
		    Canvas.canvasContext.translate(posToDraw.x, posToDraw.y); //translate + rotate.
			Canvas.canvasContext.rotate(Math.degreeToEuler(entity.rotate));
			
			Canvas.drawImg( //draw.
			    img, 
				Vector.init(
					-(entity.size.x*entity.scale.x)*(entity.encrage.x), 
					-(entity.size.y*entity.scale.y)*(1-entity.encrage.y)
				),
				Vector.init(
					(entity.size.x*entity.scale.x) *camZoom.x,
					(entity.size.x*entity.scale.y) *camZoom.y
				)
			);
			
			Canvas.canvasContext.rotate(-Math.degreeToEuler(entity.rotate)); //cancel translate + rotate.
		    Canvas.canvasContext.translate(-posToDraw.x, -posToDraw.y);
			
		}else{ //draw without rotate.
			
		    Canvas.drawImg(
		        img, //obj image loaded.
		    	Vector.floor(posToDraw), //position to draw in canvas.
				Vector.init( //size of sprite draw.
					(entity.size.x*entity.scale.x) *camZoom.x,
					(entity.size.x*entity.scale.y) *camZoom.y
				)
		    );
			
		}
		
	},
	
	//draw rectangle solid of an entity.
	drawEntityGeometry: function(entity, posECanvas, geometry='geometrySolid', color='#000'){
		
		entity[geometry].forEach(geo => {
			
			let arrayLines = Geometry.getArrayLinesFromGeometry(
				geo, 
				posECanvas, 
				entity.rotate, 
				entity.scale
			);
			
			for(let i=0; i<arrayLines.length; i++){ //reverce y for canvas.
				arrayLines[i].posStart = Vector.substract(arrayLines[i].posStart, posECanvas);
				arrayLines[i].posEnd = Vector.substract(arrayLines[i].posEnd, posECanvas);
				arrayLines[i].posStart.y *= -1;
				arrayLines[i].posEnd.y *= -1;
				arrayLines[i].posStart = Vector.add(arrayLines[i].posStart, posECanvas);
				arrayLines[i].posEnd = Vector.add(arrayLines[i].posEnd, posECanvas);
			}
			
			Canvas.drawArrayLines(
				arrayLines, 
				color,
				Vector.init(0, 0)
			);
			
		});
		
	},
	
	//calculate the pos to start draw in canvas, for an entity.
	evalPosToDraw: function(entity) {
		
		let posToDraw = Vector.initFrom(entity.pos); //pos of object to draw.
		
		posToDraw.x -= Camera.pos.x; //substract cam pos.
		posToDraw.y -= Camera.pos.y;
		
		if(!entity['isHud']){
			posToDraw.x *= Camera.scale.x; //zoom sceen (if came has zoom value).
			posToDraw.y *= Camera.scale.y;
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